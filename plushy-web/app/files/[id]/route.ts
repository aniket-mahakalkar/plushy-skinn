import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export const runtime = 'nodejs'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface FileRow {
  data: Buffer
  mime_type: string
  filename: string
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID_RE.test(id)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const file = await queryOne<FileRow>('select data, mime_type, filename from files where id = $1', [id])
  if (!file) {
    return new NextResponse('Not found', { status: 404 })
  }

  return new NextResponse(new Uint8Array(file.data), {
    headers: {
      'Content-Type': file.mime_type,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Disposition': `inline; filename="${encodeURIComponent(file.filename)}"`,
    },
  })
}
