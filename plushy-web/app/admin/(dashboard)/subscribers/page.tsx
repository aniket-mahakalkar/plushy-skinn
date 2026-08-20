import DataTable, { type Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import PageHeader from '@/components/admin/PageHeader'
import { listNewsletterSubscribersAdmin } from '@/lib/admin/queries'
import { parsePageParam } from '@/lib/admin/pagination'
import type { NewsletterSubscriber } from '@/lib/types'

interface AdminSubscribersPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminSubscribersPage({ searchParams }: AdminSubscribersPageProps) {
  const page = parsePageParam((await searchParams).page)
  const { rows: subscribers, total, pageSize } = await listNewsletterSubscribersAdmin(page)

  const columns: Column<NewsletterSubscriber>[] = [
    { header: 'Email', render: (s) => s.email },
    { header: 'Subscribed', render: (s) => new Date(s.created_at).toLocaleDateString() },
  ]

  return (
    <>
      <PageHeader title="Newsletter subscribers" description="Everyone who signed up via the footer newsletter form." />
      <DataTable columns={columns} rows={subscribers} emptyMessage="No subscribers yet." />
      <Pagination page={page} pageSize={pageSize} total={total} basePath="/admin/subscribers" />
    </>
  )
}
