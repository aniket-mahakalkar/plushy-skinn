export type ProductCategory = 'men' | 'women'

export interface Product {
  id: string
  slug: string
  name: string
  category: ProductCategory
  price: number
  discount_percent: number
  color: string
  swatch: string
  tagline: string
  description: string | null
  image_url: string | null
  is_featured: boolean
  created_at: string
  updated_at: string
}

/** price * (1 - discount_percent / 100), rounded to cents. */
export function discountedPrice(product: Pick<Product, 'price' | 'discount_percent'>): number {
  if (product.discount_percent <= 0) return product.price
  return Math.round(product.price * (1 - product.discount_percent / 100) * 100) / 100
}

export interface Coupon {
  id: string
  code: string
  discount_percent: number
  active: boolean
  expires_at: string | null
  usage_limit: number | null
  times_used: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  discount_percent: number
  image_url: string | null
  swatch: string
  quantity: number
}

export interface OrderItem {
  productId: string
  name: string
  slug: string
  unitPrice: number
  quantity: number
}

export type OrderStatus = 'paid' | 'cancelled'

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: string
  items: OrderItem[]
  subtotal: number
  discount_amount: number
  coupon_code: string | null
  total: number
  status: OrderStatus
  payment_method: string
  created_at: string
}

export type HomeGalleryItemType = 'image' | 'video'

export interface HomeGalleryItem {
  id: string
  position: number
  type: HomeGalleryItemType
  title: string
  caption: string
  media_url: string | null
  color: string
  created_at: string
  updated_at: string
}

export type SubmissionStatus = 'new' | 'read' | 'archived'

export interface GiftingEnquiry {
  id: string
  company: string
  email: string
  quantity: string
  occasion: string
  details: string | null
  status: SubmissionStatus
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: SubmissionStatus
  created_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  created_at: string
}

export interface FormActionState {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export const IDLE_FORM_STATE: FormActionState = { status: 'idle' }
