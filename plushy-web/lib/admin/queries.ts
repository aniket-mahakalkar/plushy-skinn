import 'server-only'
import { query, queryOne } from '../db'
import type { ContactMessage, Coupon, GiftingEnquiry, HomeGalleryItem, NewsletterSubscriber, Order, Product } from '../types'
import { DEFAULT_PAGE_SIZE, type PaginatedResult } from './pagination'

/** Runs `select ..., count(*) over() as full_count from <table> order by ... limit/offset`
 * so the total row count comes back in the same round trip as the page of rows. */
async function paginated<T>(selectAndOrder: string, page: number, pageSize: number): Promise<PaginatedResult<T>> {
  const rows = await query<{ full_count: string } & Record<string, unknown>>(`${selectAndOrder} limit $1 offset $2`, [
    pageSize,
    (page - 1) * pageSize,
  ])
  const total = rows.length > 0 ? Number(rows[0].full_count) : 0
  return {
    rows: rows.map(({ full_count, ...rest }) => {
      void full_count
      return rest as unknown as T
    }),
    total,
    page,
    pageSize,
  }
}

export async function listProductsAdmin(page = 1, pageSize = DEFAULT_PAGE_SIZE): Promise<PaginatedResult<Product>> {
  return paginated<Product>('select *, count(*) over() as full_count from products order by created_at desc', page, pageSize)
}

export async function getProductByIdAdmin(id: string): Promise<Product | null> {
  return queryOne<Product>('select * from products where id = $1', [id])
}

export async function listGiftingEnquiriesAdmin(
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedResult<GiftingEnquiry>> {
  return paginated<GiftingEnquiry>(
    'select *, count(*) over() as full_count from gifting_enquiries order by created_at desc',
    page,
    pageSize,
  )
}

export async function listContactMessagesAdmin(
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedResult<ContactMessage>> {
  return paginated<ContactMessage>(
    'select *, count(*) over() as full_count from contact_messages order by created_at desc',
    page,
    pageSize,
  )
}

export async function listNewsletterSubscribersAdmin(
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedResult<NewsletterSubscriber>> {
  return paginated<NewsletterSubscriber>(
    'select *, count(*) over() as full_count from newsletter_subscribers order by created_at desc',
    page,
    pageSize,
  )
}

export async function listCouponsAdmin(page = 1, pageSize = DEFAULT_PAGE_SIZE): Promise<PaginatedResult<Coupon>> {
  return paginated<Coupon>('select *, count(*) over() as full_count from coupons order by created_at desc', page, pageSize)
}

export async function getCouponByIdAdmin(id: string): Promise<Coupon | null> {
  return queryOne<Coupon>('select * from coupons where id = $1', [id])
}

export async function listOrdersAdmin(page = 1, pageSize = DEFAULT_PAGE_SIZE): Promise<PaginatedResult<Order>> {
  return paginated<Order>('select *, count(*) over() as full_count from orders order by created_at desc', page, pageSize)
}

export async function getOrderByIdAdmin(id: string): Promise<Order | null> {
  return queryOne<Order>('select * from orders where id = $1', [id])
}

export async function listHomeGalleryAdmin(): Promise<HomeGalleryItem[]> {
  // Small, curated set (a handful of homepage cards) — not worth paginating.
  return query<HomeGalleryItem>('select * from home_gallery order by position asc')
}

export async function getHomeGalleryItemByIdAdmin(id: string): Promise<HomeGalleryItem | null> {
  return queryOne<HomeGalleryItem>('select * from home_gallery where id = $1', [id])
}

export interface DashboardCounts {
  products: number
  newEnquiries: number
  newMessages: number
  subscribers: number
  orders: number
}

export async function getDashboardCounts(): Promise<DashboardCounts> {
  const [products, newEnquiries, newMessages, subscribers, orders] = await Promise.all([
    queryOne<{ count: string }>('select count(*) from products'),
    queryOne<{ count: string }>("select count(*) from gifting_enquiries where status = 'new'"),
    queryOne<{ count: string }>("select count(*) from contact_messages where status = 'new'"),
    queryOne<{ count: string }>('select count(*) from newsletter_subscribers'),
    queryOne<{ count: string }>('select count(*) from orders'),
  ])
  return {
    products: Number(products?.count ?? 0),
    newEnquiries: Number(newEnquiries?.count ?? 0),
    newMessages: Number(newMessages?.count ?? 0),
    subscribers: Number(subscribers?.count ?? 0),
    orders: Number(orders?.count ?? 0),
  }
}
