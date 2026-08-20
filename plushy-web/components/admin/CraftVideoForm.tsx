'use client'

import MediaField from './MediaField'
import SubmitButton from './SubmitButton'
import { uploadCraftVideo } from '@/app/admin/(dashboard)/home/actions'

function CraftVideoForm({ currentUrl }: { currentUrl: string | null }) {
  return (
    <div className="flex max-w-[560px] flex-col gap-5 rounded-xl border border-border bg-paper p-7">
      <form action={uploadCraftVideo} className="flex flex-col gap-4">
        <MediaField
          label="Video (MP4/WebM, up to 80MB)"
          namePrefix="video"
          accept="video/mp4,video/webm"
          kind="video"
          required
          currentUrl={currentUrl}
        />
        <div className="flex items-center gap-3">
          <SubmitButton pendingText="Uploading…">Upload video</SubmitButton>
        </div>
      </form>
    </div>
  )
}

export default CraftVideoForm
