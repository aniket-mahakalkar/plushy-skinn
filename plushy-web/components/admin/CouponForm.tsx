'use client'

import { Input, InputNumber, Checkbox } from 'antd'
import type { Coupon } from '@/lib/types'
import SubmitButton from './SubmitButton'

interface CouponFormProps {
  action: (formData: FormData) => void | Promise<void>
  coupon?: Coupon
  submitLabel: string
}

function toDateInputValue(iso: string | null): string {
  if (!iso) return ''
  return iso.slice(0, 10)
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-[0.85rem] font-semibold text-ink">{children}</span>
}

function CouponForm({ action, coupon, submitLabel }: CouponFormProps) {
  return (
    <form className="flex max-w-[560px] flex-col gap-5 rounded-xl border border-border bg-paper p-7" action={action}>
      <div className="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
        <label className="flex flex-col gap-2">
          <FieldLabel>Code</FieldLabel>
          <Input className="uppercase" name="code" required maxLength={40} placeholder="WELCOME10" defaultValue={coupon?.code} />
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel>Discount (%)</FieldLabel>
          <InputNumber className="w-full" name="discount_percent" min={1} max={100} step={0.01} required defaultValue={coupon?.discount_percent} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
        <label className="flex flex-col gap-2">
          <FieldLabel>Expires on (optional)</FieldLabel>
          <input
            className="rounded-lg border border-border-strong bg-paper px-3.5 py-2.5 text-[0.92rem] text-ink-soft outline-none focus:border-tan-deep"
            type="date"
            name="expires_at"
            defaultValue={toDateInputValue(coupon?.expires_at ?? null)}
          />
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel>Usage limit (optional)</FieldLabel>
          <InputNumber className="w-full" name="usage_limit" min={1} step={1} defaultValue={coupon?.usage_limit ?? undefined} />
        </label>
      </div>

      <Checkbox name="active" value="true" defaultChecked={coupon?.active ?? true}>
        Active
      </Checkbox>

      {coupon && (
        <p className="text-[0.85rem] text-ink-faint">
          Used {coupon.times_used} time{coupon.times_used === 1 ? '' : 's'} so far.
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton pendingText="Saving…">{submitLabel}</SubmitButton>
      </div>
    </form>
  )
}

export default CouponForm
