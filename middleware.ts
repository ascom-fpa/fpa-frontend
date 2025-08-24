import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for admin routes
  if (pathname.startsWith("/admin")) {
    // Get the auth token from cookies or headers
    const authToken =
      request.cookies.get("auth_token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

    // If no token, redirect to login
    if (!authToken) {
      const loginUrl = new URL("/", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // TODO: Add JWT verification and role checking here
    // For now, we'll let the client-side auth store handle detailed verification
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
