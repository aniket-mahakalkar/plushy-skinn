'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import AdminNav from './AdminNav'

function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-ink px-4 lg:hidden">
        <span className="font-serif text-[1rem] text-white">
          <span className="text-tan">Plushy</span>&nbsp;Skinn
        </span>
        <Button
          type="text"
          icon={<MenuOutlined style={{ color: '#fff', fontSize: 18 }} />}
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        />
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <AdminNav open={open} onNavigate={() => setOpen(false)} />

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-[1400px] p-5 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}

export default AdminShell
