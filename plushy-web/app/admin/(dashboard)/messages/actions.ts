'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/auth/session'
import { query } from '@/lib/db'
import type { SubmissionStatus } from '@/lib/types'

export async function markMessageStatus(id: string, status: SubmissionStatus): Promise<void> {
  await requireAdminSession()
  await query('update contact_messages set status = $1 where id = $2', [status, id])
  revalidatePath('/admin/messages')
  revalidatePath('/admin')
}
