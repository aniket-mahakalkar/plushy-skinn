'use server'

import { redirect } from 'next/navigation'
import { clearAdminSessionCookie } from '@/lib/auth/session'

export async function logout(): Promise<void> {
  await clearAdminSessionCookie()
  redirect('/admin/login')
}
