'use client'

import { useActionState } from 'react'
import { Input, Button } from 'antd'
import { submitGiftingEnquiry } from '@/app/(site)/corporate-gifting/actions'
import { IDLE_FORM_STATE } from '@/lib/types'

const useCases = [
  'New hire welcome kits',
  'Client appreciation',
  'Milestones & anniversaries',
  'Holiday gifting',
  'Conference & event swag',
]

function GiftingEnquiryForm() {
  const [state, action, pending] = useActionState(submitGiftingEnquiry, IDLE_FORM_STATE)

  if (state.status === 'success') {
    return <div className="form-success">{state.message}</div>
  }

  return (
    <form className="enquiry__form form-grid" action={action}>
      <input type="text" name="company_website" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="enquiry__row">
        <label>
          Company name
          <Input name="company" required />
        </label>
        <label>
          Work email
          <Input type="email" name="email" required />
        </label>
      </div>
      <div className="enquiry__row">
        <label>
          Estimated quantity
          <select name="quantity" defaultValue="20-50">
            <option value="20-50">20 &ndash; 50</option>
            <option value="50-150">50 &ndash; 150</option>
            <option value="150-500">150 &ndash; 500</option>
            <option value="500+">500+</option>
          </select>
        </label>
        <label>
          Occasion
          <select name="occasion" defaultValue="Client appreciation">
            {useCases.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Details
        <Input.TextArea name="details" rows={4} placeholder="Branding needs, timeline, ship-to locations..." />
      </label>
      {state.status === 'error' && <p className="form-error">{state.message}</p>}
      <Button type="primary" htmlType="submit" loading={pending} className="w-fit">
        {pending ? 'Submitting…' : 'Submit enquiry'}
      </Button>
    </form>
  )
}

export default GiftingEnquiryForm
