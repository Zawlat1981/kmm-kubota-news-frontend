import { NextRequest, NextResponse } from 'next/server'
import { translateBatch, TargetLanguage } from '@/lib/translate'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { texts, target } = body as { texts: string[]; target: TargetLanguage }

    if (!Array.isArray(texts) || !target) {
      return NextResponse.json(
        { error: 'Request must include "texts" (array) and "target" ("my" or "th")' },
        { status: 400 }
      )
    }

    if (target !== 'my' && target !== 'th') {
      return NextResponse.json(
        { error: 'target must be "my" or "th"' },
        { status: 400 }
      )
    }

    const translated = await translateBatch(texts, target)

    return NextResponse.json({ translated })
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Translation failed. Please try again later.' },
      { status: 500 }
    )
  }
}