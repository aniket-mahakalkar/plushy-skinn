'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart/CartContext'
import type { Product } from '@/lib/types'

function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-3">
      {added ? (
        <Link
          href="/cart"
          className="inline-flex items-center justify-center rounded-[3px] bg-ink px-8 py-4 text-[0.9rem] font-semibold text-cream transition-colors duration-300 hover:bg-[var(--leather)]"
        >
          Added — View cart
        </Link>
      ) : (
        <>
          <div className="flex items-center rounded-[3px] border border-border-strong">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-[52px] w-10 items-center justify-center text-ink-soft transition-colors hover:text-ink"
            >
              −
            </button>
            <span className="w-8 text-center text-[0.95rem] font-medium text-ink">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-[52px] w-10 items-center justify-center text-ink-soft transition-colors hover:text-ink"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              addItem(product, quantity)
              setAdded(true)
            }}
            className="btn btn-primary"
          >
            Add to cart
          </button>
        </>
      )}
    </div>
  )
}

export default AddToCartForm
