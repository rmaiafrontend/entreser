import Link from 'next/link'
import { AuthShell } from '@/features/auth/components/auth-shell'
import { LoginForm } from '@/features/auth/components/login-form'

export default function LoginPage() {
  return (
    <AuthShell
      subtitle="Bem-vinda de volta"
      topRight={{ href: '/cadastro', label: 'Criar conta' }}
      footer={
        <>
          Não tem conta?{' '}
          <Link
            href="/cadastro"
            className="font-medium text-cream/60 transition-colors hover:text-cream"
          >
            Criar conta
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  )
}
