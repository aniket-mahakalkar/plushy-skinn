import CouponForm from '@/components/admin/CouponForm'
import PageHeader from '@/components/admin/PageHeader'
import { createCoupon } from '../actions'

export default function NewCouponPage() {
  return (
    <>
      <PageHeader title="Add coupon" description="Codes are stored and matched in uppercase." />
      <CouponForm action={createCoupon} submitLabel="Create coupon" />
    </>
  )
}
