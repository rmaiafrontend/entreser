import Link from 'next/link'
import { AdminAuthShell } from '@/features/admin/components/admin-auth-shell'
import { AdminRecoverForm } from '@/features/admin/components/admin-recover-form'

interface PageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function AdminRecuperarSenhaPage({ searchParams }: PageProps) {
  const { email } = await searchParams
  return (
    <AdminAuthShell
      title="Recuperar senha"
      footer={
        <Link href="/admin/login" className="text-mauve hover:text-mauve-dark">
          Voltar para o login
        </Link>
      }
    >
      <AdminRecoverForm defaultEmail={email} />
    </AdminAuthShell>
  )
}
