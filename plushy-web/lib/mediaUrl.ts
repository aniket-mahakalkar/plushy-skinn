/**
 * Admins can paste a Google Drive share link instead of uploading a file.
 * Drive's default share link (drive.google.com/file/d/<ID>/view) serves an HTML
 * viewer page, not the raw file — this rewrites it to a direct-content URL that
 * works in <img>/<video> tags. Requires the file be shared "Anyone with the link".
 * Any other URL is passed through unchanged.
 */
export function resolveMediaUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return trimmed

  const patterns = [/drive\.google\.com\/file\/d\/([^/]+)/, /drive\.google\.com\/open\?id=([^&]+)/]

  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match) return `https://lh3.googleusercontent.com/d/${match[1]}`
  }

  return trimmed
}
