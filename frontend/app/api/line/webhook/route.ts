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

export async function GET() {
  return NextResponse.json({ status: 'KMM Kubota News Webhook Ready', timestamp: new Date().toISOString() }, { status: 200 })
}

export async function POST(req: NextRequest) {
  console.log('=== WEBHOOK HIT ===', new Date().toISOString())

  try {
    const body = await req.text()
    console.log('Raw body length:', body.length)

    let parsedBody: WebhookBody
    try {
      parsedBody = JSON.parse(body) as WebhookBody
    } catch {
      console.log('Not JSON, likely verify:', body.substring(0, 100))
      return NextResponse.json({ status: 'ok verify' }, { status: 200 })
    }

    console.log('Parsed events count:', parsedBody.events?.length ?? 0)

    if (!parsedBody.events || parsedBody.events.length === 0) {
      console.log('No events - verify request')
      return NextResponse.json({ status: 'ok no events' }, { status: 200 })
    }

    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const sanityToken = process.env.SANITY_API_TOKEN

    console.log('Env check:', {
      hasLineToken: !!channelAccessToken,
      hasSanityProjectId: !!projectId,
      hasSanityToken: !!sanityToken,
    })

    if (!channelAccessToken) {
      console.error('MISSING LINE_CHANNEL_ACCESS_TOKEN')
      return NextResponse.json({ status: 'ok missing token' }, { status: 200 })
    }

    if (!projectId || !sanityToken) {
      console.error('MISSING SANITY ENV')
      return NextResponse.json({ status: 'ok missing sanity env' }, { status: 200 })
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
      console.log('Processing event:', event.type)

      if (event.type === 'message' && event.message && event.message.type === 'text') {
        const text = event.message.text
        const groupId = event.source.groupId || event.source.roomId || event.source.userId

        console.log(`Message from ${groupId}: ${text.substring(0, 100)}`)

        if (text.trim().toLowerCase() === 'groupid') {
          await client.replyMessage({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: `Group ID: ${groupId}` }],
          })
          continue
        }

        if (!text.includes('#')) {
          console.log('Skipping - no hashtag')
          continue
        }

        console.log('Creating Sanity doc...')
        try {
          const hashtags = text.match(/#[^\s#]+(?:\s[^\s#]+)*/g) || []
          const tiktokMatch = text.match(/https?:\/\/[^\s]+tiktok[^\s]*/i)

          const newsDoc = {
            _type: 'news',
            title: text.split('\n')[0]?.substring(0, 150) || text.substring(0, 150),
            content: text,
            description: text,
            body: text,
            originalMessage: text,
            lineGroupId: groupId,
            lineMessageId: event.message.id,
            source: 'LINE',
            hashtags: hashtags,
            tiktokUrl: tiktokMatch ? tiktokMatch[0] : '',
            publishedAt: new Date().toISOString(),
            status: 'published',
          }

          console.log('Sanity doc to create:', JSON.stringify(newsDoc).substring(0, 300))

          const result = await sanityClient.create(newsDoc)
          console.log('Sanity created SUCCESS:', result._id)

          await client.replyMessage({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: `✅ သတင်းရောက်ပြီ! ID: ${result._id}` }],
          })
        } catch (err) {
          const error = err as Error
          console.error('SANITY CREATE FAILED:', error.message)
          try {
            await client.replyMessage({
              replyToken: event.replyToken,
              messages: [{ type: 'text', text: `❌ Sanity Error: ${error.message.substring(0, 120)}` }],
            })
          } catch (replyErr) {
            const rErr = replyErr as Error
            console.error('Failed to reply error', rErr.message)
          }
        }
      }
    }
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch (err) {
    const error = err as Error
    console.error('WEBHOOK CRITICAL ERROR:', error.message, error.stack)
    return NextResponse.json({ status: 'ok error caught' }, { status: 200 })
  }
}

