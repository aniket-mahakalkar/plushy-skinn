export const DEFAULT_PAGE_SIZE = 20

export interface PaginatedResult<T> {
  rows: T[]
  total: number
  page: number
  pageSize: number
}

export function parsePageParam(value: string | undefined): number {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : 1
}
