import LoginForm from '@/components/admin/LoginForm'

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string; redirect?: string }>
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { error, redirect: redirectTarget } = await searchParams

  return (
    <div className="flex min-h-svh items-center justify-center bg-tan-pale p-6">
      <LoginForm error={error} redirectTarget={redirectTarget ?? '/admin'} />
    </div>
  )
}
