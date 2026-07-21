import { TrailFormView } from '@/features/admin/trilhas/trail-form-view'

export default async function TrilhaEditarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <TrailFormView id={id} />
}
