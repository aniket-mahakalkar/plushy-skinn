import Badge from '@/components/admin/Badge'
import DataTable, { type Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import PageHeader from '@/components/admin/PageHeader'
import { listContactMessagesAdmin } from '@/lib/admin/queries'
import { parsePageParam } from '@/lib/admin/pagination'
import type { ContactMessage, SubmissionStatus } from '@/lib/types'
import { markMessageStatus } from './actions'

const STATUS_TONE: Record<SubmissionStatus, 'success' | 'neutral' | 'muted'> = {
  new: 'success',
  read: 'neutral',
  archived: 'muted',
}

interface AdminMessagesPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminMessagesPage({ searchParams }: AdminMessagesPageProps) {
  const page = parsePageParam((await searchParams).page)
  const { rows: messages, total, pageSize } = await listContactMessagesAdmin(page)

  const columns: Column<ContactMessage>[] = [
    { header: 'Name', render: (m) => m.name },
    { header: 'Email', render: (m) => m.email },
    { header: 'Subject', render: (m) => m.subject },
    { header: 'Message', render: (m) => m.message, className: 'wrap' },
    { header: 'Received', render: (m) => new Date(m.created_at).toLocaleDateString() },
    {
      header: 'Status',
      render: (m) => <Badge tone={STATUS_TONE[m.status]}>{m.status}</Badge>,
    },
    {
      header: 'Actions',
      render: (m) => (
        <div className="flex items-center gap-3">
          {m.status !== 'read' && (
            <form action={markMessageStatus.bind(null, m.id, 'read')}>
              <button type="submit" className="btn btn-outline btn-small">Mark read</button>
            </form>
          )}
          {m.status !== 'archived' && (
            <form action={markMessageStatus.bind(null, m.id, 'archived')}>
              <button type="submit" className="btn btn-outline btn-small">Archive</button>
            </form>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Contact messages" description="Submissions from the site Contact form." />
      <DataTable columns={columns} rows={messages} emptyMessage="No messages yet." />
      <Pagination page={page} pageSize={pageSize} total={total} basePath="/admin/messages" />
    </>
  )
}
