import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'kmm_stock_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    const correctPassword = process.env.INTERNAL_STOCK_PASSWORD
    if (!correctPassword) {
      console.error('INTERNAL_STOCK_PASSWORD is not set in environment variables')
      return NextResponse.json(
        { error: 'Server misconfiguration. Please contact the site admin.' },
        { status: 500 }
      )
    }

    if (password !== correctPassword) {
      return NextResponse.json({ error: 'Password မှားနေပါသည်' }, { status: 401 })
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set(COOKIE_NAME, 'granted', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAX_AGE,
      path: '/',
    })
    return res
  } catch (error) {
    console.error('Internal login error:', error)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }
}