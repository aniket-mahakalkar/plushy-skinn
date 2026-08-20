import { notFound } from 'next/navigation'
import CouponForm from '@/components/admin/CouponForm'
import PageHeader from '@/components/admin/PageHeader'
import { getCouponByIdAdmin } from '@/lib/admin/queries'
import { updateCoupon } from '../../actions'

interface EditCouponPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCouponPage({ params }: EditCouponPageProps) {
  const { id } = await params
  const coupon = await getCouponByIdAdmin(id)

  if (!coupon) notFound()

  const updateCouponWithId = updateCoupon.bind(null, id)

  return (
    <>
      <PageHeader title="Edit coupon" description={coupon.code} />
      <CouponForm action={updateCouponWithId} coupon={coupon} submitLabel="Save changes" />
    </>
  )
}
