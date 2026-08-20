import { supabase } from './supabase/server-client'
import type { Product, ProductCategory } from './types'

/** Open-source stock photo (Pexels License, free for commercial use) shown until
 * the admin uploads a real product photo — swap per-product via /admin/products. */
export const FALLBACK_PRODUCT_IMAGE = 'https://images.pexels.com/photos/915917/pexels-photo-915917.jpeg'

export interface PaginatedProducts {
  products: Product[]
  total: number
  page: number
  pageSize: number
}

export const SHOP_PAGE_SIZE = 12

export async function getProducts(options?: {
  category?: ProductCategory
  page?: number
  pageSize?: number
}): Promise<PaginatedProducts> {
  const pageSize = options?.pageSize ?? SHOP_PAGE_SIZE
  const page = options?.page && options.page > 0 ? options.page : 1
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  if (options?.category) {
    query = query.eq('category', options.category)
  }

  const { data, error, count } = await query
  if (error) {
    console.error('getProducts failed:', error.message)
    return { products: [], total: 0, page, pageSize }
  }
  return { products: (data ?? []) as Product[], total: count ?? 0, page, pageSize }
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('getFeaturedProducts failed:', error.message)
    return []
  }
  return data as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle()
  if (error) {
    console.error('getProductBySlug failed:', error.message)
    return null
  }
  return data as Product | null
}
