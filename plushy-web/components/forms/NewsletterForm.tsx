'use client'

import { useActionState } from 'react'
import { Input, Button } from 'antd'
import { submitNewsletterSignup } from '@/lib/actions/newsletter'
import { IDLE_FORM_STATE } from '@/lib/types'

function NewsletterForm() {
  const [state, action, pending] = useActionState(submitNewsletterSignup, IDLE_FORM_STATE)

  if (state.status === 'success') {
    return <p className="mt-1 text-[0.9rem] text-tan">{state.message}</p>
  }

  return (
    <form className="mt-1 flex flex-wrap gap-2" action={action}>
      <input type="text" name="company_website" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <Input type="email" name="email" placeholder="Email address" aria-label="Email address" required className="min-w-0 flex-1" />
      <Button type="primary" htmlType="submit" loading={pending}>
        {pending ? 'Joining…' : 'Join'}
      </Button>
      {state.status === 'error' && <p className="basis-full text-[0.82rem] text-[#e3a6a6]">{state.message}</p>}
    </form>
  )
}

export default NewsletterForm
