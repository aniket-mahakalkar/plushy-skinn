'use client'

import { useMemo, useState } from 'react'
import { Input } from 'antd'
import type { ContactInfo } from '@/lib/contactInfo'
import { extractMapEmbedUrl } from '@/lib/googleMaps'
import SubmitButton from './SubmitButton'

interface ContactInfoFormProps {
  action: (formData: FormData) => void | Promise<void>
  info: ContactInfo
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-[0.85rem] font-semibold text-ink">{children}</span>
}

function ContactInfoForm({ action, info }: ContactInfoFormProps) {
  const [mapInput, setMapInput] = useState(info.mapEmbedUrl ?? '')
  const previewUrl = useMemo(() => extractMapEmbedUrl(mapInput), [mapInput])

  return (
    <div className="grid grid-cols-[1fr_320px] items-start gap-6 max-[900px]:grid-cols-1">
      <form className="flex flex-col gap-5 rounded-xl border border-border bg-paper p-7" action={action}>
        <div className="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
          <label className="flex flex-col gap-2">
            <FieldLabel>Email</FieldLabel>
            <Input type="email" name="email" required defaultValue={info.email ?? ''} />
          </label>
          <label className="flex flex-col gap-2">
            <FieldLabel>Support email (optional)</FieldLabel>
            <Input type="email" name="support_email" defaultValue={info.supportEmail ?? ''} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
          <label className="flex flex-col gap-2">
            <FieldLabel>Phone (optional)</FieldLabel>
            <Input name="phone" defaultValue={info.phone ?? ''} />
          </label>
          <label className="flex flex-col gap-2">
            <FieldLabel>Hours (optional)</FieldLabel>
            <Input name="hours" placeholder="Mon – Fri, 9am – 6pm IST" defaultValue={info.hours ?? ''} />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <FieldLabel>Address</FieldLabel>
          <Input.TextArea name="address" rows={2} required defaultValue={info.address ?? ''} />
        </label>

        <label className="flex flex-col gap-2">
          <FieldLabel>Google Maps embed link</FieldLabel>
          <Input.TextArea
            name="map_embed_input"
            rows={4}
            placeholder="Paste the link or <iframe> code here"
            value={mapInput}
            onChange={(e) => setMapInput(e.target.value)}
          />
        </label>
        <p className="-mt-2 text-[0.8rem] text-ink-faint">
          On Google Maps: search the location → Share → Embed a map → Copy HTML, then paste the whole thing above (or
          just the link) — no account or API key needed.
        </p>
        {mapInput && !previewUrl && (
          <p className="-mt-2 text-[0.8rem] text-[var(--danger-text)]">
            That doesn&rsquo;t look like a Google Maps embed link yet.
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
        </div>
      </form>

      <div className="sticky top-6 flex flex-col gap-3 max-[900px]:static">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-ink-faint">Map preview</p>
        <div className="overflow-hidden rounded-lg border border-border bg-tan-pale/30">
          {previewUrl ? (
            <iframe title="Location preview" src={previewUrl} className="h-[260px] w-full" loading="lazy" />
          ) : (
            <div className="flex h-[260px] items-center justify-center px-6 text-center text-[0.85rem] text-ink-faint">
              Paste an embed link to see a preview here.
            </div>
          )}
        </div>
        <p className="text-[0.8rem] text-ink-faint">Live preview of the map shown on the public Contact page.</p>
      </div>
    </div>
  )
}

export default ContactInfoForm
