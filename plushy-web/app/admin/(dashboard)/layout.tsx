import type { ReactNode } from 'react'
import { requireAdminSession } from '@/lib/auth/session'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  await requireAdminSession()

  return <AdminShell>{children}</AdminShell>
}
