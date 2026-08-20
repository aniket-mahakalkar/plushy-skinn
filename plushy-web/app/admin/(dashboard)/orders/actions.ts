'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/auth/session'
import { query } from '@/lib/db'

export async function cancelOrder(id: string): Promise<void> {
  await requireAdminSession()

  await query("update orders set status = 'cancelled' where id = $1", [id])

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
}
