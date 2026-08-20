'use client'

import { useActionState } from 'react'
import { Input, Button } from 'antd'
import { submitContactMessage } from '@/app/(site)/contact/actions'
import { IDLE_FORM_STATE } from '@/lib/types'

const subjects = ['Order enquiry', 'Product question', 'Wholesale / corporate gifting', 'Something else']

function ContactForm() {
  const [state, action, pending] = useActionState(submitContactMessage, IDLE_FORM_STATE)

  if (state.status === 'success') {
    return <div className="form-success">{state.message}</div>
  }

  return (
    <form className="contact__form flex flex-col gap-5" action={action}>
      <input type="text" name="company_website" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="flex flex-col gap-2">
        <span className="text-[0.85rem] font-semibold text-ink">Name</span>
        <Input name="name" required />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[0.85rem] font-semibold text-ink">Email</span>
        <Input type="email" name="email" required />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[0.85rem] font-semibold text-ink">Subject</span>
        <select
          name="subject"
          defaultValue={subjects[0]}
          className="rounded-[3px] border border-border-strong bg-paper px-3.5 py-3 text-[0.95rem] text-ink-soft focus:outline-2 focus:outline-tan-deep"
        >
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[0.85rem] font-semibold text-ink">Message</span>
        <Input.TextArea name="message" rows={5} required />
      </label>
      {state.status === 'error' && <p className="form-error">{state.message}</p>}
      <Button type="primary" htmlType="submit" loading={pending} className="w-fit">
        {pending ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}

export default ContactForm
