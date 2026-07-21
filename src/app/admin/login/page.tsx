import { AdminAuthShell } from '@/features/admin/components/admin-auth-shell'
import { AdminLoginForm } from '@/features/admin/components/admin-login-form'

export default function AdminLoginPage() {
  return (
    <AdminAuthShell
      title="Acessar o backoffice"
      subtitle="Área restrita à equipe Entre Ser."
    >
      <AdminLoginForm />
    </AdminAuthShell>
  )
}
