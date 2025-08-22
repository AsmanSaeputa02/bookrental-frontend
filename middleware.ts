// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  console.log('🔐 Middleware token:', token)
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/book', request.url))
  }

  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/book/:path*',
    '/rental/:path*',
    '/user/:path*',
    '/dashboard/:path*',
  ],
}
