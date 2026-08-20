'use client'

import type { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from 'antd'

interface SubmitButtonProps {
  children: ReactNode
  pendingText?: string
  danger?: boolean
}

function SubmitButton({ children, pendingText = 'Working…', danger }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="primary" danger={danger} htmlType="submit" loading={pending}>
      {pending ? pendingText : children}
    </Button>
  )
}

export default SubmitButton
