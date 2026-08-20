import Link from 'next/link'
import Image from 'next/image'
import PlayIcon from '@/components/site/PlayIcon'
import LeatherPanel from '@/components/site/LeatherPanel'
import ProductCard from '@/components/site/ProductCard'
import Reveal from '@/components/site/Reveal'
import { getFeaturedProducts } from '@/lib/products'
import { getHomeGalleryItems } from '@/lib/homeContent'
import { getSetting } from '@/lib/settings'
import type { HomeGalleryItem } from '@/lib/types'

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'

const stats = [
  { label: '100% vegan leather', detail: 'No animal hides, ever' },
  { label: 'Solid-brass hardware', detail: 'Built to outlast the trend' },
  { label: 'Carbon-neutral shipping', detail: 'Offset on every order' },
  { label: 'Small-batch made', detail: 'Cut and stitched to order' },
]

const process = [
  { step: '01', title: 'Sourced', text: 'Plant-based leather alternative, selected for how it ages.' },
  { step: '02', title: 'Cut', text: 'Every panel pattern-cut by hand to minimise waste.' },
  { step: '03', title: 'Stitched', text: 'Reinforced stitching over solid-brass hardware.' },
  { step: '04', title: 'Finished', text: 'Edges hand-burnished, then quality-checked one by one.' },
]

// Fallback open-source stock media (Pexels License — free for commercial use), used only
// if the admin hasn't configured homepage content yet at /admin/home.
const FALLBACK_CRAFT_VIDEO = 'https://videos.pexels.com/video-files/4452777/4452777-hd_1920_1080_25fps.mp4'
const FALLBACK_HERO_IMAGE = 'https://images.pexels.com/photos/915917/pexels-photo-915917.jpeg'
const FALLBACK_MEN_IMAGE = 'https://images.pexels.com/photos/167686/pexels-photo-167686.jpeg'
const FALLBACK_WOMEN_IMAGE = 'https://images.pexels.com/photos/5863645/pexels-photo-5863645.jpeg'

const FALLBACK_GALLERY: HomeGalleryItem[] = [
  {
    id: 'fallback-1',
    position: 0,
    type: 'image',
    color: '#a9793f',
    title: 'Cut by hand',
    caption: 'Every panel pattern-cut to minimise waste.',
    media_url: 'https://images.pexels.com/photos/4452610/pexels-photo-4452610.jpeg',
    created_at: '',
    updated_at: '',
  },
  {
    id: 'fallback-2',
    position: 1,
    type: 'video',
    color: '#3a281c',
    title: 'Stitched to last',
    caption: 'Reinforced stitching over solid-brass hardware.',
    media_url: 'https://videos.pexels.com/video-files/4456103/4456103-hd_1920_1080_25fps.mp4',
    created_at: '',
    updated_at: '',
  },
  {
    id: 'fallback-3',
    position: 2,
    type: 'image',
    color: '#6b6b47',
    title: 'Edges, burnished',
    caption: 'Hand-finished for a smooth, worn-in feel.',
    media_url: 'https://images.pexels.com/photos/915917/pexels-photo-915917.jpeg',
    created_at: '',
    updated_at: '',
  },
  {
    id: 'fallback-4',
    position: 3,
    type: 'video',
    color: '#b8654a',
    title: 'From plant to pocket',
    caption: 'The full process, start to finish.',
    media_url: 'https://videos.pexels.com/video-files/6654778/6654778-sd_960_506_25fps.mp4',
    created_at: '',
    updated_at: '',
  },
]

