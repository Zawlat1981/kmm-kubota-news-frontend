import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { KMM_CHAT_DATA_CACHE_TAG } from '@/lib/kmmChatCache'

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    console.error('SANITY_REVALIDATE_SECRET is not configured')
    return NextResponse.json({ error: 'Revalidation is not configured' }, { status: 503 })
  }

  const authorization = request.headers.get('authorization') ?? ''
  const providedSecret = Buffer.from(
    authorization.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : '',
  )
  const expectedSecret = Buffer.from(secret)

  if (
    providedSecret.length !== expectedSecret.length ||
    !timingSafeEqual(providedSecret, expectedSecret)
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidateTag(KMM_CHAT_DATA_CACHE_TAG, { expire: 0 })
  return NextResponse.json({ revalidated: true })
}
