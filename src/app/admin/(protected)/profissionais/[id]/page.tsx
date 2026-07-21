import { ProfissionalDetailView } from '@/features/admin/profissionais/profissional-detail-view'

export default async function ProfissionalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ProfissionalDetailView id={id} />
}
