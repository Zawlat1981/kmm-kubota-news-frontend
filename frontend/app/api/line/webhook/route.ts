import { NextRequest, NextResponse } from 'next/server'
import * as line from '@line/bot-sdk'
import { createClient } from '@sanity/client'

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
}

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2023-05-03',
})

export async function GET() {
  return NextResponse.json({ status: 'KMM Kubota News Webhook Ready' }, { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    let parsedBody: any
    try {
      parsedBody = JSON.parse(body)
    } catch {
      return NextResponse.json({ status: 'ok' }, { status: 200 })
    }

    if (!parsedBody.events || parsedBody.events.length === 0) {
      return NextResponse.json({ status: 'ok' }, { status: 200 })
    }

    const client = new line.messagingApi.MessagingApiClient({
      channelAccessToken: config.channelAccessToken,
    })

    for (const event of parsedBody.events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text
        const groupId = event.source.groupId || event.source.roomId || event.source.userId
        
        if (text === 'groupid') {
          await client.replyMessage({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: `Group ID: ${groupId}` }],
          })
          continue
        }

        // Parse News Format
        if (text.includes('#')) {
          try {
            const newsDoc = {
              _type: 'news',
              title: text.substring(0, 100),
              content: text,
              body: text,
              publishedAt: new Date().toISOString(),
              status: 'published',
              originalMessage: text,
              lineGroupId: groupId,
            }
            const result = await sanityClient.create(newsDoc)
            await client.replyMessage({
              replyToken: event.replyToken,
              messages: [{ type: 'text', text: `✅ သတင်းရောက်ပြီ! ID: ${result._id}` }],
            })
          } catch (err) {
            console.error(err)
          }
        }
      }
    }
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch {
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  }
}