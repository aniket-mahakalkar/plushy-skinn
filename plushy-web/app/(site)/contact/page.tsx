import ContactForm from '@/components/forms/ContactForm'
import { getContactInfo } from '@/lib/contactInfo'
import './contact.css'

const FALLBACK_MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119080.23492427499!2d79.00126571840025!3d21.142154680261523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf13%3A0x19b37d06d0bb3e2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1787215603348!5m2!1sen!2sin'

export default async function ContactPage() {
  const contact = await getContactInfo()

  const info = [
    { label: 'Email', value: contact.email ?? 'hello@plushyskin.com' },
    { label: 'Support', value: contact.supportEmail ?? 'support@plushyskin.com' },
    ...(contact.phone ? [{ label: 'Phone', value: contact.phone }] : []),
    { label: 'Studio', value: contact.address ?? 'Nagpur, Maharashtra, India' },
    { label: 'Hours', value: contact.hours ?? 'Mon – Fri, 9am – 6pm IST' },
  ]

  const mapEmbedUrl = contact.mapEmbedUrl || FALLBACK_MAP_EMBED_URL

  return (
    <section className="contact">
      <div className="container contact__grid">
        <div className="contact__info">
          <span className="eyebrow">Contact</span>
          <h1>We&rsquo;d love to hear from you</h1>
          <p>Questions about an order, materials, or a wholesale enquiry? Send us a note.</p>

          <dl className="contact__list">
            {info.map((i) => (
              <div key={i.label} className="contact__list-item">
                <dt>{i.label}</dt>
                <dd>{i.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-2 overflow-hidden rounded-[10px] border border-border">
            <iframe
              title="Our location"
              src={mapEmbedUrl}
              className="h-[220px] w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>

        <div className="contact__form-wrap">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
