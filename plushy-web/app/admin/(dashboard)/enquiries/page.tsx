import Badge from '@/components/admin/Badge'
import DataTable, { type Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import PageHeader from '@/components/admin/PageHeader'
import { listGiftingEnquiriesAdmin } from '@/lib/admin/queries'
import { parsePageParam } from '@/lib/admin/pagination'
import type { GiftingEnquiry, SubmissionStatus } from '@/lib/types'
import { markEnquiryStatus } from './actions'

const STATUS_TONE: Record<SubmissionStatus, 'success' | 'neutral' | 'muted'> = {
  new: 'success',
  read: 'neutral',
  archived: 'muted',
}

interface AdminEnquiriesPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminEnquiriesPage({ searchParams }: AdminEnquiriesPageProps) {
  const page = parsePageParam((await searchParams).page)
  const { rows: enquiries, total, pageSize } = await listGiftingEnquiriesAdmin(page)

  const columns: Column<GiftingEnquiry>[] = [
    { header: 'Company', render: (e) => e.company },
    { header: 'Email', render: (e) => e.email },
    { header: 'Quantity', render: (e) => e.quantity },
    { header: 'Occasion', render: (e) => e.occasion },
    { header: 'Details', render: (e) => e.details || '—', className: 'wrap' },
    { header: 'Received', render: (e) => new Date(e.created_at).toLocaleDateString() },
    {
      header: 'Status',
      render: (e) => <Badge tone={STATUS_TONE[e.status]}>{e.status}</Badge>,
    },
    {
      header: 'Actions',
      render: (e) => (
        <div className="flex items-center gap-3">
          {e.status !== 'read' && (
            <form action={markEnquiryStatus.bind(null, e.id, 'read')}>
              <button type="submit" className="btn btn-outline btn-small">Mark read</button>
            </form>
          )}
          {e.status !== 'archived' && (
            <form action={markEnquiryStatus.bind(null, e.id, 'archived')}>
              <button type="submit" className="btn btn-outline btn-small">Archive</button>
            </form>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Corporate gifting enquiries" description="Submissions from the Corporate Gifting enquiry form." />
      <DataTable columns={columns} rows={enquiries} emptyMessage="No enquiries yet." />
      <Pagination page={page} pageSize={pageSize} total={total} basePath="/admin/enquiries" />
    </>
  )
}
