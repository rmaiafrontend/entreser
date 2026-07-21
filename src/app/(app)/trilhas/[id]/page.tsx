import { TrilhaDetailView } from '@/features/usuaria/trilhas/trilha-detail-view'

/** Detalhe de uma trilha (UF5). */
export default async function TrilhaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // key={id} garante remonta (estado/loading limpos) ao trocar de trilha.
  return <TrilhaDetailView key={id} id={id} />
}