export default async function HomePage() {
  const [featured, galleryFromDb, craftVideoFromDb, heroImageFromDb, menImageFromDb, womenImageFromDb] = await Promise.all([
    getFeaturedProducts(4),
    getHomeGalleryItems(),
    getSetting('craft_video_url'),
    getSetting('hero_image_url'),
    getSetting('category_men_image_url'),
    getSetting('category_women_image_url'),
  ])
  const gallery = galleryFromDb.length > 0 ? galleryFromDb : FALLBACK_GALLERY
  const craftVideoSrc = craftVideoFromDb ?? FALLBACK_CRAFT_VIDEO
  const heroImageUrl = heroImageFromDb ?? FALLBACK_HERO_IMAGE
  const menImageUrl = menImageFromDb ?? FALLBACK_MEN_IMAGE
  const womenImageUrl = womenImageFromDb ?? FALLBACK_WOMEN_IMAGE

  return (
    <>
      <section className="overflow-hidden bg-[linear-gradient(180deg,var(--tan-pale)_0%,var(--cream)_65%)] pt-16 pb-0">
        <div className="container grid grid-cols-2 items-center gap-14 pb-16 max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[900px]:pb-10">
          <div className="flex max-w-[520px] flex-col gap-5">
            <span className="eyebrow hero-in hero-in-1">Handcrafted vegan leather</span>
            <h1 className="hero-in hero-in-2">
              Wallets built for how you <span className="accent-italic">actually</span> carry.
            </h1>
            <p className="hero-in hero-in-3 text-[1.08rem] text-ink-soft">
              Plushy Skinn makes premium wallets for men and women from cruelty-free,
              plant-based leather &mdash; cut, stitched, and finished by hand in small
              batches.
            </p>
            <div className="hero-in hero-in-4 mt-2 flex flex-wrap gap-3.5">
              <Link href="/shop?category=men" className="btn btn-primary">Shop Men&rsquo;s</Link>
              <Link href="/shop?category=women" className="btn btn-outline">Shop Women&rsquo;s</Link>
            </div>
          </div>

          <div className="hero-in hero-in-2 relative mx-auto h-[340px] w-full max-w-[420px] max-[900px]:order-[-1] max-[900px]:mt-2 max-[900px]:h-[300px] max-[560px]:h-[260px]">
            <div
              className="absolute top-[8%] right-[-8%] h-[75%] w-[75%] rounded-full bg-[radial-gradient(circle,var(--tan)_0%,transparent_70%)] opacity-40 blur-3xl"
              aria-hidden="true"
            />

            <div className="absolute inset-0 overflow-hidden rounded-[20px] ring-1 ring-[rgba(19,19,16,0.06)] drop-shadow-[0_30px_50px_rgba(28,23,18,0.28)]">
              <Image
                src={heroImageUrl}
                alt="Plushy Skinn wallet"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="absolute top-[6%] right-[6%] flex max-w-[240px] items-center gap-3 rounded-[10px] bg-paper/95 p-3.5 shadow-[var(--shadow-lg)] ring-1 ring-[rgba(19,19,16,0.05)] backdrop-blur-sm max-[900px]:max-w-[200px] max-[900px]:p-3 max-[560px]:right-[4%] max-[560px]:max-w-[160px] max-[560px]:gap-2 max-[560px]:p-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#6b6b47] ring-4 ring-[rgba(107,107,71,0.18)]" />
              <div>
                <strong className="block text-[0.88rem] text-ink max-[560px]:text-[0.78rem]">Zero animal hides</strong>
                <span className="text-[0.78rem] text-ink-faint max-[560px]:text-[0.7rem]">100% plant-based leather alternative</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-10">
        <div className="container grid grid-cols-4 gap-6 max-[900px]:grid-cols-2 max-[900px]:gap-5 max-[560px]:grid-cols-1">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="flex items-start gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tan-deep" aria-hidden="true" />
              <div>
                <h3 className="mb-1 font-sans text-[1rem] text-ink">{s.label}</h3>
                <p className="text-[0.88rem] text-ink-faint">{s.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section>
        <div className="container grid grid-cols-2 gap-7 max-[900px]:grid-cols-1">
          <Reveal>
            <Link
              href="/shop?category=men"
              className={`group relative block aspect-[5/4] overflow-hidden rounded-[10px] no-underline shadow-[var(--shadow-sm)] transition-shadow duration-400 hover:shadow-[var(--shadow-lg)]`}
            >
              <Image
                src={menImageUrl}
                alt="Men&rsquo;s Wallets"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className={`object-cover transition-transform duration-700 ${EASE} group-hover:scale-[1.06]`}
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-[linear-gradient(0deg,rgba(28,23,18,0.75)_0%,rgba(28,23,18,0)_100%)] p-7 max-[560px]:p-5">
                <h2 className="text-[1.5rem] text-cream max-[560px]:text-[1.25rem]">Crafted for Him</h2>
                <span className="inline-flex items-center gap-1.5 text-[0.88rem] text-tan-pale">
                  Shop the collection
                  <span className={`inline-block transition-transform duration-300 ${EASE} group-hover:translate-x-1`} aria-hidden="true">
                    &rarr;
                  </span>
                </span>
              </div>
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <Link
              href="/shop?category=women"
              className={`group relative block aspect-[5/4] overflow-hidden rounded-[10px] no-underline shadow-[var(--shadow-sm)] transition-shadow duration-400 hover:shadow-[var(--shadow-lg)]`}
            >
              <Image
                src={womenImageUrl}
                alt="Women&rsquo;s Wallets"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className={`object-cover transition-transform duration-700 ${EASE} group-hover:scale-[1.06]`}
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-[linear-gradient(0deg,rgba(28,23,18,0.75)_0%,rgba(28,23,18,0)_100%)] p-7 max-[560px]:p-5">
                <h2 className="text-[1.5rem] text-cream max-[560px]:text-[1.25rem]">Crafted for Her</h2>
                <span className="inline-flex items-center gap-1.5 text-[0.88rem] text-tan-pale">
                  Shop the collection
                  <span className={`inline-block transition-transform duration-300 ${EASE} group-hover:translate-x-1`} aria-hidden="true">
                    &rarr;
                  </span>
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Bestsellers</span>
            <h2>Customer favourites</h2>
          </Reveal>
          {featured.length > 0 ? (
            <div className="grid grid-cols-4 gap-6 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
              {featured.map((product, i) => (
                <Reveal key={product.id} delay={i * 60}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="rounded-[10px] border border-dashed border-border-strong px-6 py-10 text-center text-ink-faint">
              New arrivals are on the way &mdash; check back soon, or browse the full shop.
            </p>
          )}
          <div className="mt-10 flex justify-center">
            <Link href="/shop" className="btn btn-outline">View all wallets</Link>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 max-[900px]:py-16 max-[480px]:py-12">
        <div className="container grid grid-cols-2 items-center gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-16">
          <Reveal className="flex max-w-[480px] flex-col gap-6">
            <span className="eyebrow">Our material</span>
            <h2 className="text-[2.6rem] leading-[1.15] max-[480px]:text-[2rem]">
              Leather, without the leather.
            </h2>
            <p className="text-[1.05rem] text-ink-soft">
              Every Plushy Skinn wallet is made from a plant-based, bio-based leather
              alternative that looks, ages, and holds up like the real thing &mdash;
              without a single animal hide. It&rsquo;s tanned without heavy metals
              and finished entirely by hand.
            </p>
            <Link
              href="/our-story"
              className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--ink)_0%,var(--leather)_100%)] px-8 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-cream shadow-[0_16px_30px_-16px_rgba(19,19,16,0.55)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_20px_36px_-14px_rgba(19,19,16,0.6)]"
            >
              Read Our Story
            </Link>
          </Reveal>

          <Reveal delay={120} className="relative mx-auto w-full max-w-[420px] max-[900px]:max-w-[360px]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] shadow-[var(--shadow-lg)]">
              {craftVideoSrc ? (
                <video
                  src={craftVideoSrc}
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <LeatherPanel color="#6b6b47" stitch={false} className="absolute inset-0 h-full w-full" />
              )}
            </div>
            <span className="absolute -top-4 left-6 rounded-full bg-paper/95 px-5 py-2.5 text-[0.82rem] font-medium text-ink shadow-[0_12px_24px_-12px_rgba(19,19,16,0.35)] backdrop-blur-sm max-[480px]:left-3 max-[480px]:px-4 max-[480px]:py-2 max-[480px]:text-[0.75rem]">
              Considered Materials
            </span>
            <span className="absolute -bottom-4 right-6 inline-flex items-center gap-1.5 rounded-full bg-[var(--leather)] px-5 py-2.5 text-[0.82rem] font-medium text-cream shadow-[0_12px_24px_-12px_rgba(19,19,16,0.45)] max-[480px]:right-3 max-[480px]:px-4 max-[480px]:py-2 max-[480px]:text-[0.75rem]">
              Made in India <span aria-hidden="true">&#10022;</span>
            </span>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-24 max-[900px]:py-16 max-[480px]:py-12">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">See it up close</span>
            <h2>Made to be seen, not just worn</h2>
          </Reveal>
          <div className="grid grid-cols-4 gap-6 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
            {gallery.map((item, i) => (
              <Reveal
                key={item.id}
                delay={i * 80}
                className="group relative overflow-hidden rounded-[10px] shadow-[var(--shadow-sm)] transition-shadow duration-500 hover:shadow-[var(--shadow-lg)]"
              >
                <div className="relative aspect-[4/3]">
                  {item.type === 'video' && item.media_url ? (
                    <video
                      src={item.media_url}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : item.type === 'image' && item.media_url ? (
                    <Image
                      src={item.media_url}
                      alt={item.title}
                      fill
                      sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  ) : (
                    <LeatherPanel
                      color={item.color}
                      stitch={false}
                      className="absolute inset-0 h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  )}
                  {item.type === 'video' && !item.media_url && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper/90 shadow-[0_10px_30px_-10px_rgba(19,19,16,0.5)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <PlayIcon className="ml-0.5 text-[1.4rem] text-ink" />
                      </span>
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(28,23,18,0.75)_0%,rgba(28,23,18,0)_100%)] p-6">
                    <h3 className="text-[1.1rem] text-cream">{item.title}</h3>
                    <p className="mt-1 text-[0.85rem] text-tan-pale">{item.caption}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-paper">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">How it&rsquo;s made</span>
            <h2>From plant to pocket</h2>
          </Reveal>
          <div className="grid grid-cols-4 gap-8 max-[900px]:grid-cols-2 max-[900px]:gap-y-8 max-[560px]:grid-cols-1">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 90} className="relative pt-5">
                <span className="absolute top-0 left-0 h-0.5 w-8 bg-tan-deep" aria-hidden="true" />
                <span className="mb-1.5 block font-serif text-[0.85rem] text-tan-deep">{p.step}</span>
                <h3 className="mb-2">{p.title}</h3>
                <p className="text-[0.92rem] text-ink-faint">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-tan-pale">
        <Reveal className="container flex flex-wrap items-center justify-between gap-8 max-[900px]:justify-start">
          <div>
            <span className="inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-tan">
              For teams &amp; offices
            </span>
            <h2 className="my-2 text-cream">Corporate gifting, done thoughtfully.</h2>
            <p className="max-w-[480px] text-[rgba(239,225,205,0.75)]">
              Branded wallets for clients, new hires, and milestones &mdash; ordered in bulk, delivered on time.
            </p>
          </div>
          <Link href="/corporate-gifting" className="btn btn-light">Explore corporate gifting</Link>
        </Reveal>
      </section>
    </>
  )
}
