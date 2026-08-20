import { Input } from 'antd'
import SubmitButton from '@/components/admin/SubmitButton'
import { login } from './actions'

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string; redirect?: string }>
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { error, redirect: redirectTarget } = await searchParams

  return (
    <div className="flex min-h-svh items-center justify-center bg-tan-pale p-6">
      <div className="flex w-full max-w-[380px] flex-col gap-4 rounded-xl border border-border bg-paper p-9 shadow-[var(--shadow-lg)]">
        <h1 className="text-[1.6rem]">Plushy Skinn Admin</h1>
        <p className="-mt-1 text-[0.92rem] text-ink-faint">
          Sign in to manage products, gifting enquiries, and site settings.
        </p>
        {error && <p className="form-error">Invalid username or password.</p>}
        <form action={login} className="flex flex-col gap-4">
          <input type="hidden" name="redirect" value={redirectTarget ?? '/admin'} />
          <label className="flex flex-col gap-2 text-[0.85rem] font-semibold text-ink">
            Username
            <Input name="username" required autoFocus autoComplete="username" />
          </label>
          <label className="flex flex-col gap-2 text-[0.85rem] font-semibold text-ink">
            Password
            <Input.Password name="password" required autoComplete="current-password" />
          </label>
          <SubmitButton pendingText="Signing in…">Sign in</SubmitButton>
        </form>
      </div>
    </div>
  )
}
