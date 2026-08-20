import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-cream px-6 text-center">
      <span className="eyebrow">404</span>
      <h1 className="text-ink">Page not found</h1>
      <p className="max-w-[440px] text-[1.02rem] text-ink-faint">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
      </p>
      <Link href="/" className="btn btn-primary mt-2">Back to home</Link>
    </div>
  )
}
