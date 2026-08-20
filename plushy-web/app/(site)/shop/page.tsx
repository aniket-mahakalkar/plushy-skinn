import Link from 'next/link'
import Pagination from '@/components/site/Pagination'
import ProductCard from '@/components/site/ProductCard'
import Reveal from '@/components/site/Reveal'
import { getProducts } from '@/lib/products'
import type { ProductCategory } from '@/lib/types'

const filters: { label: string; value: ProductCategory | 'all' }[] = [
  { label: 'All Wallets', value: 'all' },
  { label: "Men's", value: 'men' },
  { label: "Women's", value: 'women' },
]

function buildHref(category: ProductCategory | 'all', page: number): string {
  const params = new URLSearchParams()
  if (category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `/shop?${qs}` : '/shop'
}

interface ShopPageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category: rawCategory, page: rawPage } = await searchParams
  const category: ProductCategory | 'all' = rawCategory === 'men' || rawCategory === 'women' ? rawCategory : 'all'
  const requestedPage = Number(rawPage)
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1

  const { products, total, pageSize } = await getProducts({
    category: category === 'all' ? undefined : category,
    page,
  })
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(total, page * pageSize)

  return (
    <>
      <section className="bg-[linear-gradient(180deg,var(--tan-pale)_0%,var(--cream)_65%)] pb-14 pt-20 max-[560px]:pb-10 max-[560px]:pt-16">
        <div className="container flex flex-col items-center gap-4 text-center">
          <span className="eyebrow">Shop</span>
          <h1 className="max-w-[560px]">Wallets for men and women</h1>
          <p className="max-w-[480px] text-[1.02rem] text-ink-soft">
            Every wallet is cut and stitched from vegan leather in small batches, built to carry daily.
          </p>
        </div>
      </section>

      <section className="pb-24 pt-12 max-[900px]:pb-16">
        <div className="container">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2.5">
              {filters.map((f) => (
                <Link
                  key={f.value}
                  href={buildHref(f.value, 1)}
                  className={`inline-flex rounded-full border px-5 py-2.5 text-[0.88rem] font-semibold no-underline transition-all duration-200 ${
                    category === f.value
                      ? 'border-ink bg-ink text-cream shadow-[0_8px_20px_-10px_rgba(19,19,16,0.5)]'
                      : 'border-border-strong bg-paper text-ink-soft hover:border-ink hover:text-ink'
                  }`}
                >
                  {f.label}
                </Link>
              ))}
            </div>
            {total > 0 && (
              <p className="text-[0.85rem] text-ink-faint">
                Showing {rangeStart}&ndash;{rangeEnd} of {total} wallet{total === 1 ? '' : 's'}
              </p>
            )}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-4 gap-6 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
              {products.map((product, i) => (
                <Reveal key={product.id} delay={(i % pageSize) * 40}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border-strong px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tan-pale text-2xl" aria-hidden="true">
                🧵
              </span>
              <p className="max-w-[360px] text-ink-faint">
                No wallets here yet &mdash; the catalog is being restocked. Check back soon.
              </p>
              <Link href="/shop" className="btn btn-outline">
                View all wallets
              </Link>
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} buildHref={(p) => buildHref(category, p)} />
        </div>
      </section>
    </>
  )
}
