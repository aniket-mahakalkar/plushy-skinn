import 'server-only'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'

const endpoint = process.env.SUPABASE_S3_ENDPOINT
const region = process.env.SUPABASE_S3_REGION
const accessKeyId = process.env.SUPABASE_S3_ACCESS_KEY_ID
const secretAccessKey = process.env.SUPABASE_S3_SECRET_ACCESS_KEY
const bucket = process.env.SUPABASE_S3_BUCKET
const publicBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

if (!endpoint || !region || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
  throw new Error('Missing SUPABASE_S3_* env vars (used for homepage media uploads).')
}

const client = new S3Client({
  endpoint,
  region,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
})

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
}

/** Uploads to the `home/` prefix of the Supabase Storage bucket and returns a public URL. */
export async function uploadHomeMedia(file: File): Promise<string> {
  const ext = EXT_BY_MIME[file.type] ?? 'bin'
  const key = `home/${randomUUID()}.${ext}`
  const arrayBuffer = await file.arrayBuffer()

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type,
    }),
  )

  return `${publicBaseUrl}/storage/v1/object/public/${bucket}/${key}`
}

/** Best-effort cleanup when replacing/removing a gallery item's media. Never throws. */
export async function deleteHomeMedia(url: string | null | undefined): Promise<void> {
  if (!url) return
  const marker = `/storage/v1/object/public/${bucket}/`
  const index = url.indexOf(marker)
  if (index === -1) return
  const key = decodeURIComponent(url.slice(index + marker.length))
  try {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
  } catch {
    // best-effort — ignore
  }
}
