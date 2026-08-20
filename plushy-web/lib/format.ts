const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

/** Formats a number as Indian Rupees with Indian digit grouping, e.g. ₹1,00,000.00 */
export function formatPrice(amount: number): string {
  return inrFormatter.format(amount)
}
