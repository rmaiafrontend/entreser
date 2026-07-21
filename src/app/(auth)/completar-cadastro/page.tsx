import { AuthShell } from '@/features/auth/components/auth-shell'
import { CompleteGoogleForm } from '@/features/auth/components/complete-google-form'

export default function CompletarCadastroPage() {
  return (
    <AuthShell subtitle="Quase lá">
      <CompleteGoogleForm />
    </AuthShell>
  )
}
