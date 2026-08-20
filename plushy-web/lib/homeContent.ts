import { supabase } from './supabase/server-client'
import type { HomeGalleryItem } from './types'

export async function getHomeGalleryItems(): Promise<HomeGalleryItem[]> {
  const { data, error } = await supabase.from('home_gallery').select('*').order('position', { ascending: true })
  if (error) {
    console.error('getHomeGalleryItems failed:', error.message)
    return []
  }
  return data as HomeGalleryItem[]
}
