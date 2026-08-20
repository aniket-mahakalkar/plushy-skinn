import type { ReactNode } from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import SiteThemeProvider from '@/components/site/SiteThemeProvider'
import { getCompanyLogoUrl } from '@/lib/settings'
import { CartProvider } from '@/lib/cart/CartContext'

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const logoUrl = await getCompanyLogoUrl()

  return (
    <AntdRegistry>
      <SiteThemeProvider>
        <CartProvider>
          <Header logoUrl={logoUrl} />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </SiteThemeProvider>
    </AntdRegistry>
  )
}
