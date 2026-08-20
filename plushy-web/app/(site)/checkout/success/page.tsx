import Link from 'next/link'

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { order } = await searchParams

  return (
    <section className="py-24 max-[900px]:py-16">
      <div className="container flex max-w-[540px] flex-col items-center gap-5 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--success-bg)] text-2xl text-[var(--success-text)]">
          &#10003;
        </span>
        <span className="eyebrow">Order confirmed</span>
        <h1>Thank you for your order</h1>
        {order && <p className="text-ink-faint">Order reference: {order}</p>}
        <p className="text-ink-soft">
          A confirmation has been recorded. Note: payment is currently a placeholder for this site — no real
          charge was made and no payment gateway is connected yet.
        </p>
        <Link href="/shop" className="btn btn-primary mt-2">Continue shopping</Link>
      </div>
    </section>
  )
}
