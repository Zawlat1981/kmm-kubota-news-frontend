import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'KMM Webhook Ready' }, { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    
    // JSON Parse စမ်း - Verify Request ကို 200 ပြန်ပေး
    let parsedBody: { events?: unknown[] }
    try {
      parsedBody = JSON.parse(body) as { events?: unknown[] }
    } catch {
      return NextResponse.json({ status: 'ok' }, { status: 200 })
    }

    // LINE Verify က events မပါဘူး - 200 ပြန်ပေး
    if (!parsedBody.events || parsedBody.events.length === 0) {
      return NextResponse.json({ status: 'ok' }, { status: 200 })
    }

    // TODO: မင်း Existing Logic ဒီမှာထည့်

    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch {
    // Error ဖြစ်လည်း 200 ပြန်ပေးမှ Verify အောင်မယ်
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  }
}