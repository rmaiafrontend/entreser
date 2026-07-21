import { OpcoesView } from '@/features/admin/onboarding/opcoes-view'

export default async function OnboardingOpcoesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <OpcoesView perguntaId={id} />
}
