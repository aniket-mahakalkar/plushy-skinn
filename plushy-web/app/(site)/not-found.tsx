import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="bg-cream py-24 max-[900px]:py-16">
      <div className="container flex flex-col items-center gap-5 text-center">
        <span className="eyebrow">404</span>
        <h1 className="text-ink">Page not found</h1>
        <p className="max-w-[440px] text-[1.02rem] text-ink-faint">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3.5">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/shop" className="btn btn-outline">Shop wallets</Link>
        </div>
      </div>
    </section>
  )
}
