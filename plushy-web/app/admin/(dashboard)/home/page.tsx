import CategoryImageForm from '@/components/admin/CategoryImageForm'
import CraftVideoForm from '@/components/admin/CraftVideoForm'
import HeroImageForm from '@/components/admin/HeroImageForm'
import HomeGalleryClient from '@/components/admin/HomeGalleryClient'
import PageHeader from '@/components/admin/PageHeader'
import { listHomeGalleryAdmin } from '@/lib/admin/queries'
import { getSetting } from '@/lib/settings'
import { uploadCategoryImage } from './actions'

export default async function AdminHomeContentPage() {
  const [galleryItems, heroImageUrl, craftVideoUrl, menImageUrl, womenImageUrl] = await Promise.all([
    listHomeGalleryAdmin(),
    getSetting('hero_image_url'),
    getSetting('craft_video_url'),
    getSetting('category_men_image_url'),
    getSetting('category_women_image_url'),
  ])

  return (
    <>
      <PageHeader title="Homepage content" description="Manage the hero image, category cards, material-story video, and gallery shown on the homepage." />

      <div className="mb-10 flex flex-col gap-4">
        <h2 className="text-[1.1rem]">Hero image</h2>
        <HeroImageForm currentUrl={heroImageUrl} />
      </div>

      <div className="mb-10 flex flex-col gap-4">
        <h2 className="text-[1.1rem]">Category cards</h2>
        <div className="flex flex-col gap-5 sm:flex-row">
          <CategoryImageForm
            label="Men’s Wallets"
            currentUrl={menImageUrl}
            action={uploadCategoryImage.bind(null, 'men')}
          />
          <CategoryImageForm
            label="Women’s Wallets"
            currentUrl={womenImageUrl}
            action={uploadCategoryImage.bind(null, 'women')}
          />
        </div>
      </div>

      <div className="mb-10 flex flex-col gap-4">
        <h2 className="text-[1.1rem]">Material section video</h2>
        <CraftVideoForm currentUrl={craftVideoUrl} />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-[1.1rem]">&ldquo;See it up close&rdquo; gallery</h2>
        <HomeGalleryClient items={galleryItems} />
      </div>
    </>
  )
}
