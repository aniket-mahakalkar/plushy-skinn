import ProductsClient from '@/components/admin/ProductsClient'
import PageHeader from '@/components/admin/PageHeader'
import { listProductsAdmin } from '@/lib/admin/queries'
import { parsePageParam } from '@/lib/admin/pagination'

interface AdminProductsPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const page = parsePageParam((await searchParams).page)
  const { rows: products, total, pageSize } = await listProductsAdmin(page)

  return (
    <>
      <PageHeader title="Products" description={`${total} product${total === 1 ? '' : 's'} in the catalog.`} />
      <ProductsClient products={products} total={total} page={page} pageSize={pageSize} />
    </>
  )
}
