import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth/session'

// Gates every /admin/* route except /admin/login. Runs on the Node.js runtime
// by default (Next.js 16), so the same HMAC verify used by Server
// Components/Actions applies here too. This is a fast-path check — every
// admin Server Action independently re-verifies via requireAdminSession() as
// defense in depth (a proxy matcher change should never be the only gate).
export function proxy(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value

  if (!verifySessionToken(token)) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
}
