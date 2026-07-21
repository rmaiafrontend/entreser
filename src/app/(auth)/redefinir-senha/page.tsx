import { AuthShell } from '@/features/auth/components/auth-shell'
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form'

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function RedefinirSenhaPage({ searchParams }: PageProps) {
  const { token } = await searchParams
  return (
    <AuthShell subtitle="Criar nova senha" back={{ href: '/login' }}>
      <ResetPasswordForm token={token} />
    </AuthShell>
  )
}
