import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AddToCartForm from '@/components/site/AddToCartForm'
import { FALLBACK_PRODUCT_IMAGE, getProductBySlug } from '@/lib/products'
import { discountedPrice } from '@/lib/types'
import { formatPrice } from '@/lib/format'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product not found — Plushy Skinn' }
  return {
    title: `${product.name} — Plushy Skinn`,
    description: product.tagline,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const hasDiscount = product.discount_percent > 0
  const price = discountedPrice(product)

  return (
    <section className="pt-14 pb-24 max-[900px]:pb-16">
      <div className="container grid grid-cols-[1.1fr_0.9fr] items-start gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-[var(--shadow-md)]">
          <Image
            src={product.image_url ?? FALLBACK_PRODUCT_IMAGE}
            alt={product.name}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-start gap-3.5">
          <Link href="/shop" className="mb-2 text-[0.85rem] font-semibold text-ink-faint no-underline transition-colors hover:text-ink">
            &larr; Back to Shop
          </Link>
          <span className="eyebrow">{product.category === 'men' ? "Men's Wallet" : "Women's Wallet"}</span>
          <h1>{product.name}</h1>
          <p className="text-[1.05rem] text-ink-soft">{product.tagline}</p>
          <div className="flex items-baseline gap-3 font-sans text-[1.4rem] font-semibold text-tan-deep">
            {hasDiscount && (
              <span className="text-[1rem] font-medium text-ink-faint line-through">{formatPrice(product.price)}</span>
            )}
            <span>{formatPrice(price)}</span>
            {hasDiscount && (
              <span className="rounded-full bg-[var(--leather)] px-2.5 py-1 text-[0.7rem] font-bold text-cream">
                -{product.discount_percent}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[0.9rem] text-ink-faint">
            <span
              className="h-4 w-4 rounded-full border border-[rgba(0,0,0,0.1)]"
              style={{ background: product.swatch }}
            />
            <span>{product.color}</span>
          </div>

          {product.description && <p className="leading-[1.7] text-ink-soft">{product.description}</p>}

          <div className="mt-3">
            <AddToCartForm product={product} />
          </div>

          <div className="mt-2 flex flex-wrap gap-3.5">
            <Link href="/contact" className="btn btn-outline">Enquire / wholesale</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
