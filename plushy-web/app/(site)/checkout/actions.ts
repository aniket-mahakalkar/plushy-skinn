'use server'

import { revalidatePath } from 'next/cache'
import { query, queryOne } from '@/lib/db'
import { checkoutSchema } from '@/lib/validation'
import { discountedPrice, type Coupon, type OrderItem, type Product } from '@/lib/types'

export interface ValidateCouponResult {
  ok: boolean
  discount_percent: number
  message: string
}

export async function validateCoupon(rawCode: string): Promise<ValidateCouponResult> {
  const code = rawCode.trim().toUpperCase()
  if (!code) return { ok: false, discount_percent: 0, message: 'Enter a coupon code.' }

  const coupon = await queryOne<Coupon>('select * from coupons where code = $1', [code])

  if (!coupon) return { ok: false, discount_percent: 0, message: 'That coupon code is not valid.' }
  if (!coupon.active) return { ok: false, discount_percent: 0, message: 'This coupon is no longer active.' }
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return { ok: false, discount_percent: 0, message: 'This coupon has expired.' }
  }
  if (coupon.usage_limit !== null && coupon.times_used >= coupon.usage_limit) {
    return { ok: false, discount_percent: 0, message: 'This coupon has reached its usage limit.' }
  }

  return { ok: true, discount_percent: coupon.discount_percent, message: `${coupon.discount_percent}% off applied.` }
}

export interface PlaceOrderPayload {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  couponCode: string
  items: { productId: string; quantity: number }[]
}

export interface PlaceOrderResult {
  ok: boolean
  orderId?: string
  message?: string
}

/** Payment is a placeholder for now — no gateway is wired up, so every valid order
 * is immediately marked 'paid'. Prices are always recomputed from the DB here,
 * never trusted from the client, so a tampered cart can't under-charge. */
export async function placeOrder(payload: PlaceOrderPayload): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse({
    customer_name: payload.customerName,
    customer_email: payload.customerEmail,
    customer_phone: payload.customerPhone,
    shipping_address: payload.shippingAddress,
    coupon_code: payload.couponCode,
  })
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Please check the form and try again.' }
  }

  if (!payload.items || payload.items.length === 0) {
    return { ok: false, message: 'Your cart is empty.' }
  }

  const productIds = [...new Set(payload.items.map((i) => i.productId))]
  const products = await query<Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'discount_percent'>>(
    'select id, name, slug, price, discount_percent from products where id = any($1::uuid[])',
    [productIds],
  )

  const orderItems: OrderItem[] = []
  let subtotal = 0
  for (const cartItem of payload.items) {
    const product = products.find((p) => p.id === cartItem.productId)
    if (!product || cartItem.quantity < 1) continue
    const unitPrice = discountedPrice(product)
    orderItems.push({ productId: product.id, name: product.name, slug: product.slug, unitPrice, quantity: cartItem.quantity })
    subtotal += unitPrice * cartItem.quantity
  }

  if (orderItems.length === 0) {
    return { ok: false, message: 'Your cart is empty.' }
  }
  subtotal = Math.round(subtotal * 100) / 100

  let discountAmount = 0
  let couponCode: string | null = null
  let coupon: Coupon | null = null
  const rawCode = parsed.data.coupon_code?.trim()

  if (rawCode) {
    const couponResult = await validateCoupon(rawCode)
    if (!couponResult.ok) {
      return { ok: false, message: couponResult.message }
    }
    couponCode = rawCode.toUpperCase()
    discountAmount = Math.round(subtotal * (couponResult.discount_percent / 100) * 100) / 100
    coupon = await queryOne<Coupon>('select * from coupons where code = $1', [couponCode])
  }

  const total = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100)

  let orderId: string
  try {
    const order = await queryOne<{ id: string }>(
      `insert into orders
         (customer_name, customer_email, customer_phone, shipping_address, items, subtotal, discount_amount, coupon_code, total, status, payment_method)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'paid', 'dummy')
       returning id`,
      [
        parsed.data.customer_name,
        parsed.data.customer_email,
        parsed.data.customer_phone || null,
        parsed.data.shipping_address,
        JSON.stringify(orderItems),
        subtotal,
        discountAmount,
        couponCode,
        total,
      ],
    )
    if (!order) throw new Error('Insert returned no row')
    orderId = order.id
  } catch (err) {
    console.error('placeOrder failed:', err instanceof Error ? err.message : err)
    return { ok: false, message: 'Something went wrong placing your order. Please try again.' }
  }

  if (coupon) {
    await query('update coupons set times_used = times_used + 1 where id = $1', [coupon.id])
  }

  revalidatePath('/admin/orders')
  return { ok: true, orderId }
}
