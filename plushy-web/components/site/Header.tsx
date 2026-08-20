'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingOutlined } from '@ant-design/icons'
import { useCart } from '@/lib/cart/CartContext'

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/corporate-gifting', label: 'Corporate Gifting' },
  { href: '/contact', label: 'Contact' },
]

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'

function Header({ logoUrl }: { logoUrl?: string | null }) {
  const pathname = usePathname()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false
    const evaluate = () => {
      ticking = false
      setScrolled((prev) => {
        if (prev) return window.scrollY > 12
        return window.scrollY > 32
      })
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(evaluate)
    }
    evaluate()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${EASE} ${
        scrolled ? 'bg-paper/85 shadow-[0_1px_0_rgba(19,19,16,0.06)]' : 'bg-paper/0'
      }`}
    >
      <div
        className={`container flex items-center justify-between transition-[height] duration-300 ${EASE} ${
          scrolled ? 'h-16' : 'h-20'
        }`}
      >
        <Link
          href="/"
          onClick={closeMenu}
          className="shrink-0 font-serif text-[1.3rem] tracking-[-0.01em] text-ink no-underline transition-opacity duration-200 hover:opacity-70"
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- external Supabase-hosted logo, admin-controlled
            <img src={logoUrl} alt="Plushy Skinn" className="h-8 w-auto" />
          ) : (
            'Plushy Skinn'
          )}
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex flex-col items-center gap-1.5 py-1 text-[0.88rem] tracking-[0.01em] no-underline transition-colors duration-200 ${
                  isActive ? 'text-ink' : 'text-ink-faint hover:text-ink'
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`h-1 w-1 rounded-full bg-tan-deep transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/cart"
            aria-label={`View cart${count > 0 ? ` (${count} item${count === 1 ? '' : 's'})` : ''}`}
            className="relative flex h-9 w-9 items-center justify-center text-ink-soft no-underline transition-colors hover:text-ink"
          >
            <ShoppingOutlined className="text-[1.15rem]" aria-hidden="true" />
            {count > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[0.6rem] font-medium text-cream">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span className={`block h-px w-5 bg-ink transition-transform duration-200 ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
            <span className={`block h-px w-5 bg-ink transition-transform duration-200 ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      <nav
        className={`fixed inset-x-0 bottom-0 flex flex-col bg-paper px-6 pt-4 transition-all duration-200 md:hidden ${
          scrolled ? 'top-16' : 'top-20'
        } ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        {links.map((link) => {
          const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`border-b border-border py-4 text-[1rem] no-underline first:pt-0 ${isActive ? 'text-ink' : 'text-ink-faint'}`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

export default Header
