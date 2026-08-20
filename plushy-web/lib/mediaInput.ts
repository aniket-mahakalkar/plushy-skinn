import 'server-only'
import { resolveMediaUrl } from './mediaUrl'

interface ResolveMediaInputOptions {
  uploadFn: (file: File) => Promise<string>
  allowedTypes: string[]
  maxBytes: number
  label: string
}

/**
 * Reads `${namePrefix}_file` and `${namePrefix}_link` from a submitted form —
 * the two modes MediaField (components/admin/MediaField.tsx) can submit.
 * Returns the resolved URL, or undefined if neither was provided (meaning:
 * keep whatever value already exists).
 */
export async function resolveMediaInput(
  formData: FormData,
  namePrefix: string,
  { uploadFn, allowedTypes, maxBytes, label }: ResolveMediaInputOptions,
): Promise<string | undefined> {
  const file = formData.get(`${namePrefix}_file`)
  if (file instanceof File && file.size > 0) {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`${label} must be one of: ${allowedTypes.join(', ')}`)
    }
    if (file.size > maxBytes) {
      throw new Error(`${label} exceeds the ${Math.round(maxBytes / (1024 * 1024))}MB limit`)
    }
    return uploadFn(file)
  }

  const link = formData.get(`${namePrefix}_link`)
  if (typeof link === 'string' && link.trim()) {
    const resolved = resolveMediaUrl(link)
    try {
      new URL(resolved)
    } catch {
      throw new Error(`That ${label.toLowerCase()} link doesn't look like a valid URL.`)
    }
    return resolved
  }

  return undefined
}
