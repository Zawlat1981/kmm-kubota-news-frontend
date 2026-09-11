import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'kmm_stock_session'

export function middleware(req: NextRequest) {
  const session = req.cookies.get(COOKIE_NAME)

  if (!session || session.value !== 'granted') {
    const loginUrl = new URL('/internal/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/internal/stock/:path*'],
}