import MediaField from '@/components/admin/MediaField'
import PageHeader from '@/components/admin/PageHeader'
import SubmitButton from '@/components/admin/SubmitButton'
import { getCompanyLogoUrl } from '@/lib/settings'
import { uploadCompanyLogo } from './actions'

export default async function AdminLogoPage() {
  const logoUrl = await getCompanyLogoUrl()

  return (
    <>
      <PageHeader title="Company logo" description="Replaces the wordmark shown in the site header." />

      <form className="flex max-w-[560px] flex-col gap-5 rounded-xl border border-border bg-paper p-7" action={uploadCompanyLogo}>
        {logoUrl && (
          <div className="flex items-center gap-3 text-[0.85rem] text-ink-faint">
            Current logo:
            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of an app-served/external URL */}
            <img src={logoUrl} alt="Current company logo" className="h-10 w-auto" />
          </div>
        )}
        <MediaField
          label="Logo (JPEG/PNG/WebP, up to 5MB)"
          namePrefix="logo"
          accept="image/jpeg,image/png,image/webp"
          kind="image"
          required
          currentUrl={logoUrl}
          showOwnPreview={false}
        />
        <div className="flex items-center gap-3 pt-2">
          <SubmitButton pendingText="Uploading…">Upload logo</SubmitButton>
        </div>
      </form>
    </>
  )
}
