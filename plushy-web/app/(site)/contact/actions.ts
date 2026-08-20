'use server'

import { query } from '@/lib/db'
import { contactMessageSchema, isHoneypotTripped } from '@/lib/validation'
import type { FormActionState } from '@/lib/types'

export async function submitContactMessage(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  if (isHoneypotTripped(formData)) {
    return { status: 'success', message: "Thanks for reaching out — we'll reply within one business day." }
  }

  const parsed = contactMessageSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Please check the form and try again.' }
  }

  try {
    await query('insert into contact_messages (name, email, subject, message) values ($1, $2, $3, $4)', [
      parsed.data.name,
      parsed.data.email,
      parsed.data.subject,
      parsed.data.message,
    ])
  } catch (err) {
    console.error('submitContactMessage failed:', err instanceof Error ? err.message : err)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }

  return {
    status: 'success',
    message: "Thanks for reaching out — we'll reply within one business day.",
  }
}
