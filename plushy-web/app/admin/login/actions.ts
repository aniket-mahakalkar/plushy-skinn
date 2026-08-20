'use server'

import { redirect } from 'next/navigation'
import { setAdminSessionCookie, verifyAdminCredentials } from '@/lib/auth/session'

function safeRedirectTarget(value: FormDataEntryValue | null): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return '/admin'
  }
  return value
}

export async function login(formData: FormData): Promise<void> {
  const username = String(formData.get('username') ?? '')
  const password = String(formData.get('password') ?? '')
  const redirectTarget = safeRedirectTarget(formData.get('redirect'))

  if (!verifyAdminCredentials(username, password)) {
    // Fixed delay blunts naive brute-force scripts against the single admin account.
    await new Promise((resolve) => setTimeout(resolve, 300))
    redirect(`/admin/login?error=1&redirect=${encodeURIComponent(redirectTarget)}`)
  }

  await setAdminSessionCookie()
  redirect(redirectTarget)
}
