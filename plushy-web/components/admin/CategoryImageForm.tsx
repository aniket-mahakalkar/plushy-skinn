'use client'

import MediaField from './MediaField'
import SubmitButton from './SubmitButton'

interface CategoryImageFormProps {
  label: string
  currentUrl: string | null
  action: (formData: FormData) => void | Promise<void>
}

function CategoryImageForm({ label, currentUrl, action }: CategoryImageFormProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-xl border border-border bg-paper p-6">
      <p className="text-[0.85rem] font-semibold text-ink">{label}</p>
      <form action={action} className="flex flex-col gap-3">
        <MediaField
          label="Image (JPEG/PNG/WebP, up to 5MB)"
          namePrefix="image"
          accept="image/jpeg,image/png,image/webp"
          kind="image"
          required
          currentUrl={currentUrl}
        />
        <SubmitButton pendingText="Uploading…">Upload image</SubmitButton>
      </form>
    </div>
  )
}

export default CategoryImageForm
