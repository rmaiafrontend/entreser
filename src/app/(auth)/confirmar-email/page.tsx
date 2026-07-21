import { AuthShell } from '@/features/auth/components/auth-shell'
import { ConfirmEmailView } from '@/features/auth/components/confirm-email-view'

interface PageProps {
  searchParams: Promise<{ token?: string; email?: string; devToken?: string }>
}

export default async function ConfirmarEmailPage({ searchParams }: PageProps) {
  const { token, email, devToken } = await searchParams
  return (
    <AuthShell back={{ href: '/login' }}>
      <ConfirmEmailView token={token} email={email} devToken={devToken} />
    </AuthShell>
  )
}
