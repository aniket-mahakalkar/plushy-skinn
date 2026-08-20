import Link from 'next/link'
import NewsletterForm from '../forms/NewsletterForm'

function Footer() {
  return (
    <footer className="bg-ink pt-[72px] text-[rgba(244,240,226,0.7)]">
      <div className="container grid grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 border-b border-white/10 pb-12 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
        <div className="flex max-w-[320px] flex-col gap-3.5 max-[900px]:col-span-2 max-[900px]:max-w-none max-[560px]:col-span-1">
          <span className="font-serif text-[1.3rem] text-cream">Plushy Skinn</span>
          <p className="text-[0.92rem] leading-[1.6] text-[rgba(239,225,205,0.65)]">
            Premium vegan leather wallets, handcrafted for everyday carry. Cruelty-free
            materials, built to last.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="mb-1 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-cream">Shop</h4>
          <Link href="/shop?category=men" className="text-[0.92rem] text-[rgba(239,225,205,0.75)] no-underline transition-colors hover:text-tan">
            Men&rsquo;s Wallets
          </Link>
          <Link href="/shop?category=women" className="text-[0.92rem] text-[rgba(239,225,205,0.75)] no-underline transition-colors hover:text-tan">
            Women&rsquo;s Wallets
          </Link>
          <Link href="/corporate-gifting" className="text-[0.92rem] text-[rgba(239,225,205,0.75)] no-underline transition-colors hover:text-tan">
            Corporate Gifting
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="mb-1 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-cream">Company</h4>
          <Link href="/our-story" className="text-[0.92rem] text-[rgba(239,225,205,0.75)] no-underline transition-colors hover:text-tan">
            Our Story
          </Link>
          <Link href="/contact" className="text-[0.92rem] text-[rgba(239,225,205,0.75)] no-underline transition-colors hover:text-tan">
            Contact
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="mb-1 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-cream">Stay in touch</h4>
          <p className="text-[0.92rem] leading-[1.6] text-[rgba(239,225,205,0.65)]">Get early access to new colours and drops.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="container flex items-center justify-between gap-4 px-6 py-6 text-[0.82rem] text-[rgba(239,225,205,0.55)] max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-1">
        <span>&copy; {new Date().getFullYear()} Plushy Skinn. All rights reserved.</span>
        <span>Made with 100% vegan leather.</span>
      </div>
    </footer>
  )
}

export default Footer
