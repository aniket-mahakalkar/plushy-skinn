import ContactInfoForm from '@/components/admin/ContactInfoForm'
import PageHeader from '@/components/admin/PageHeader'
import { getContactInfo } from '@/lib/contactInfo'
import { updateContactInfo } from './actions'

export default async function AdminContactInfoPage() {
  const info = await getContactInfo()

  return (
    <>
      <PageHeader title="Contact info" description="Shown on the public Contact page, including the location map." />
      <ContactInfoForm action={updateContactInfo} info={info} />
    </>
  )
}
