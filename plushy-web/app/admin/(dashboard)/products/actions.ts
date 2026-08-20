'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/auth/session'
import { query, queryOne } from '@/lib/db'
import { getProductByIdAdmin } from '@/lib/admin/queries'
import { deleteStorageObjectByUrl, uploadProductImage } from '@/lib/storage'
import { resolveMediaInput } from '@/lib/mediaInput'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, productSchema, slugify } from '@/lib/validation'

function parseProductFields(formData: FormData) {
  return productSchema.parse({
    name: formData.get('name'),
    category: formData.get('category'),
    price: formData.get('price'),
    discount_percent: formData.get('discount_percent') || 0,
    color: formData.get('color'),
    swatch: formData.get('swatch'),
    tagline: formData.get('tagline'),
    description: formData.get('description') || undefined,
    is_featured: formData.get('is_featured') === 'true',
  })
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || 'product'
  let candidate = base
  let suffix = 2
  for (;;) {
    const existing = await queryOne('select id from products where slug = $1', [candidate])
    if (!existing) return candidate
    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

function revalidateProductPaths(slug?: string) {
  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath('/admin/products')
  if (slug) revalidatePath(`/shop/${slug}`)
}

export async function createProduct(formData: FormData): Promise<void> {
  await requireAdminSession()

  const fields = parseProductFields(formData)
  const slug = await generateUniqueSlug(fields.name)

  const image_url = await resolveMediaInput(formData, 'image', {
    uploadFn: (file) => uploadProductImage(slug, file),
    allowedTypes: ALLOWED_IMAGE_TYPES,
    maxBytes: MAX_IMAGE_BYTES,
    label: 'Image',
  })

  await query(
    `insert into products
       (name, category, price, discount_percent, color, swatch, tagline, description, is_featured, slug, image_url)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      fields.name,
      fields.category,
      fields.price,
      fields.discount_percent,
      fields.color,
      fields.swatch,
      fields.tagline,
      fields.description || null,
      fields.is_featured,
      slug,
      image_url ?? null,
    ],
  )

  revalidateProductPaths(slug)
}

export async function updateProduct(id: string, formData: FormData): Promise<void> {
  await requireAdminSession()

  const existing = await getProductByIdAdmin(id)
  if (!existing) throw new Error('Product not found')

  const fields = parseProductFields(formData)

  const resolvedImageUrl = await resolveMediaInput(formData, 'image', {
    uploadFn: (file) => uploadProductImage(existing.slug, file),
    allowedTypes: ALLOWED_IMAGE_TYPES,
    maxBytes: MAX_IMAGE_BYTES,
    label: 'Image',
  })

  let image_url = existing.image_url
  if (resolvedImageUrl !== undefined) {
    await deleteStorageObjectByUrl(existing.image_url)
    image_url = resolvedImageUrl
  }

  await query(
    `update products set
       name = $1, category = $2, price = $3, discount_percent = $4, color = $5, swatch = $6,
       tagline = $7, description = $8, is_featured = $9, image_url = $10,
       updated_at = now()
     where id = $11`,
    [
      fields.name,
      fields.category,
      fields.price,
      fields.discount_percent,
      fields.color,
      fields.swatch,
      fields.tagline,
      fields.description || null,
      fields.is_featured,
      image_url,
      id,
    ],
  )

  revalidateProductPaths(existing.slug)
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAdminSession()

  const existing = await getProductByIdAdmin(id)
  if (!existing) return

  await query('delete from products where id = $1', [id])

  await deleteStorageObjectByUrl(existing.image_url)

  revalidateProductPaths(existing.slug)
}
