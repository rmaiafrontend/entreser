import { ConteudoReaderView } from '@/features/usuaria/conteudos/conteudo-reader-view'

/** Leitor de conteúdo (UF6). Delegador fino — a lógica vive na view do slice. */
export default async function ConteudoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // key={id} garante remonta (estado/loading limpos) ao trocar de conteúdo.
  return <ConteudoReaderView key={id} id={id} />
}
