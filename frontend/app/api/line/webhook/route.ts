import { NextRequest, NextResponse } from 'next/server'
import { messagingApi } from '@line/bot-sdk'
import { createClient } from '@sanity/client'

type LineEvent = {
  type: string
  replyToken: string
  message?: { type: string; text: string; id: string }
  source: { type: string; groupId?: string; roomId?: string; userId: string }
}

type WebhookBody = {
  events?: LineEvent[]
}

function detectCategory(text: string): { category: string; branch: string; tags: string[] } {
  const lower = text.toLowerCase()
  let category = 'General'
  let branch = 'KMM'
  
  // Category detection
  if (lower.includes('kubota news') || lower.includes('#kubota')) category = 'Kubota News'
  else if (lower.includes('yanmar news') || lower.includes('#yanmar')) category = 'Yanmar News'
  else if (lower.includes('hitachi') || lower.includes('#hitachi')) category = 'Hitachi News'
  else if (lower.includes('#news')) category = 'General News'
  else if (lower.includes('#service') || lower.includes('service team')) category = 'Service News'
  else if (lower.includes('#promotion') || lower.includes('#promo')) category = 'Promotion'

  // Branch detection
  if (lower.includes('mya taung') || lower.includes('myataung')) branch = 'Kubota Mya Taung'
  else if (lower.includes('win shwe wah') || lower.includes('winshwewah')) branch = 'Win Shwe Wah'
  else if (lower.includes('kyaukse') || lower.includes('ကျောက်ဆည်')) branch = 'Kyaukse'
  else if (lower.includes('mandalay') || lower.includes('မန္တလေး')) branch = 'Mandalay'
  else if (lower.includes('kmm') || lower.includes('kubota myanmar')) branch = 'KMM'

  const hashtags = text.match(/#[^\s#]+(?:\s[^\s#]+)*/g) || []
  
  return { category, branch, tags: hashtags }
}

export async function GET() {
  return NextResponse.json({ status: 'KMM Kubota News Webhook Ready - Auto Category', timestamp: new Date().toISOString() }, { status: 200 })
}

export async function POST(req: NextRequest) {
  console.log('=== WEBHOOK HIT ===')
  try {
    const body = await req.text()
    let parsedBody: WebhookBody
    try {
      parsedBody = JSON.parse(body) as WebhookBody
    } catch {
      return NextResponse.json({ status: 'ok verify' }, { status: 200 })
    }

    if (!parsedBody.events || parsedBody.events.length === 0) {
      return NextResponse.json({ status: 'ok no events' }, { status: 200 })
    }

    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const sanityToken = process.env.SANITY_API_TOKEN

    if (!channelAccessToken || !projectId || !sanityToken) {
      console.error('MISSING ENV')
      return NextResponse.json({ status: 'ok missing env' }, { status: 200 })
    }

    const sanityClient = createClient({
      projectId: projectId,
      dataset: dataset,
      token: sanityToken,
      useCdn: false,
      apiVersion: '2023-05-03',
    })

    const client = new messagingApi.MessagingApiClient({
      channelAccessToken: channelAccessToken,
    })

    for (const event of parsedBody.events) {
      if (event.type === 'message' && event.message && event.message.type === 'text') {
        const text = event.message.text
        const groupId = event.source.groupId || event.source.roomId || event.source.userId

        if (text.trim().toLowerCase() === 'groupid') {
          await client.replyMessage({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: `Group ID: ${groupId}` }],
          })
          continue
        }

        if (!text.includes('#') && !text.toLowerCase().includes('news')) {
          continue
        }

        try {
          const { category, branch, tags } = detectCategory(text)
          const fbMatch = text.match(/https?:\/\/(www\.)?facebook\.com\/[^\s]+/i)
          const tiktokMatch = text.match(/https?:\/\/[^\s]+tiktok[^\s]*/i)

          const newsDoc = {
            _type: 'news',
            title: text.split('\n')[0]?.substring(0, 200) || text.substring(0, 200),
            content: text,
            description: text.substring(0, 500),
            body: text,
            originalMessage: text,
            category: category,
            branch: branch,
            tags: tags,
            facebookUrl: fbMatch ? fbMatch[0] : '',
            tiktokUrl: tiktokMatch ? tiktokMatch[0] : '',
            lineGroupId: groupId,
            lineMessageId: event.message.id,
            source: 'LINE',
            publishedAt: new Date().toISOString(),
            status: 'published',
          }

          console.log(`Creating: ${category} | ${branch} | ${tags.join(',')}`)
          const result = await sanityClient.create(newsDoc)
          console.log('SUCCESS:', result._id, category)

          await client.replyMessage({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: `✅ ${category} | ${branch}\nတက်ပြီ! Dashboard မှာ Auto ပြမယ်\nID: ${result._id.substring(0,8)}` }],
          })
        } catch (err) {
          const error = err as Error
          console.error('SANITY FAILED:', error.message)
          await client.replyMessage({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: `❌ Error: ${error.message.substring(0,100)}` }],
          })
        }
      }
    }
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch (err) {
    const error = err as Error
    console.error('CRITICAL:', error.message)
    return NextResponse.json({ status: 'ok error caught' }, { status: 200 })
  }
}

