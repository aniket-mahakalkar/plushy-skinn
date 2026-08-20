import type { ReactNode } from 'react'

const TONES = {
  success: 'bg-[var(--success-bg)] text-[var(--success-text)]',
  neutral: 'bg-border text-ink-soft',
  muted: 'bg-tan-pale text-tan-deep',
  danger: 'bg-[var(--danger-bg)] text-[var(--danger-text)]',
} as const

function Badge({ tone, children }: { tone: keyof typeof TONES; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.04em] ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}

export default Badge
