import { jwtVerify } from 'jose'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    // Opcional: valida role
    if (!payload.role || payload.role === 'READER') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return NextResponse.next()
  } catch (err) {
    console.error('Invalid JWT', err)
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
