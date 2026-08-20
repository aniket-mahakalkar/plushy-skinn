'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { discountedPrice, type CartItem, type Product } from '@/lib/types'

const STORAGE_KEY = 'plushy-cart'

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
  count: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

function readStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // One-time localStorage hydration after mount — SSR has no localStorage, so
    // this can't run during the initial render without causing a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStoredCart())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          discount_percent: product.discount_percent,
          image_url: product.image_url,
          swatch: product.swatch,
          quantity,
        },
      ]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  const setQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId)
      return
    }
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)))
  }

  const clear = () => setItems([])

  const { count, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        count: acc.count + item.quantity,
        subtotal: acc.subtotal + discountedPrice(item) * item.quantity,
      }),
      { count: 0, subtotal: 0 },
    )
  }, [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, setQuantity, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
