import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './tailwind.css'
import './globals.css'

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Plushy Skinn — Premium Vegan Leather Wallets',
  description:
    'Plushy Skinn — premium vegan leather wallets for men and women, handcrafted with sustainable materials. Shop wallets and corporate gifting.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
