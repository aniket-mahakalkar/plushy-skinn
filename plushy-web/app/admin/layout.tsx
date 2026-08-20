import type { ReactNode } from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import AdminThemeProvider from '@/components/admin/AdminThemeProvider'

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <AdminThemeProvider>{children}</AdminThemeProvider>
    </AntdRegistry>
  )
}
