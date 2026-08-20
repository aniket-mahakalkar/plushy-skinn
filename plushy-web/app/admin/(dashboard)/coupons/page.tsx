import Link from 'next/link'
import Badge from '@/components/admin/Badge'
import DataTable, { type Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import PageHeader from '@/components/admin/PageHeader'
import { listCouponsAdmin } from '@/lib/admin/queries'
import { parsePageParam } from '@/lib/admin/pagination'
import type { Coupon } from '@/lib/types'
import { deleteCoupon } from './actions'

function isExpired(coupon: Coupon): boolean {
  return Boolean(coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now())
}

interface AdminCouponsPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminCouponsPage({ searchParams }: AdminCouponsPageProps) {
  const page = parsePageParam((await searchParams).page)
  const { rows: coupons, total, pageSize } = await listCouponsAdmin(page)

  const columns: Column<Coupon>[] = [
    { header: 'Code', render: (c) => c.code },
    { header: 'Discount', render: (c) => `${c.discount_percent}%` },
    { header: 'Used', render: (c) => `${c.times_used}${c.usage_limit ? ` / ${c.usage_limit}` : ''}` },
    { header: 'Expires', render: (c) => (c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '—') },
    {
      header: 'Status',
      render: (c) => {
        if (isExpired(c)) return <Badge tone="muted">Expired</Badge>
        return c.active ? <Badge tone="success">Active</Badge> : <Badge tone="neutral">Inactive</Badge>
      },
    },
    {
      header: 'Actions',
      render: (c) => (
        <div className="flex items-center gap-3">
          <Link href={`/admin/coupons/${c.id}/edit`} className="btn btn-outline btn-small">
            Edit
          </Link>
          <form action={deleteCoupon.bind(null, c.id)}>
            <button type="submit" className="btn btn-danger btn-small">
              Delete
            </button>
          </form>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Coupons"
        description="Manage discount codes customers can apply at checkout."
        action={
          <Link href="/admin/coupons/new" className="btn btn-primary">
            Add coupon
          </Link>
        }
      />

      <DataTable columns={columns} rows={coupons} emptyMessage="No coupons yet — add your first one." />
      <Pagination page={page} pageSize={pageSize} total={total} basePath="/admin/coupons" />
    </>
  )
}
