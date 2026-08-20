import { redirect } from 'next/navigation'
import PageHeader from '@/components/admin/PageHeader'
import ProductForm from '@/components/admin/ProductForm'
import { createProduct } from '../actions'

export default function NewProductPage() {
  async function createAndRedirect(formData: FormData) {
    'use server'
    await createProduct(formData)
    redirect('/admin/products')
  }

  return (
    <>
      <PageHeader title="Add product" description="The slug and public URL are generated automatically from the name." />
      <ProductForm action={createAndRedirect} submitLabel="Create product" />
    </>
  )
}
