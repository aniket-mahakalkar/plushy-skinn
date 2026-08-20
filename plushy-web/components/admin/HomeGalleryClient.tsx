'use client'

import { useState, useTransition } from 'react'
import { Button, Modal, Popconfirm, Table, Tag, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import HomeGalleryForm from '@/components/admin/HomeGalleryForm'
import type { HomeGalleryItem } from '@/lib/types'
import {
  createHomeGalleryItem,
  deleteHomeGalleryItem,
  updateHomeGalleryItem,
} from '@/app/admin/(dashboard)/home/actions'

type ModalState = 'closed' | 'create' | HomeGalleryItem

function HomeGalleryClient({ items }: { items: HomeGalleryItem[] }) {
  const [modal, setModal] = useState<ModalState>('closed')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [messageApi, contextHolder] = message.useMessage()

  const close = () => setModal('closed')
  const nextPosition = items.length > 0 ? Math.max(...items.map((i) => i.position)) + 1 : 0

  function handleDelete(id: string) {
    setDeletingId(id)
    startTransition(async () => {
      await deleteHomeGalleryItem(id)
      setDeletingId(null)
      messageApi.success('Gallery card deleted.')
    })
  }

  const columns: ColumnsType<HomeGalleryItem> = [
    { title: 'Position', dataIndex: 'position', key: 'position', width: 90, sorter: (a, b) => a.position - b.position, defaultSortOrder: 'ascend' },
    {
      title: 'Card',
      key: 'card',
      render: (_, item) => (
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md border border-border" style={{ background: item.color }}>
            {item.media_url && item.type === 'image' && (
              // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail, external Supabase Storage URL
              <img src={item.media_url} alt={item.title} className="h-full w-full object-cover" />
            )}
            {item.media_url && item.type === 'video' && (
              <video src={item.media_url} className="h-full w-full object-cover" muted />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-ink">{item.title}</span>
            <span className="text-[0.78rem] text-ink-faint">{item.caption}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: HomeGalleryItem['type']) => <Tag color={type === 'video' ? 'purple' : 'blue'}>{type}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <Button size="small" onClick={() => setModal(item)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this gallery card?"
            description="This can't be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(item.id)}
          >
            <Button size="small" danger loading={pending && deletingId === item.id}>
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
          Add gallery card
        </Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={items} pagination={false} scroll={{ x: 'max-content' }} />

      <Modal
        open={modal !== 'closed'}
        onCancel={close}
        footer={null}
        width="min(640px, 94vw)"
        title={modal === 'closed' ? undefined : modal === 'create' ? 'Add gallery card' : 'Edit gallery card'}
        destroyOnClose
      >
        {modal !== 'closed' && (
          <HomeGalleryForm
            key={modal === 'create' ? 'create' : modal.id}
            action={async (formData) => {
              if (modal === 'create') {
                await createHomeGalleryItem(formData)
              } else {
                await updateHomeGalleryItem(modal.id, formData)
              }
              close()
              messageApi.success(modal === 'create' ? 'Gallery card added.' : 'Gallery card updated.')
            }}
            item={modal === 'create' ? undefined : modal}
            submitLabel={modal === 'create' ? 'Add card' : 'Save changes'}
            nextPosition={nextPosition}
          />
        )}
      </Modal>
    </>
  )
}

export default HomeGalleryClient
