import Link from 'next/link'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  basePath: string
}

function Pagination({ page, pageSize, total, basePath }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  const hrefFor = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`)

  return (
    <div className="mt-5 flex items-center justify-between text-[0.85rem] text-ink-faint">
      <span>
        Page {page} of {totalPages} &middot; {total} total
      </span>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className="btn btn-outline btn-small">
            Previous
          </Link>
        ) : (
          <span className="btn btn-outline btn-small pointer-events-none opacity-40">Previous</span>
        )}
        {page < totalPages ? (
          <Link href={hrefFor(page + 1)} className="btn btn-outline btn-small">
            Next
          </Link>
        ) : (
          <span className="btn btn-outline btn-small pointer-events-none opacity-40">Next</span>
        )}
      </div>
    </div>
  )
}

export default Pagination
