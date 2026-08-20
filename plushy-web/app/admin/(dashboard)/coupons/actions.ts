'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminSession } from '@/lib/auth/session'
import { query } from '@/lib/db'
import { getCouponByIdAdmin } from '@/lib/admin/queries'
import { couponSchema } from '@/lib/validation'

function parseCouponFields(formData: FormData) {
  return couponSchema.parse({
    code: formData.get('code'),
    discount_percent: formData.get('discount_percent'),
    active: formData.get('active') === 'true',
    expires_at: formData.get('expires_at') || undefined,
    usage_limit: formData.get('usage_limit') || undefined,
  })
}

export async function createCoupon(formData: FormData): Promise<void> {
  await requireAdminSession()

  const fields = parseCouponFields(formData)

  await query(
    `insert into coupons (code, discount_percent, active, expires_at, usage_limit)
     values ($1, $2, $3, $4, $5)`,
    [fields.code, fields.discount_percent, fields.active, fields.expires_at || null, fields.usage_limit || null],
  )

  revalidatePath('/admin/coupons')
  redirect('/admin/coupons')
}

export async function updateCoupon(id: string, formData: FormData): Promise<void> {
  await requireAdminSession()

  const existing = await getCouponByIdAdmin(id)
  if (!existing) throw new Error('Coupon not found')

  const fields = parseCouponFields(formData)

  await query(
    `update coupons set
       code = $1, discount_percent = $2, active = $3, expires_at = $4, usage_limit = $5, updated_at = now()
     where id = $6`,
    [fields.code, fields.discount_percent, fields.active, fields.expires_at || null, fields.usage_limit || null, id],
  )

  revalidatePath('/admin/coupons')
  redirect('/admin/coupons')
}

export async function deleteCoupon(id: string): Promise<void> {
  await requireAdminSession()

  await query('delete from coupons where id = $1', [id])

  revalidatePath('/admin/coupons')
}
