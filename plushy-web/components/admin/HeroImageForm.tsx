'use client'

import MediaField from './MediaField'
import SubmitButton from './SubmitButton'
import { uploadHeroImage } from '@/app/admin/(dashboard)/home/actions'

function HeroImageForm({ currentUrl }: { currentUrl: string | null }) {
  return (
    <div className="flex max-w-[560px] flex-col gap-5 rounded-xl border border-border bg-paper p-7">
      <form action={uploadHeroImage} className="flex flex-col gap-4">
        <MediaField
          label="Image (JPEG/PNG/WebP, up to 5MB)"
          namePrefix="image"
          accept="image/jpeg,image/png,image/webp"
          kind="image"
          required
          currentUrl={currentUrl}
        />
        <div className="flex items-center gap-3">
          <SubmitButton pendingText="Uploading…">Upload image</SubmitButton>
        </div>
      </form>
    </div>
  )
}

export default HeroImageForm
