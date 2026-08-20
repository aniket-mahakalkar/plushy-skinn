import 'server-only'
import { query, queryOne } from './db'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from './validation'

function assertFile(
  file: File,
  { allowedTypes, maxBytes, label }: { allowedTypes: string[]; maxBytes: number; label: string },
) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${label} must be one of: ${allowedTypes.join(', ')}`)
  }
  if (file.size > maxBytes) {
    throw new Error(`${label} exceeds the ${Math.round(maxBytes / (1024 * 1024))}MB limit`)
  }
}

/** Stores the file's bytes in the `files` table and returns a `/files/{id}` URL to serve it. */
async function upload(filename: string, file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const row = await queryOne<{ id: string }>(
    'insert into files (filename, mime_type, data) values ($1, $2, $3) returning id',
    [filename, file.type, Buffer.from(arrayBuffer)],
  )
  if (!row) throw new Error('Upload failed: could not save file.')
  return `/files/${row.id}`
}

export async function uploadProductImage(slug: string, file: File): Promise<string> {
  assertFile(file, { allowedTypes: ALLOWED_IMAGE_TYPES, maxBytes: MAX_IMAGE_BYTES, label: 'Image' })
  return upload(`${slug}-${Date.now()}`, file)
}

export async function uploadLogo(file: File): Promise<string> {
  assertFile(file, { allowedTypes: ALLOWED_IMAGE_TYPES, maxBytes: MAX_IMAGE_BYTES, label: 'Logo' })
  return upload(`logo-${Date.now()}`, file)
}

/** Best-effort cleanup when replacing/deleting a product's files. Never throws. */
export async function deleteStorageObjectByUrl(url: string | null | undefined): Promise<void> {
  if (!url) return
  const match = url.match(/^\/files\/([0-9a-f-]{36})$/i)
  if (!match) return
  try {
    await query('delete from files where id = $1', [match[1]])
  } catch {
    // best-effort — ignore
  }
}
