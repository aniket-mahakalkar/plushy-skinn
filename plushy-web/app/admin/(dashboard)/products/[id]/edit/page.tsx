import { notFound, redirect } from 'next/navigation'
import PageHeader from '@/components/admin/PageHeader'
import ProductForm from '@/components/admin/ProductForm'
import { getProductByIdAdmin } from '@/lib/admin/queries'
import { updateProduct } from '../../actions'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const product = await getProductByIdAdmin(id)

  if (!product) notFound()

  async function updateAndRedirect(formData: FormData) {
    'use server'
    await updateProduct(id, formData)
    redirect('/admin/products')
  }

  return (
    <>
      <PageHeader title="Edit product" description={product.name} />
      <ProductForm action={updateAndRedirect} product={product} submitLabel="Save changes" />
    </>
  )
}
