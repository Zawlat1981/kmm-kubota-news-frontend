import { NextRequest, NextResponse } from 'next/server'
import { translateBatch, TargetLanguage } from '@/lib/translate'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { texts, target, strict } = body as { texts: string[]; target: TargetLanguage; strict?: boolean }

    if (!Array.isArray(texts) || !texts.every((text) => typeof text === 'string')) {
      return NextResponse.json(
        { error: 'Request must include "texts" as an array of strings' },
        { status: 400 }
      )
    }

    if (target !== 'my' && target !== 'th' && target !== 'en') {
      return NextResponse.json(
        { error: 'target must be "my", "th", or "en"' },
        { status: 400 }
      )
    }

    const translated = await translateBatch(texts, target, strict === true)

    return NextResponse.json({ translated })
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Translation failed. Please try again later.' },
      { status: 500 }
    )
  }
}