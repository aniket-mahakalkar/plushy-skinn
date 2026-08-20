/**
 * The admin pastes whatever Google Maps' "Share → Embed a map" dialog gives them —
 * either the full <iframe> HTML snippet or just the src URL. This extracts the
 * actual embeddable URL from either form so it can be stored and reused as an
 * iframe src. No API key involved; this is Google's own free embed feature.
 */
export function extractMapEmbedUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i)
  const candidate = srcMatch ? srcMatch[1] : trimmed

  try {
    const url = new URL(candidate)
    if (url.hostname !== 'www.google.com' && url.hostname !== 'maps.google.com') return null
    if (!url.pathname.startsWith('/maps/embed')) return null
    return url.toString()
  } catch {
    return null
  }
}
