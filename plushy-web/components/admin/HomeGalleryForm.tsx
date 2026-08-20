'use client'

import { useState } from 'react'
import { Input, InputNumber } from 'antd'
import type { HomeGalleryItem, HomeGalleryItemType } from '@/lib/types'
import MediaField from './MediaField'
import SubmitButton from './SubmitButton'

interface HomeGalleryFormProps {
  action: (formData: FormData) => void | Promise<void>
  item?: HomeGalleryItem
  submitLabel: string
  nextPosition: number
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-[0.85rem] font-semibold text-ink">{children}</span>
}

function HomeGalleryForm({ action, item, submitLabel, nextPosition }: HomeGalleryFormProps) {
  const [type, setType] = useState<HomeGalleryItemType>(item?.type ?? 'image')
  const [title, setTitle] = useState(item?.title ?? '')
  const [caption, setCaption] = useState(item?.caption ?? '')
  const [color, setColor] = useState(item?.color ?? '#a9793f')

  const isValidColor = /^#[0-9a-fA-F]{6}$/.test(color)

  return (
    <form className="flex flex-col gap-6" action={action}>
      <div className="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
        <label className="flex flex-col gap-2">
          <FieldLabel>Type</FieldLabel>
          <select
            className="rounded-lg border border-border-strong bg-paper px-3.5 py-2.5 text-[0.92rem] text-ink-soft outline-none focus:border-tan-deep"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as HomeGalleryItemType)}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel>Position (display order)</FieldLabel>
          <InputNumber className="w-full" name="position" min={0} step={1} defaultValue={item?.position ?? nextPosition} />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <FieldLabel>Title</FieldLabel>
        <Input name="title" required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label className="flex flex-col gap-2">
        <FieldLabel>Caption</FieldLabel>
        <Input name="caption" required maxLength={300} value={caption} onChange={(e) => setCaption(e.target.value)} />
      </label>

      <label className="flex flex-col gap-2">
        <FieldLabel>Fallback color (shown if the file fails to load)</FieldLabel>
        <Input
          name="color"
          required
          placeholder="#a9793f"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          pattern="^#[0-9a-fA-F]{6}$"
          prefix={
            <span
              className="h-4 w-4 shrink-0 rounded-full border border-border-strong"
              style={{ background: isValidColor ? color : 'transparent' }}
              aria-hidden="true"
            />
          }
        />
      </label>

      <MediaField
        label={type === 'video' ? 'Video file (MP4/WebM, up to 80MB)' : 'Image file (JPEG/PNG/WebP, up to 5MB)'}
        namePrefix="media"
        accept={type === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp'}
        kind={type}
        required={!item}
        currentUrl={item?.media_url}
      />

      <div className="flex items-center gap-3 pt-1">
        <SubmitButton pendingText="Saving…">{submitLabel}</SubmitButton>
      </div>
    </form>
  )
}

export default HomeGalleryForm
