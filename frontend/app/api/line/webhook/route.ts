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

const VALID_CATEGORIES = [
  'Kubota News', 'Kubota ZT News', 'Kubota Second News',
  'Yanmar News', '【entity-John Deere¦canonical_name=John Deere】 News', 'New Holland News',
  'YTO News', 'Sonalika News', 'Yamabisi News',
  'Mahindra News', 'Dongfeng News', 'Mahindra and Dongfeng News',
  'DeutzFhar & Matador News', 'Crop Price & News', 
  'Fuel Price & News', 'Exchange Rates', 'Myanmar News', 'Other Brand News'
]

async function uploadImageToSanity(imageBuffer: Buffer) {
  const asset = await sanity.assets.upload('image', imageBuffer, {
    filename: `line-${Date.now()}.jpg`,
  })
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
}

function parseNewsMessage(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const hashtags = lines.filter(l => l.startsWith('#')).map(l => l.replace('#','').trim())

  // #News မပါရင် ignore
  if (!hashtags.some(h => h.toLowerCase() === 'news')) return null

  // Company = #Win Shwe Wah
  const company = hashtags.find(h => 
    h.toLowerCase() !== 'news' && 
    !VALID_CATEGORIES.map(c=>c.toLowerCase()).includes(h.toLowerCase())
  ) || 'Win Shwe Wah'

  // Category = #Kubota Second News (3rd hashtag)
  let category = 'Myanmar News'
  for (const h of hashtags) {
    const matched = VALID_CATEGORIES.find(c => c.toLowerCase() === h.toLowerCase())
    if (matched) { category = matched; break }
  }

  // TT: Link
  const urlMatch = text.match(/(?:TT:|Source:|Link:)\s*(https?:\/\/[^\s]+)/i) || text.match(/(https?:\/\/[^\s]+)/i)
  const sourceUrl = urlMatch ? (urlMatch[1] || urlMatch[0]) : ''

  // Content = hashtag နဲ့ TT: မပါတဲ့ ကျန်တာ
  const contentLines = lines.filter(l => 
    !l.startsWith('#') && 
    !l.toLowerCase().startsWith('tt:') &&
    !l.toLowerCase().startsWith('source:') &&
    !l.toLowerCase().startsWith('link:') &&
    !l.match(/^https?:\/\//)
  )
  const content = contentLines.join('\n').trim()
  const title = contentLines[0]?.slice(0, 200) || `${company} - ${category}`

  return { company, category, sourceUrl, content, title }
}

export async function POST(req: NextRequest) {
  const bodyText = await req.text()
  const signature = req.headers.get('x-line-signature') || ''
  const secret = process.env.LINE_CHANNEL_SECRET || ''
  
  // Verify signature (dev မှာ skip လို့ရတယ်)
  if (secret) {
    const hash = crypto.createHmac('SHA256', secret).update(bodyText).digest('base64')
    if (hash !== signature) {
      console.warn('Invalid LINE signature')
    }
  }

  const body = JSON.parse(bodyText)
  const event = body.events?.[0]
  if (!event) return NextResponse.json({ ok: true })

  // Text message - #News format
  if (event.type === 'message' && event.message.type === 'text') {
    const parsed = parseNewsMessage(event.message.text as string)
    if (!parsed) return NextResponse.json({ ok: true })

    await sanity.create({
      _type: 'newsPortal',
      title: parsed.title,
      brand: parsed.company, // Brand / Company Name
      category: parsed.category, // Category
      sourceUrl: parsed.sourceUrl, // Source URL
      body: parsed.content,
      content: parsed.content,
      publishedAt: new Date().toISOString(),
      slug: { current: `line-${Date.now()}` }
    })
    return NextResponse.json({ ok: true })
  }

  // Image message - ပုံကို နောက်ဆုံးသတင်းမှာ ထည့်
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

  return NextResponse.json({ ok: true })
}