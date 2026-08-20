'use server'

import { query } from '@/lib/db'
import { isHoneypotTripped, newsletterSchema } from '@/lib/validation'
import type { FormActionState } from '@/lib/types'

export async function submitNewsletterSignup(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  if (isHoneypotTripped(formData)) {
    return { status: 'success', message: 'Thanks for subscribing!' }
  }

  const parsed = newsletterSchema.safeParse({ email: formData.get('email') })
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Enter a valid email' }
  }

  try {
    await query('insert into newsletter_subscribers (email) values ($1) on conflict (email) do nothing', [
      parsed.data.email,
    ])
  } catch (err) {
    console.error('submitNewsletterSignup failed:', err instanceof Error ? err.message : err)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }

  return { status: 'success', message: 'Thanks for subscribing!' }
}
