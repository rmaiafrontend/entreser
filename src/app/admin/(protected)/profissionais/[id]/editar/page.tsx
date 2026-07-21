import { ProfissionalEditView } from '@/features/admin/profissionais/profissional-edit-view'

export default async function ProfissionalEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ProfissionalEditView id={id} />
}
