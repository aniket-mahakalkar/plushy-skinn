import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[]
  rows: T[]
  emptyMessage: string
}

function DataTable<T extends { id: string }>({ columns, rows, emptyMessage }: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border-strong bg-paper px-8 py-14 text-center text-[0.92rem] text-ink-faint">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-paper">
      <table className="w-full min-w-max border-collapse text-[0.88rem]">
        <thead>
          <tr className="border-b border-border bg-tan-pale/40">
            {columns.map((col) => (
              <th
                key={col.header}
                className="whitespace-nowrap px-5 py-3.5 text-left text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-ink-faint"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-none transition-colors hover:bg-tan-pale/15">
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={`px-5 py-4 align-middle text-ink-soft ${col.className === 'wrap' ? 'max-w-[320px] whitespace-normal' : 'whitespace-nowrap'}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
