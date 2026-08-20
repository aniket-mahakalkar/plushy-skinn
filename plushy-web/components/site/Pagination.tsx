import Link from 'next/link'

interface PaginationProps {
  page: number
  totalPages: number
  buildHref: (page: number) => string
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1])
  const filtered = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

  const result: (number | 'ellipsis')[] = []
  let prev = 0
  for (const p of filtered) {
    if (p - prev > 1) result.push('ellipsis')
    result.push(p)
    prev = p
  }
  return result
}

function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(page, totalPages)

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-1.5">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-label="Previous page"
        aria-disabled={page === 1}
        tabIndex={page === 1 ? -1 : undefined}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-ink-soft no-underline transition-colors ${
          page === 1 ? 'pointer-events-none opacity-30' : 'hover:border-ink hover:text-ink'
        }`}
      >
        &larr;
      </Link>

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="px-1.5 text-ink-faint">
            &hellip;
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-[0.9rem] font-medium no-underline transition-colors ${
              p === page ? 'bg-ink text-cream' : 'text-ink-soft hover:bg-tan-pale'
            }`}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-label="Next page"
        aria-disabled={page === totalPages}
        tabIndex={page === totalPages ? -1 : undefined}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-ink-soft no-underline transition-colors ${
          page === totalPages ? 'pointer-events-none opacity-30' : 'hover:border-ink hover:text-ink'
        }`}
      >
        &rarr;
      </Link>
    </nav>
  )
}

export default Pagination
