import Link from 'next/link'
import Image from 'next/image'
import { discountedPrice, type Product } from '@/lib/types'
import { FALLBACK_PRODUCT_IMAGE } from '@/lib/products'
import { formatPrice } from '@/lib/format'

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'

function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.discount_percent > 0
  const price = discountedPrice(product)

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={`group flex flex-col overflow-hidden rounded-lg border border-border bg-paper text-inherit no-underline transition-all duration-[400ms] ${EASE} hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-md)]`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image_url ?? FALLBACK_PRODUCT_IMAGE}
          alt={product.name}
          fill
          sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 25vw"
          className={`object-cover transition-transform duration-[600ms] ${EASE} group-hover:scale-[1.08] group-hover:rotate-[0.4deg]`}
        />
        <span className="absolute left-3.5 top-3.5 z-10 rounded-full bg-[rgba(250,246,240,0.9)] px-2.5 py-[5px] text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-ink">
          {product.category === 'men' ? "Men's" : "Women's"}
        </span>
        {hasDiscount && (
          <span className="absolute right-3.5 top-3.5 z-10 rounded-full bg-[var(--leather)] px-2.5 py-[5px] text-[0.7rem] font-bold text-cream">
            -{product.discount_percent}%
          </span>
        )}
        <span
          className={`absolute inset-x-0 bottom-0 z-10 translate-y-full bg-[linear-gradient(0deg,rgba(21,16,9,0.85)_0%,rgba(21,16,9,0)_100%)] p-3 text-center text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-cream transition-transform duration-[350ms] ${EASE} group-hover:translate-y-0`}
        >
          Quick view
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="truncate text-[1.1rem] tracking-[-0.01em]">{product.name}</h3>
          <div className="flex items-baseline gap-2 whitespace-nowrap font-sans font-semibold text-tan-deep">
            {hasDiscount && (
              <span className="text-[0.8rem] font-medium text-ink-faint line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span>{formatPrice(price)}</span>
          </div>
        </div>
        <p className="line-clamp-2 min-h-[2.7em] text-[0.9rem] text-ink-faint">{product.tagline}</p>
        <div className="mt-auto flex items-center gap-2">
          <span
            className="h-3.5 w-3.5 rounded-full border border-[rgba(19,19,16,0.12)]"
            style={{ background: product.swatch }}
          />
          <span className="text-[0.82rem] text-ink-faint">{product.color}</span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
