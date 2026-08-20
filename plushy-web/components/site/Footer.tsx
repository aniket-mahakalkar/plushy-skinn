import Link from 'next/link'
import NewsletterForm from '../forms/NewsletterForm'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <span className="site-footer__logo">Plushy Skinn</span>
          <p>
            Premium vegan leather wallets, handcrafted for everyday carry. Cruelty-free
            materials, built to last.
          </p>
        </div>

        <div className="site-footer__col">
          <h4>Shop</h4>
          <Link href="/shop?category=men">Men&rsquo;s Wallets</Link>
          <Link href="/shop?category=women">Women&rsquo;s Wallets</Link>
          <Link href="/corporate-gifting">Corporate Gifting</Link>
        </div>

        <div className="site-footer__col">
          <h4>Company</h4>
          <Link href="/our-story">Our Story</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="site-footer__col">
          <h4>Stay in touch</h4>
          <p>Get early access to new colours and drops.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="container site-footer__bottom">
        <span>&copy; {new Date().getFullYear()} Plushy Skinn. All rights reserved.</span>
        <span>Made with 100% vegan leather.</span>
      </div>
    </footer>
  )
}

export default Footer
