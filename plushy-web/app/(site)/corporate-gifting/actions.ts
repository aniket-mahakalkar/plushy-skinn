'use server'

import { query } from '@/lib/db'
import { giftingEnquirySchema, isHoneypotTripped } from '@/lib/validation'
import type { FormActionState } from '@/lib/types'

export async function submitGiftingEnquiry(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  if (isHoneypotTripped(formData)) {
    return { status: 'success', message: 'Thanks — your enquiry has been received.' }
  }

  const parsed = giftingEnquirySchema.safeParse({
    company: formData.get('company'),
    email: formData.get('email'),
    quantity: formData.get('quantity'),
    occasion: formData.get('occasion'),
    details: formData.get('details'),
  })

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Please check the form and try again.' }
  }

  try {
    await query(
      'insert into gifting_enquiries (company, email, quantity, occasion, details) values ($1, $2, $3, $4, $5)',
      [parsed.data.company, parsed.data.email, parsed.data.quantity, parsed.data.occasion, parsed.data.details || null],
    )
  } catch (err) {
    console.error('submitGiftingEnquiry failed:', err instanceof Error ? err.message : err)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }

  return {
    status: 'success',
    message: "Thanks — your enquiry has been received. We'll be in touch shortly.",
  }
}
