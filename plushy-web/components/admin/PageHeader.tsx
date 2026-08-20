import type { ReactNode } from 'react'

function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[1.7rem]">{title}</h1>
        {description && <p className="mt-1 text-[0.92rem] text-ink-faint">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export default PageHeader
