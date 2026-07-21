import { AdminAuthShell } from '@/features/admin/components/admin-auth-shell'
import { AdminResetForm } from '@/features/admin/components/admin-reset-form'

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function AdminRedefinirSenhaPage({ searchParams }: PageProps) {
  const { token } = await searchParams
  return (
    <AdminAuthShell title="Criar nova senha">
      <AdminResetForm token={token} />
    </AdminAuthShell>
  )
}
