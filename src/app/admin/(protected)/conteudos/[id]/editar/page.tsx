import { ContentFormView } from '@/features/admin/conteudos/content-form-view'

export default async function ConteudoEditarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ContentFormView id={id} />
}
