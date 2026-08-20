'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Button } from 'antd'
import { LogoutOutlined, HomeOutlined } from '@ant-design/icons'
import { logout } from '@/app/admin/actions'

const links = [
  { key: '/admin', label: 'Dashboard' },
  { key: '/admin/products', label: 'Products' },
  { key: '/admin/coupons', label: 'Coupons' },
  { key: '/admin/orders', label: 'Orders' },
  { key: '/admin/home', label: 'Homepage content' },
  { key: '/admin/contact-info', label: 'Contact info' },
  { key: '/admin/logo', label: 'Company logo' },
  { key: '/admin/enquiries', label: 'Gifting enquiries' },
  { key: '/admin/messages', label: 'Contact messages' },
  { key: '/admin/subscribers', label: 'Subscribers' },
]

function AdminNav({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const pathname = usePathname()

  const selectedKey = links
    .filter((l) => (l.key === '/admin' ? pathname === '/admin' : pathname.startsWith(l.key)))
    .sort((a, b) => b.key.length - a.key.length)[0]?.key

  const items = links.map((l) => ({
    key: l.key,
    label: (
      <Link href={l.key} onClick={onNavigate}>
        {l.label}
      </Link>
    ),
  }))

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${
        open ? 'translate-x-0 shadow-[var(--shadow-lg)]' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 shrink-0 items-center px-5 font-serif text-[1.1rem] text-white">
        <span className="text-tan">Plushy</span>&nbsp;Skinn
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto pb-4">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : []}
          items={items}
          style={{ borderInlineEnd: 'none', background: 'transparent' }}
        />
      </nav>
      <div className="flex shrink-0 flex-col gap-2 border-t border-white/10 p-4">
        <Button block icon={<HomeOutlined />} href="/">
          Back to website
        </Button>
        <form action={logout}>
          <Button danger block icon={<LogoutOutlined />} htmlType="submit">
            Log out
          </Button>
        </form>
      </div>
    </aside>
  )
}

export default AdminNav
