'use client'

import { Input } from 'antd'
import { login } from '@/app/admin/login/actions'
import SubmitButton from './SubmitButton'

interface LoginFormProps {
  error?: string
  redirectTarget: string
}

function LoginForm({ error, redirectTarget }: LoginFormProps) {
  return (
    <div className="flex w-full max-w-[380px] flex-col gap-4 rounded-xl border border-border bg-paper p-9 shadow-[var(--shadow-lg)]">
      <h1 className="text-[1.6rem]">Plushy Skinn Admin</h1>
      <p className="-mt-1 text-[0.92rem] text-ink-faint">
        Sign in to manage products, gifting enquiries, and site settings.
      </p>
      {error && <p className="form-error">Invalid username or password.</p>}
      <form action={login} className="flex flex-col gap-4">
        <input type="hidden" name="redirect" value={redirectTarget} />
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
  )
}

export default LoginForm
