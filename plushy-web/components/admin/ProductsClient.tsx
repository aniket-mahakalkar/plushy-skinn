'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button, Modal, Popconfirm, Table, Tag, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import ProductForm from '@/components/admin/ProductForm'
import { FALLBACK_PRODUCT_IMAGE } from '@/lib/products'
import { discountedPrice, type Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { createProduct, deleteProduct, updateProduct } from '@/app/admin/(dashboard)/products/actions'

type ModalState = 'closed' | 'create' | Product

interface ProductsClientProps {
  products: Product[]
  total: number
  page: number
  pageSize: number
}

function ProductsClient({ products, total, page, pageSize }: ProductsClientProps) {
  const router = useRouter()
  const [modal, setModal] = useState<ModalState>('closed')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [messageApi, contextHolder] = message.useMessage()

  const close = () => setModal('closed')

  function handleDelete(id: string) {
    setDeletingId(id)
    startTransition(async () => {
      await deleteProduct(id)
      setDeletingId(null)
      messageApi.success('Product deleted.')
    })
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, p) => (
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-border">
            <Image src={p.image_url ?? FALLBACK_PRODUCT_IMAGE} alt={p.name} fill sizes="44px" className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-ink">{p.name}</span>
            <span className="flex items-center gap-1.5 text-[0.78rem] text-ink-faint">
              <span className="h-2.5 w-2.5 rounded-full border border-[rgba(19,19,16,0.12)]" style={{ background: p.swatch }} />
              {p.color}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: "Men's", value: 'men' },
        { text: "Women's", value: 'women' },
      ],
      onFilter: (value, p) => p.category === value,
      render: (category: Product['category']) => (
        <Tag color={category === 'men' ? 'default' : 'gold'}>{category === 'men' ? "Men's" : "Women's"}</Tag>
      ),
    },
    {
      title: 'Price',
      key: 'price',
      sorter: (a, b) => discountedPrice(a) - discountedPrice(b),
      render: (_, p) =>
        p.discount_percent > 0 ? (
          <span className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="text-ink-faint line-through">{formatPrice(p.price)}</span>
            <span className="font-medium text-tan-deep">{formatPrice(discountedPrice(p))}</span>
            <span className="text-[0.75rem] font-semibold text-[var(--leather)]">-{p.discount_percent}%</span>
          </span>
        ) : (
          formatPrice(p.price)
        ),
    },
    {
      title: 'Featured',
      dataIndex: 'is_featured',
      key: 'is_featured',
      render: (isFeatured: boolean) => (isFeatured ? <Tag color="green">Featured</Tag> : <span className="text-ink-faint">—</span>),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, p) => (
        <div className="flex items-center gap-2">
          <Button size="small" onClick={() => setModal(p)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this product?"
            description="This can't be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(p.id)}
          >
            <Button size="small" danger loading={pending && deletingId === p.id}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <>
      {contextHolder}
      <div className="mb-5 flex justify-end">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal('create')}>
          Add product
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: page,
          pageSize,
          total,
          hideOnSinglePage: true,
          onChange: (nextPage) => router.push(nextPage <= 1 ? '/admin/products' : `/admin/products?page=${nextPage}`),
        }}
      />

      <Modal
        open={modal !== 'closed'}
        onCancel={close}
        footer={null}
        width="min(980px, 94vw)"
        closable={false}
        destroyOnClose
      >
        {modal !== 'closed' && (
          <ProductForm
            key={modal === 'create' ? 'create' : modal.id}
            action={async (formData) => {
              if (modal === 'create') {
                await createProduct(formData)
              } else {
                await updateProduct(modal.id, formData)
              }
              close()
              messageApi.success(modal === 'create' ? 'Product created.' : 'Product updated.')
            }}
            product={modal === 'create' ? undefined : modal}
            submitLabel={modal === 'create' ? 'Create product' : 'Save changes'}
            title={modal === 'create' ? 'Add product' : 'Edit product'}
            onClose={close}
          />
        )}
      </Modal>
    </>
  )
}

export default ProductsClient
