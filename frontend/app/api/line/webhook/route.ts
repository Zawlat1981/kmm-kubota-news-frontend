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

function detectCategoryAndBrand(text: string): { category: string; brand: string; branch: string; tags: string[] } {
  const lower = text.toLowerCase()
  let category = 'General'
  let brand = 'KMM'
  let branch = 'KMM'
  
  if (lower.includes('kubota')) brand = 'Kubota'
  else if (lower.includes('yanmar')) brand = 'Yanmar'
  else if (lower.includes('hitachi')) brand = 'Hitachi'

  if (lower.includes('kubota mya taung') || lower.includes('hitachi')) {
    category = 'Kubota Mya Taung-Hitachi'
    branch = 'Kubota Mya Taung'
  } else if (lower.includes('win shwe wah')) {
    category = 'Win Shwe Wah'
    branch = 'Win Shwe Wah'
  } else if (lower.includes('kyaukse')) {
    category = 'Kyaukse'
    branch = 'Kyaukse'
  } else if (lower.includes('mandalay')) {
    category = 'Mandalay'
    branch = 'Mandalay'
  } else if (lower.includes('kubota news')) {
    category = 'Kubota News'
  } else if (lower.includes('yanmar news')) {
    category = 'Yanmar News'
  } else if (lower.includes('service')) {
    category = 'Service News'
  } else if (lower.includes('#news')) {
    category = 'General News'
  }

  const hashtags = text.match(/#[^\s#]+(?:\s[^\s#]+)*/g) || []
  return { category, brand, branch, tags: hashtags }
}

function createSlug(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80) + '-' + Date.now().toString().slice(-6)
}

export async function GET() {
  return NextResponse.json({ status: 'KMM Kubota News Webhook Ready - newsPortal', timestamp: new Date().toISOString() }, { status: 200 })
}

export async function POST(req: NextRequest) {
  console.log('=== WEBHOOK HIT newsPortal ===')
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

        if (!text.includes('#') && !text.toLowerCase().includes('news') && text.length < 10) {
          continue
        }

        try {
          const { category, brand, branch, tags } = detectCategoryAndBrand(text)
          const fbMatch = text.match(/https?:\/\/(www\.)?facebook\.com\/[^\s]+/i)
          const title = text.split('\n')[0]?.substring(0, 150) || text.substring(0, 150)
          const slug = createSlug(title)

          // Match your existing newsPortal schema exactly
          const newsDoc = {
            _type: 'newsPortal',
            title: title,
            brand: brand,
            category: category,
            slug: { _type: 'slug', current: slug },
            publishedAt: new Date().toISOString(),
            body: text,
            // Extra fields for editing in Studio
            originalMessage: text,
            branch: branch,
            tags: tags,
            facebookUrl: fbMatch ? fbMatch[0] : '',
            lineGroupId: groupId,
            source: 'LINE',
            status: 'published',
          }

          console.log(`Creating newsPortal: ${category} | ${brand} | ${title.substring(0,30)}`)
          const result = await sanityClient.create(newsDoc)
          console.log('SUCCESS newsPortal:', result._id, category)

          await client.replyMessage({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: `✅ ${category} | ${brand}\nDashboard မှာ တက်ပြီ!\n${title.substring(0,60)}` }],
          })
        } catch (err) {
          const error = err as Error
          console.error('SANITY FAILED:', error.message)
          try {
            await client.replyMessage({
              replyToken: event.replyToken,
              messages: [{ type: 'text', text: `❌ Error: ${error.message.substring(0,100)}` }],
            })
          } catch {
            console.error('reply failed')
          }
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

