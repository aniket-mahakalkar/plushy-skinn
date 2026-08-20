'use client'

import { useActionState } from 'react'
import { Input, Button } from 'antd'
import { submitNewsletterSignup } from '@/lib/actions/newsletter'
import { IDLE_FORM_STATE } from '@/lib/types'

function NewsletterForm() {
  const [state, action, pending] = useActionState(submitNewsletterSignup, IDLE_FORM_STATE)

  if (state.status === 'success') {
    return <p className="site-footer__success">{state.message}</p>
  }

  return (
    <form className="site-footer__form" action={action}>
      <input type="text" name="company_website" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <Input type="email" name="email" placeholder="Email address" aria-label="Email address" required />
      <Button type="primary" htmlType="submit" loading={pending}>
        {pending ? 'Joining…' : 'Join'}
      </Button>
      {state.status === 'error' && <p className="site-footer__error">{state.message}</p>}
    </form>
  )
}

export default NewsletterForm
