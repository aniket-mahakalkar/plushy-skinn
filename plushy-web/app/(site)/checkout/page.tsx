'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input, Button } from 'antd'
import { useCart } from '@/lib/cart/CartContext'
import { discountedPrice } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { placeOrder, validateCoupon } from './actions'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clear } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState<{ code: string; discountPercent: number } | null>(null)
  const [couponMessage, setCouponMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [couponPending, startCouponTransition] = useTransition()
  const [orderPending, startOrderTransition] = useTransition()
  const [orderError, setOrderError] = useState<string | null>(null)

  const discountAmount = coupon ? Math.round(subtotal * (coupon.discountPercent / 100) * 100) / 100 : 0
  const total = Math.max(0, subtotal - discountAmount)

  function applyCoupon() {
    setCouponMessage(null)
    startCouponTransition(async () => {
      const result = await validateCoupon(couponInput)
      if (result.ok) {
        setCoupon({ code: couponInput.trim().toUpperCase(), discountPercent: result.discount_percent })
      } else {
        setCoupon(null)
      }
      setCouponMessage({ text: result.message, ok: result.ok })
    })
  }

  function handlePlaceOrder(formData: FormData) {
    setOrderError(null)
    startOrderTransition(async () => {
      const result = await placeOrder({
        customerName: String(formData.get('customer_name') ?? ''),
        customerEmail: String(formData.get('customer_email') ?? ''),
        customerPhone: String(formData.get('customer_phone') ?? ''),
        shippingAddress: String(formData.get('shipping_address') ?? ''),
        couponCode: coupon?.code ?? '',
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      })
      if (!result.ok) {
        setOrderError(result.message ?? 'Something went wrong. Please try again.')
        return
      }
      clear()
      router.push(`/checkout/success?order=${result.orderId}`)
    })
  }

  if (items.length === 0) {
    return (
      <section className="py-24 max-[900px]:py-16">
        <div className="container flex flex-col items-center gap-5 text-center">
          <span className="eyebrow">Checkout</span>
          <h1>Your cart is empty</h1>
          <Link href="/shop" className="btn btn-primary mt-2">Shop wallets</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 max-[900px]:py-10">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Checkout</span>
          <h1>Checkout</h1>
        </div>

        <div className="grid grid-cols-[1fr_360px] gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8">
          <form action={handlePlaceOrder} className="form-grid flex flex-col gap-5">
            <label>
              Full name
              <Input type="text" name="customer_name" required />
            </label>
            <label>
              Email
              <Input type="email" name="customer_email" required />
            </label>
            <label>
              Phone (optional)
              <Input type="tel" name="customer_phone" />
            </label>
            <label>
              Shipping address
              <Input.TextArea name="shipping_address" rows={3} required />
            </label>

            {orderError && <p className="form-error">{orderError}</p>}

            <Button
              type="primary"
              htmlType="submit"
              loading={orderPending}
              block
              size="large"
              className="mt-2"
            >
              {orderPending ? 'Placing order…' : `Place order — ${formatPrice(total)}`}
            </Button>
            <p className="text-center text-[0.8rem] text-ink-faint">
              Payment is a placeholder for now — no real charge is made.
            </p>
          </form>

          <div className="flex h-fit flex-col gap-5 rounded-lg border border-border bg-paper p-6">
            <h2 className="text-[1.1rem]">Order summary</h2>

            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li key={item.productId} className="flex items-baseline justify-between gap-3 text-[0.9rem]">
                  <span className="text-ink-soft">
                    {item.name} <span className="text-ink-faint">&times;{item.quantity}</span>
                  </span>
                  <span className="whitespace-nowrap text-ink">
                    {formatPrice(discountedPrice(item) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <label className="text-[0.85rem] font-semibold text-ink" htmlFor="coupon">
                Have a coupon?
              </label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter code"
                  disabled={couponPending}
                />
                <Button
                  onClick={applyCoupon}
                  disabled={couponPending || !couponInput.trim()}
                  loading={couponPending}
                  className="shrink-0"
                >
                  Apply
                </Button>
              </div>
              {couponMessage && (
                <p className={`text-[0.8rem] ${couponMessage.ok ? 'text-[var(--success-text)]' : 'text-[var(--danger-text)]'}`}>
                  {couponMessage.text}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <div className="flex items-baseline justify-between text-[0.95rem]">
                <span className="text-ink-soft">Subtotal</span>
                <span className="text-ink">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-baseline justify-between text-[0.95rem]">
                  <span className="text-ink-soft">Coupon ({coupon?.code})</span>
                  <span className="text-[var(--success-text)]">&minus;{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-border pt-2 text-[1.05rem] font-semibold">
                <span className="text-ink">Total</span>
                <span className="text-ink">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
