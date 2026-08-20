import Link from 'next/link'
import LeatherPanel from '@/components/site/LeatherPanel'
import GiftingEnquiryForm from '@/components/forms/GiftingEnquiryForm'
import './corporate-gifting.css'

const perks = [
  {
    title: 'Custom branding',
    text: 'Debossed initials, logos, or a custom colour run for your team or clients.',
  },
  {
    title: 'Volume pricing',
    text: 'Tiered discounts starting at 20 units, with dedicated account support.',
  },
  {
    title: 'Gift-ready packaging',
    text: 'Branded boxes, notecards, and consolidated shipping to one or many addresses.',
  },
  {
    title: 'Fast turnaround',
    text: 'Standard orders ship within 10 business days; rush options available.',
  },
]

const useCases = ['New hire welcome kits', 'Client appreciation', 'Milestones & anniversaries', 'Holiday gifting', 'Conference & event swag']

export default function CorporateGiftingPage() {
  return (
    <>
      <section className="gifting-hero">
        <div className="container gifting-hero__grid">
          <div>
            <span className="eyebrow">Corporate gifting</span>
            <h1>Thoughtful wallets, gifted at scale.</h1>
            <p>
              Outfit your team or delight your clients with vegan-leather wallets,
              customised with your branding and shipped wherever they need to go.
            </p>
            <Link href="#enquiry" className="btn btn-primary">Start an enquiry</Link>
          </div>
          <div className="gifting-hero__visual">
            <LeatherPanel color="#1c1712" monogram="B2B" stitch={false} />
          </div>
        </div>
      </section>

      <section className="perks">
        <div className="container perks__grid">
          {perks.map((p) => (
            <div key={p.title} className="perks__item">
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="use-cases">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Popular occasions</span>
            <h2>Where teams gift Plushy Skinn</h2>
          </div>
          <ul className="use-cases__list">
            {useCases.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="enquiry" id="enquiry">
        <div className="container enquiry__box">
          <div className="section-head">
            <span className="eyebrow">Get a quote</span>
            <h2>Tell us about your order</h2>
            <p>Share a few details and our gifting team will follow up within one business day.</p>
          </div>
          <GiftingEnquiryForm />
        </div>
      </section>
    </>
  )
}
