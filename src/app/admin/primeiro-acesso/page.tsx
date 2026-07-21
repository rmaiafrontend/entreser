import { AdminAuthShell } from '@/features/admin/components/admin-auth-shell'
import { AdminFirstAccessForm } from '@/features/admin/components/admin-first-access-form'

export default function AdminPrimeiroAcessoPage() {
  return (
    <AdminAuthShell
      title="Definir senha"
      subtitle="Crie sua senha de acesso ao backoffice."
    >
      <AdminFirstAccessForm />
    </AdminAuthShell>
  )
}
