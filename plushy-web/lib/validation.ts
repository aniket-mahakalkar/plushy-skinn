import { z } from 'zod'

/** Public forms include a hidden `company_website` field; bots fill it, humans don't. */
export function isHoneypotTripped(formData: FormData): boolean {
  const value = formData.get('company_website')
  return typeof value === 'string' && value.trim().length > 0
}

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Enter a valid email').max(320),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(1, 'Message is required').max(5000),
})

export const giftingEnquirySchema = z.object({
  company: z.string().trim().min(1, 'Company name is required').max(200),
  email: z.string().trim().email('Enter a valid email').max(320),
  quantity: z.string().trim().min(1).max(50),
  occasion: z.string().trim().min(1).max(100),
  details: z.string().trim().max(5000).optional().or(z.literal('')),
})

export const newsletterSchema = z.object({
  email: z.string().trim().email('Enter a valid email').max(320),
})

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  category: z.enum(['men', 'women']),
  price: z.coerce.number().min(0, 'Price must be positive'),
  discount_percent: z.coerce.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%'),
  color: z.string().trim().min(1, 'Color is required').max(100),
  swatch: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Swatch must be a hex color like #a9793f'),
  tagline: z.string().trim().min(1, 'Tagline is required').max(300),
  description: z.string().trim().max(5000).optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
})

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Code is required')
    .max(40)
    .transform((v) => v.toUpperCase()),
  discount_percent: z.coerce.number().gt(0, 'Discount must be greater than 0').max(100, 'Discount cannot exceed 100%'),
  active: z.boolean().default(true),
  expires_at: z.string().trim().max(40).optional().or(z.literal('')),
  usage_limit: z.coerce.number().int().positive().optional().or(z.literal('')),
})

export const checkoutSchema = z.object({
  customer_name: z.string().trim().min(1, 'Name is required').max(200),
  customer_email: z.string().trim().email('Enter a valid email').max(320),
  customer_phone: z.string().trim().max(40).optional().or(z.literal('')),
  shipping_address: z.string().trim().min(1, 'Shipping address is required').max(2000),
  coupon_code: z.string().trim().max(40).optional().or(z.literal('')),
})

export const contactInfoSchema = z.object({
  email: z.string().trim().email('Enter a valid email').max(320),
  support_email: z.string().trim().email('Enter a valid email').max(320).optional().or(z.literal('')),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  hours: z.string().trim().max(200).optional().or(z.literal('')),
  address: z.string().trim().min(1, 'Address is required').max(500),
  map_embed_input: z.string().trim().max(3000).optional().or(z.literal('')),
})

export const homeGalleryItemSchema = z.object({
  type: z.enum(['image', 'video']),
  title: z.string().trim().min(1, 'Title is required').max(200),
  caption: z.string().trim().min(1, 'Caption is required').max(300),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Fallback color must be a hex color like #a9793f'),
  position: z.coerce.number().int().min(0).default(0),
})

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_VIDEO_BYTES = 80 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm']

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
