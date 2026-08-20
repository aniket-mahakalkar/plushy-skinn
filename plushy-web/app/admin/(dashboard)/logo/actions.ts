'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/auth/session'
import { query } from '@/lib/db'
import { deleteStorageObjectByUrl, uploadLogo } from '@/lib/storage'
import { resolveMediaInput } from '@/lib/mediaInput'
import { getSetting } from '@/lib/settings'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/lib/validation'

export async function uploadCompanyLogo(formData: FormData): Promise<void> {
  await requireAdminSession()

  const url = await resolveMediaInput(formData, 'logo', {
    uploadFn: uploadLogo,
    allowedTypes: ALLOWED_IMAGE_TYPES,
    maxBytes: MAX_IMAGE_BYTES,
    label: 'Logo',
  })
  if (!url) {
    throw new Error('Please choose a logo file or paste a link.')
  }

  const previousUrl = await getSetting('company_logo_url')

  await query(
    `insert into settings (key, value, updated_at) values ('company_logo_url', $1, now())
     on conflict (key) do update set value = excluded.value, updated_at = excluded.updated_at`,
    [url],
  )

  await deleteStorageObjectByUrl(previousUrl)

  revalidatePath('/')
  revalidatePath('/admin/logo')
}
