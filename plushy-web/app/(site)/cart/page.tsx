'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart/CartContext'
import { discountedPrice } from '@/lib/types'
import { FALLBACK_PRODUCT_IMAGE } from '@/lib/products'
import { formatPrice } from '@/lib/format'

export default function CartPage() {
  const { items, removeItem, setQuantity, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <section className="py-24 max-[900px]:py-16">
        <div className="container flex flex-col items-center gap-5 text-center">
          <span className="eyebrow">Your cart</span>
          <h1>Your cart is empty</h1>
          <p className="max-w-[420px] text-ink-faint">Browse the collection and add a wallet to get started.</p>
          <Link href="/shop" className="btn btn-primary mt-2">Shop wallets</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 max-[900px]:py-10">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Your cart</span>
          <h1>Cart</h1>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8">
          <ul className="flex flex-col gap-5">
            {items.map((item) => {
              const price = discountedPrice(item)
              return (
                <li
                  key={item.productId}
                  className="flex gap-4 rounded-lg border border-border bg-paper p-4 max-[480px]:flex-col"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md max-[480px]:h-40 max-[480px]:w-full">
                    <Image
                      src={item.image_url ?? FALLBACK_PRODUCT_IMAGE}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/shop/${item.slug}`} className="font-serif text-[1.05rem] text-ink no-underline hover:text-tan-deep">
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-[0.8rem] font-semibold text-ink-faint transition-colors hover:text-[var(--danger-text)]"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-[3px] border border-border-strong">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          className="flex h-9 w-8 items-center justify-center text-ink-soft hover:text-ink"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-[0.9rem] font-medium text-ink">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          className="flex h-9 w-8 items-center justify-center text-ink-soft hover:text-ink"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-sans font-semibold text-tan-deep">{formatPrice(price * item.quantity)}</span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="flex h-fit flex-col gap-5 rounded-lg border border-border bg-paper p-6">
            <div className="flex items-baseline justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span className="font-sans text-[1.2rem] font-semibold text-ink">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-[0.85rem] text-ink-faint">Shipping and any coupon discount are calculated at checkout.</p>
            <Link href="/checkout" className="btn btn-primary w-full justify-center">Proceed to checkout</Link>
            <Link href="/shop" className="text-center text-[0.85rem] font-semibold text-ink-faint no-underline hover:text-ink">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
