import PageHeader from '@/components/admin/PageHeader'
import { getDashboardCounts } from '@/lib/admin/queries'

export default async function AdminDashboardPage() {
  const counts = await getDashboardCounts()

  const stats = [
    { label: 'Products', value: counts.products, accent: 'bg-tan-deep' },
    { label: 'New gifting enquiries', value: counts.newEnquiries, accent: 'bg-[var(--leather)]' },
    { label: 'New contact messages', value: counts.newMessages, accent: 'bg-tan' },
    { label: 'Newsletter subscribers', value: counts.subscribers, accent: 'bg-ink-faint' },
    { label: 'Orders placed', value: counts.orders, accent: 'bg-[var(--success-text)]' },
  ]

  return (
    <>
      <PageHeader title="Dashboard" description="An overview of your catalog and incoming submissions." />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-paper p-5">
            <span className={`mb-3 block h-1.5 w-8 rounded-full ${s.accent}`} aria-hidden="true" />
            <strong className="block font-serif text-[2rem] text-ink">{s.value}</strong>
            <span className="text-[0.85rem] text-ink-faint">{s.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}
