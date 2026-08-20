'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CloseOutlined } from '@ant-design/icons'
import { Input, InputNumber, Checkbox } from 'antd'
import type { Product, ProductCategory } from '@/lib/types'
import { discountedPrice } from '@/lib/types'
import { FALLBACK_PRODUCT_IMAGE } from '@/lib/products'
import { formatPrice } from '@/lib/format'
import MediaField from './MediaField'
import SubmitButton from './SubmitButton'

interface ProductFormProps {
  action: (formData: FormData) => void | Promise<void>
  product?: Product
  submitLabel: string
  title?: string
  onClose?: () => void
}

function SectionLabel({ children }: { children: string }) {
  return <p className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-ink-faint">{children}</p>
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-[0.85rem] font-semibold text-ink">{children}</span>
}

function ProductForm({ action, product, submitLabel, title, onClose }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? '')
  const [tagline, setTagline] = useState(product?.tagline ?? '')
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? 'men')
  const [price, setPrice] = useState(product?.price ?? 0)
  const [discountPercent, setDiscountPercent] = useState(product?.discount_percent ?? 0)
  const [swatch, setSwatch] = useState(product?.swatch ?? '#a9793f')
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url ?? null)

  const isValidSwatch = /^#[0-9a-fA-F]{6}$/.test(swatch)
  const previewPrice = discountedPrice({ price: Number(price) || 0, discount_percent: Number(discountPercent) || 0 })

  return (
    <div className="grid grid-cols-[1fr_300px] items-start gap-6 max-[900px]:grid-cols-1">
      <form className="flex flex-col gap-7 rounded-xl border border-border bg-paper p-7 max-[900px]:max-h-[85vh] max-[900px]:overflow-y-auto" action={action}>
        {title && (
          <div className="-mt-1 flex items-center justify-between border-b border-border pb-5">
            <h2 className="text-[1.3rem]">{title}</h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-tan-pale hover:text-ink"
              >
                <CloseOutlined />
              </button>
            )}
          </div>
        )}
        <div className="flex flex-col gap-4">
          <SectionLabel>Details</SectionLabel>
          <div className="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
            <label className="flex flex-col gap-2">
              <FieldLabel>Name</FieldLabel>
              <Input name="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>Category</FieldLabel>
              <select
                className="rounded-lg border border-border-strong bg-paper px-3.5 py-2.5 text-[0.92rem] text-ink-soft outline-none focus:border-tan-deep"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
              >
                <option value="men">Men&rsquo;s</option>
                <option value="women">Women&rsquo;s</option>
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-2">
            <FieldLabel>Tagline</FieldLabel>
            <Input name="tagline" required maxLength={300} value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </label>
          <label className="flex flex-col gap-2">
            <FieldLabel>Description</FieldLabel>
            <Input.TextArea name="description" rows={4} defaultValue={product?.description ?? ''} />
          </label>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6">
          <SectionLabel>Pricing &amp; appearance</SectionLabel>
          <div className="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
            <label className="flex flex-col gap-2">
              <FieldLabel>Price (INR)</FieldLabel>
              <InputNumber
                className="w-full"
                name="price"
                min={0}
                step={0.01}
                required
                value={price}
                onChange={(value) => setPrice(Number(value) || 0)}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>Discount (%)</FieldLabel>
              <InputNumber
                className="w-full"
                name="discount_percent"
                min={0}
                max={100}
                step={0.01}
                value={discountPercent}
                onChange={(value) => setDiscountPercent(Number(value) || 0)}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
            <label className="flex flex-col gap-2">
              <FieldLabel>Color name</FieldLabel>
              <Input name="color" required defaultValue={product?.color} />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>Swatch (hex color)</FieldLabel>
              <Input
                name="swatch"
                required
                placeholder="#a9793f"
                value={swatch}
                onChange={(e) => setSwatch(e.target.value)}
                pattern="^#[0-9a-fA-F]{6}$"
                prefix={
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-border-strong"
                    style={{ background: isValidSwatch ? swatch : 'transparent' }}
                    aria-hidden="true"
                  />
                }
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6">
          <SectionLabel>Media</SectionLabel>
          <MediaField
            label="Product image (JPEG/PNG/WebP, up to 5MB)"
            namePrefix="image"
            accept="image/jpeg,image/png,image/webp"
            kind="image"
            currentUrl={product?.image_url}
            onPreviewChange={setImagePreview}
            showOwnPreview={false}
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6">
          <SectionLabel>Visibility</SectionLabel>
          <Checkbox name="is_featured" value="true" defaultChecked={product?.is_featured}>
            Feature on homepage
          </Checkbox>
        </div>

        <div className="flex items-center gap-3 border-t border-border pt-6">
          <SubmitButton pendingText="Saving…">{submitLabel}</SubmitButton>
        </div>
      </form>

      <div className="sticky top-6 flex flex-col gap-3 max-[900px]:static">
        <SectionLabel>Storefront preview</SectionLabel>
        <div className="overflow-hidden rounded-lg border border-border bg-paper">
          <div className="relative aspect-[4/3]">
            <Image
              src={imagePreview || FALLBACK_PRODUCT_IMAGE}
              alt={name || 'Product preview'}
              fill
              sizes="300px"
              className="object-cover"
              unoptimized={Boolean(imagePreview?.startsWith('blob:'))}
            />
            <span className="absolute left-3 top-3 rounded-full bg-[rgba(250,246,240,0.9)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-ink">
              {category === 'men' ? "Men's" : "Women's"}
            </span>
            {discountPercent > 0 && (
              <span className="absolute right-3 top-3 rounded-full bg-[var(--leather)] px-2.5 py-1 text-[0.7rem] font-bold text-cream">
                -{discountPercent}%
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-[1rem] tracking-[-0.01em]">{name || 'Product name'}</h3>
              <div className="flex items-baseline gap-1.5 whitespace-nowrap font-sans font-semibold text-tan-deep">
                {discountPercent > 0 && (
                  <span className="text-[0.75rem] font-medium text-ink-faint line-through">{formatPrice(Number(price))}</span>
                )}
                <span className="text-[0.9rem]">{formatPrice(previewPrice)}</span>
              </div>
            </div>
            <p className="text-[0.85rem] text-ink-faint">{tagline || 'Tagline goes here'}</p>
          </div>
        </div>
        <p className="text-[0.8rem] text-ink-faint">Live preview of how this product looks on the shop grid.</p>
      </div>
    </div>
  )
}

export default ProductForm
