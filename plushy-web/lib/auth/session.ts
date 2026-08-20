import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const ADMIN_SESSION_COOKIE_NAME = 'admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 12 // 12 hours

function secret(): string {
  const value = process.env.SESSION_SECRET
  if (!value) throw new Error('Missing SESSION_SECRET env var.')
  return value
}

function hmac(input: string): Buffer {
  return createHmac('sha256', secret()).update(input).digest()
}

/** Constant-time string comparison via fixed-length HMAC digests (avoids length-based timing/throw issues). */
function timingSafeEqualStrings(a: string, b: string): boolean {
  return timingSafeEqual(hmac(a), hmac(b))
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME ?? ''
  const expectedPassword = process.env.ADMIN_PASSWORD ?? ''
  const usernameOk = timingSafeEqualStrings(username, expectedUsername)
  const passwordOk = timingSafeEqualStrings(password, expectedPassword)
  return usernameOk && passwordOk
}

function signPayload(payloadB64: string): string {
  return createHmac('sha256', secret()).update(payloadB64).digest('base64url')
}

export function createSessionToken(): string {
  const now = Math.floor(Date.now() / 1000)
  const payload = JSON.stringify({ sub: 'admin', iat: now, exp: now + SESSION_TTL_SECONDS })
  const payloadB64 = Buffer.from(payload, 'utf8').toString('base64url')
  const signature = signPayload(payloadB64)
  return `${payloadB64}.${signature}`
}

/** Pure, synchronous — safe to call from proxy.ts as well as server code. */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payloadB64, signature] = parts
  const expectedSignature = signPayload(payloadB64)
  const sigBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expectedSignature)
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return false
  }
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as {
      exp?: number
    }
    return typeof payload.exp === 'number' && payload.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

export async function getAdminSessionToken(): Promise<string | undefined> {
  const store = await cookies()
  return store.get(ADMIN_SESSION_COOKIE_NAME)?.value
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return verifySessionToken(await getAdminSessionToken())
}

/** Defense in depth: call at the top of every admin Server Action and dashboard layout. */
export async function requireAdminSession(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }
}

export async function setAdminSessionCookie(): Promise<void> {
  const store = await cookies()
  store.set(ADMIN_SESSION_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export async function clearAdminSessionCookie(): Promise<void> {
  const store = await cookies()
  store.delete(ADMIN_SESSION_COOKIE_NAME)
}
