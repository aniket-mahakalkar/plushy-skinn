import { supabase } from './supabase/server-client'

export interface ContactInfo {
  email: string | null
  supportEmail: string | null
  phone: string | null
  hours: string | null
  address: string | null
  mapEmbedUrl: string | null
}

export const CONTACT_INFO_KEYS = [
  'contact_email',
  'contact_support_email',
  'contact_phone',
  'contact_hours',
  'contact_address',
  'contact_map_embed_url',
] as const

export async function getContactInfo(): Promise<ContactInfo> {
  const { data, error } = await supabase.from('settings').select('key, value').in('key', CONTACT_INFO_KEYS)

  if (error) {
    console.error('getContactInfo failed:', error.message)
    return { email: null, supportEmail: null, phone: null, hours: null, address: null, mapEmbedUrl: null }
  }

  const byKey = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]))

  return {
    email: byKey.contact_email ?? null,
    supportEmail: byKey.contact_support_email ?? null,
    phone: byKey.contact_phone ?? null,
    hours: byKey.contact_hours ?? null,
    address: byKey.contact_address ?? null,
    mapEmbedUrl: byKey.contact_map_embed_url ?? null,
  }
}
