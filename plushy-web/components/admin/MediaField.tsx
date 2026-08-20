'use client'

import { useEffect, useRef, useState } from 'react'
import { resolveMediaUrl } from '@/lib/mediaUrl'
import { FORM_INPUT } from './formStyles'

interface MediaFieldProps {
  label: string
  namePrefix: string
  accept: string
  kind: 'image' | 'video'
  required?: boolean
  currentUrl?: string | null
  onPreviewChange?: (url: string | null) => void
  showOwnPreview?: boolean
}

function MediaField({
  label,
  namePrefix,
  accept,
  kind,
  required,
  currentUrl,
  onPreviewChange,
  showOwnPreview = true,
}: MediaFieldProps) {
  const [mode, setMode] = useState<'upload' | 'link'>('upload')
  const [linkValue, setLinkValue] = useState('')
  const [filePreview, setFilePreview] = useState<string | null>(currentUrl ?? null)
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setFilePreview(url)
    onPreviewChange?.(url)
  }

  function handleLinkChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setLinkValue(value)
    onPreviewChange?.(value.trim() ? resolveMediaUrl(value) : (currentUrl ?? null))
  }

  const previewUrl = mode === 'upload' ? filePreview : linkValue.trim() ? resolveMediaUrl(linkValue) : currentUrl ?? null
  const noExistingValue = !currentUrl

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[0.85rem] font-semibold text-ink">{label}</span>
        <div className="flex gap-0.5 rounded-full bg-tan-pale/50 p-0.5 text-[0.75rem]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`rounded-full px-2.5 py-1 transition-colors ${mode === 'upload' ? 'bg-paper text-ink shadow-[0_1px_2px_rgba(19,19,16,0.12)]' : 'text-ink-faint'}`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`rounded-full px-2.5 py-1 transition-colors ${mode === 'link' ? 'bg-paper text-ink shadow-[0_1px_2px_rgba(19,19,16,0.12)]' : 'text-ink-faint'}`}
          >
            Paste link
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <input
          className={`${FORM_INPUT} py-2`}
          type="file"
          name={`${namePrefix}_file`}
          accept={accept}
          onChange={handleFile}
          required={required && noExistingValue}
        />
      ) : (
        <input
          className={FORM_INPUT}
          type="text"
          name={`${namePrefix}_link`}
          placeholder="Paste an image/video URL or a Google Drive share link"
          value={linkValue}
          onChange={handleLinkChange}
          required={required && noExistingValue}
        />
      )}

      {showOwnPreview && previewUrl && (
        <div className="mt-1 overflow-hidden rounded-lg border border-border">
          {kind === 'video' ? (
            <video src={previewUrl} className="aspect-[4/3] w-full object-cover" controls muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- may be a local blob: preview or an arbitrary admin-pasted URL
            <img src={previewUrl} alt={label} className="aspect-[4/3] w-full object-cover" />
          )}
        </div>
      )}
    </div>
  )
}

export default MediaField
