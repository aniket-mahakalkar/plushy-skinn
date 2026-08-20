import Link from 'next/link'
import Badge from '@/components/admin/Badge'
import DataTable, { type Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import PageHeader from '@/components/admin/PageHeader'
import { listOrdersAdmin } from '@/lib/admin/queries'
import { parsePageParam } from '@/lib/admin/pagination'
import type { Order } from '@/lib/types'
import { formatPrice } from '@/lib/format'

interface AdminOrdersPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const page = parsePageParam((await searchParams).page)
  const { rows: orders, total, pageSize } = await listOrdersAdmin(page)

  const columns: Column<Order>[] = [
    { header: 'Placed', render: (o) => new Date(o.created_at).toLocaleString() },
    { header: 'Customer', render: (o) => o.customer_name, className: 'wrap' },
    { header: 'Items', render: (o) => o.items.reduce((sum, i) => sum + i.quantity, 0) },
    { header: 'Total', render: (o) => formatPrice(o.total) },
    { header: 'Coupon', render: (o) => o.coupon_code ?? '—' },
    {
      header: 'Status',
      render: (o) => (o.status === 'paid' ? <Badge tone="success">Paid</Badge> : <Badge tone="muted">Cancelled</Badge>),
    },
    {
      header: 'Actions',
      render: (o) => (
        <Link href={`/admin/orders/${o.id}`} className="btn btn-outline btn-small">
          View
        </Link>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Orders"
        description="Checkout is a placeholder for now — every order is marked paid automatically, no real payment gateway is connected."
      />

      <DataTable columns={columns} rows={orders} emptyMessage="No orders yet." />
      <Pagination page={page} pageSize={pageSize} total={total} basePath="/admin/orders" />
    </>
  )
}
