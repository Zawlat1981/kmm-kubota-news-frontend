import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@sanity/client'

export const runtime = 'nodejs'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
})

async function uploadImageToSanity(imageBuffer: Buffer) {
  const asset = await sanity.assets.upload('image', imageBuffer, {
    filename: `line-${Date.now()}.jpg`,
  })
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
}

export async function POST(req: NextRequest) {
  const bodyText = await req.text()
  const signature = req.headers.get('x-line-signature') || ''
  const hash = crypto.createHmac('SHA256', process.env.LINE_CHANNEL_SECRET!).update(bodyText).digest('base64')
  if (hash !== signature) return NextResponse.json({ error: 'Invalid' }, { status: 401 })

  const body = JSON.parse(bodyText)
  const event = body.events?.[0]
  if (!event) return NextResponse.json({ ok: true })

  if (event.type === 'message' && event.message.type === 'text') {
    const text = event.message.text as string
    if (!text.startsWith('#news')) return NextResponse.json({ ok: true })
    const clean = text.replace('#news', '').trim()
    const [firstLine, ...rest] = clean.split('\n')
    await sanity.create({
      _type: 'newsPortal',
      title: firstLine || 'LINE သတင်း',
      brand: 'LINE Group',
      category: 'kubota-news',
      publishedAt: new Date().toISOString(),
      body: rest.join('\n') || clean,
    })
    return NextResponse.json({ ok: true })
  }

  if (event.type === 'message' && event.message.type === 'image') {
    const messageId = event.message.id
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN!
    const res = await fetch(`https://api-data.line.me/v2/bot/message/${messageId}/content`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const buffer = Buffer.from(await res.arrayBuffer())
    const sanityImage = await uploadImageToSanity(buffer)
    const lastNews = await sanity.fetch(`*[_type == "newsPortal" && !defined(mainImage)] | order(_createdAt desc)[0]{_id}`)
    if (lastNews?._id) {
      await sanity.patch(lastNews._id).set({ mainImage: sanityImage }).commit()
    }
    return NextResponse.json({ ok: true })
  }

}