import { supabase } from './supabase/server-client'

export async function getSetting(key: string): Promise<string | null> {
  const { data, error } = await supabase.from('settings').select('value').eq('key', key).maybeSingle()
  if (error) {
    console.error(`getSetting(${key}) failed:`, error.message)
    return null
  }
  return data?.value ?? null
}

export async function getCompanyLogoUrl(): Promise<string | null> {
  return getSetting('company_logo_url')
}
