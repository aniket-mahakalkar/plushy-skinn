import { notFound } from 'next/navigation'
import Badge from '@/components/admin/Badge'
import PageHeader from '@/components/admin/PageHeader'
import { getOrderByIdAdmin } from '@/lib/admin/queries'
import { formatPrice } from '@/lib/format'
import { cancelOrder } from '../actions'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const order = await getOrderByIdAdmin(id)

  if (!order) notFound()

  return (
    <>
      <PageHeader
        title={`Order ${order.id.slice(0, 8)}`}
        description={`Placed ${new Date(order.created_at).toLocaleString()}`}
        action={
          order.status === 'paid' && (
            <form action={cancelOrder.bind(null, order.id)}>
              <button type="submit" className="btn btn-danger">
                Cancel order
              </button>
            </form>
          )
        }
      />

      <div className="flex max-w-[720px] flex-col gap-7 rounded-xl border border-border bg-paper p-7">
        <div className="grid grid-cols-2 gap-6 max-[560px]:grid-cols-1">
          <div className="flex flex-col gap-1">
            <strong className="text-[0.8rem] uppercase tracking-[0.04em] text-ink-faint">Customer</strong>
            <p className="text-ink">{order.customer_name}</p>
            <p className="text-ink-soft">{order.customer_email}</p>
            {order.customer_phone && <p className="text-ink-soft">{order.customer_phone}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <strong className="text-[0.8rem] uppercase tracking-[0.04em] text-ink-faint">Shipping address</strong>
            <p className="whitespace-pre-wrap text-ink-soft">{order.shipping_address}</p>
          </div>
        </div>

        <div>
          <strong className="text-[0.8rem] uppercase tracking-[0.04em] text-ink-faint">Items</strong>
          <div className="mt-3 overflow-hidden rounded-lg border border-border">
            <table className="w-full border-collapse text-[0.9rem]">
              <thead>
                <tr className="border-b border-border bg-tan-pale/40 text-left">
                  <th className="px-4 py-2.5 font-semibold text-ink-faint">Product</th>
                  <th className="px-4 py-2.5 font-semibold text-ink-faint">Unit price</th>
                  <th className="px-4 py-2.5 font-semibold text-ink-faint">Qty</th>
                  <th className="px-4 py-2.5 font-semibold text-ink-faint">Line total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.productId} className="border-b border-border last:border-none">
                    <td className="px-4 py-2.5 text-ink">{item.name}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{formatPrice(item.unitPrice)}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{item.quantity}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{formatPrice(item.unitPrice * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-border pt-5 max-[560px]:grid-cols-1">
          <div>
            <strong className="text-[0.8rem] uppercase tracking-[0.04em] text-ink-faint">Subtotal</strong>
            <p className="text-ink">{formatPrice(order.subtotal)}</p>
          </div>
          <div>
            <strong className="text-[0.8rem] uppercase tracking-[0.04em] text-ink-faint">
              Discount{order.coupon_code ? ` (${order.coupon_code})` : ''}
            </strong>
            <p className="text-ink">-{formatPrice(order.discount_amount)}</p>
          </div>
        </div>

        <div>
          <strong className="text-[0.8rem] uppercase tracking-[0.04em] text-ink-faint">Total</strong>
          <p className="font-serif text-[1.4rem] text-ink">{formatPrice(order.total)}</p>
        </div>

        <p className="flex items-center gap-2.5 text-[0.85rem] text-ink-faint">
          Payment: {order.payment_method} (placeholder — no gateway connected).
          {order.status === 'paid' ? <Badge tone="success">Paid</Badge> : <Badge tone="muted">Cancelled</Badge>}
        </p>
      </div>
    </>
  )
}
