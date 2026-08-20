'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/auth/session'
import { query, queryOne } from '@/lib/db'
import { getHomeGalleryItemByIdAdmin } from '@/lib/admin/queries'
import { deleteHomeMedia, uploadHomeMedia } from '@/lib/supabase/s3Client'
import { resolveMediaInput } from '@/lib/mediaInput'
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, homeGalleryItemSchema } from '@/lib/validation'

function parseGalleryFields(formData: FormData) {
  return homeGalleryItemSchema.parse({
    type: formData.get('type'),
    title: formData.get('title'),
    caption: formData.get('caption'),
    color: formData.get('color'),
    position: formData.get('position') || 0,
  })
}

function revalidateHomePaths() {
  revalidatePath('/')
  revalidatePath('/admin/home')
}

/** Shared upload-or-link flow for the singleton homepage settings (category
 * cards, craft video, hero image) — resolve the new media, swap the settings
 * row, then clean up whatever it replaced. */
async function updateMediaSetting(
  key: string,
  formData: FormData,
  namePrefix: string,
  opts: { allowedTypes: string[]; maxBytes: number; label: string },
): Promise<void> {
  const url = await resolveMediaInput(formData, namePrefix, { uploadFn: uploadHomeMedia, ...opts })
  if (!url) {
    throw new Error(`Please choose a ${opts.label.toLowerCase()} file or paste a link.`)
  }

  const previous = await queryOne<{ value: string | null }>('select value from settings where key = $1', [key])

  await query(
    `insert into settings (key, value, updated_at) values ($1, $2, now())
     on conflict (key) do update set value = excluded.value, updated_at = excluded.updated_at`,
    [key, url],
  )

  if (previous?.value) await deleteHomeMedia(previous.value)

  revalidateHomePaths()
}

export async function createHomeGalleryItem(formData: FormData): Promise<void> {
  await requireAdminSession()

  const fields = parseGalleryFields(formData)
  const media_url = await resolveMediaInput(formData, 'media', {
    uploadFn: uploadHomeMedia,
    allowedTypes: fields.type === 'video' ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES,
    maxBytes: fields.type === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES,
    label: fields.type === 'video' ? 'Video' : 'Image',
  })
  if (!media_url) {
    throw new Error('Please choose an image/video file or paste a link.')
  }

  await query(
    `insert into home_gallery (position, type, title, caption, color, media_url)
     values ($1, $2, $3, $4, $5, $6)`,
    [fields.position, fields.type, fields.title, fields.caption, fields.color, media_url],
  )

  revalidateHomePaths()
}

export async function updateHomeGalleryItem(id: string, formData: FormData): Promise<void> {
  await requireAdminSession()

  const existing = await getHomeGalleryItemByIdAdmin(id)
  if (!existing) throw new Error('Gallery item not found')

  const fields = parseGalleryFields(formData)
  const resolved = await resolveMediaInput(formData, 'media', {
    uploadFn: uploadHomeMedia,
    allowedTypes: fields.type === 'video' ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES,
    maxBytes: fields.type === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES,
    label: fields.type === 'video' ? 'Video' : 'Image',
  })

  let media_url = existing.media_url
  if (resolved !== undefined) {
    await deleteHomeMedia(existing.media_url)
    media_url = resolved
  }

  await query(
    `update home_gallery set
       position = $1, type = $2, title = $3, caption = $4, color = $5, media_url = $6, updated_at = now()
     where id = $7`,
    [fields.position, fields.type, fields.title, fields.caption, fields.color, media_url, id],
  )

  revalidateHomePaths()
}

export async function deleteHomeGalleryItem(id: string): Promise<void> {
  await requireAdminSession()

  const existing = await getHomeGalleryItemByIdAdmin(id)
  if (!existing) return

  await query('delete from home_gallery where id = $1', [id])
  await deleteHomeMedia(existing.media_url)

  revalidateHomePaths()
}

export async function uploadCategoryImage(category: 'men' | 'women', formData: FormData): Promise<void> {
  await requireAdminSession()
  await updateMediaSetting(`category_${category}_image_url`, formData, 'image', {
    allowedTypes: ALLOWED_IMAGE_TYPES,
    maxBytes: MAX_IMAGE_BYTES,
    label: 'Image',
  })
}

export async function uploadHeroImage(formData: FormData): Promise<void> {
  await requireAdminSession()
  await updateMediaSetting('hero_image_url', formData, 'image', {
    allowedTypes: ALLOWED_IMAGE_TYPES,
    maxBytes: MAX_IMAGE_BYTES,
    label: 'Image',
  })
}

export async function uploadCraftVideo(formData: FormData): Promise<void> {
  await requireAdminSession()
  await updateMediaSetting('craft_video_url', formData, 'video', {
    allowedTypes: ALLOWED_VIDEO_TYPES,
    maxBytes: MAX_VIDEO_BYTES,
    label: 'Video',
  })
}
