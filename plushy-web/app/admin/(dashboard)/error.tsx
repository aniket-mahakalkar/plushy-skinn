'use client'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[1.7rem]">Something went wrong</h1>
        <p className="mt-1 text-[0.92rem] text-ink-faint">{error.message || 'An unexpected error occurred.'}</p>
      </div>
      <button type="button" className="btn btn-outline" onClick={reset}>
        Try again
      </button>
    </div>
  )
}
