import { AuthShell } from '@/features/auth/components/auth-shell'
import { RecoverForm } from '@/features/auth/components/recover-form'

interface PageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function RecuperarSenhaPage({ searchParams }: PageProps) {
  const { email } = await searchParams
  return (
    <AuthShell subtitle="Recuperar senha" back={{ href: '/login' }}>
      <RecoverForm defaultEmail={email} />
    </AuthShell>
  )
}
