'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/auth/session'
import { query } from '@/lib/db'
import { extractMapEmbedUrl } from '@/lib/googleMaps'
import { contactInfoSchema } from '@/lib/validation'

export async function updateContactInfo(formData: FormData): Promise<void> {
  await requireAdminSession()

  const fields = contactInfoSchema.parse({
    email: formData.get('email'),
    support_email: formData.get('support_email') || undefined,
    phone: formData.get('phone') || undefined,
    hours: formData.get('hours') || undefined,
    address: formData.get('address'),
    map_embed_input: formData.get('map_embed_input') || undefined,
  })

  let mapEmbedUrl = ''
  if (fields.map_embed_input) {
    const extracted = extractMapEmbedUrl(fields.map_embed_input)
    if (!extracted) {
      throw new Error(
        "Couldn't read that as a Google Maps embed link. Paste the link or <iframe> code from Google Maps → Share → Embed a map.",
      )
    }
    mapEmbedUrl = extracted
  }

  const entries: [string, string][] = [
    ['contact_email', fields.email],
    ['contact_support_email', fields.support_email || ''],
    ['contact_phone', fields.phone || ''],
    ['contact_hours', fields.hours || ''],
    ['contact_address', fields.address],
    ['contact_map_embed_url', mapEmbedUrl],
  ]

  for (const [key, value] of entries) {
    await query(
      `insert into settings (key, value, updated_at) values ($1, $2, now())
       on conflict (key) do update set value = excluded.value, updated_at = excluded.updated_at`,
      [key, value],
    )
  }

  revalidatePath('/contact')
  revalidatePath('/admin/contact-info')
}
