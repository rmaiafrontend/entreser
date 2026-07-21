import { AuthShell } from '@/features/auth/components/auth-shell'
import { SignupForm } from '@/features/auth/components/signup-form'

export default function CadastroPage() {
  return (
    <AuthShell
      subtitle="Comece sua jornada de acolhimento"
      back={{ href: '/login' }}
      topRight={{ href: '/login', label: 'Já tenho conta' }}
    >
      <SignupForm />
    </AuthShell>
  )
}
