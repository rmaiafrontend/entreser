import type { Formato } from '@/features/admin/conteudos/types'

/** Item do feed personalizado (UF2). Enxuto — o corpo/mídia só no leitor. */
export interface FeedItem {
  id: string
  titulo: string
  formato: Formato
  duracaoMinutos: number | null
  thumbUrl: string | null
  /** Nomes de tags (para exibição). */
  tags: string[]
  consumido: boolean
  /** Quando o conteúdo pertence a uma trilha em andamento. */
  emTrilha?: { id: string; titulo: string } | null
}

export interface FeedFase {
  id: string
  nome: string
}

export interface FeedPage {
  fase: FeedFase | null
  itens: FeedItem[]
  /** Página atual (0-based). */
  pagina: number
  tamanho: number
  total: number
  temMais: boolean
}

export interface FeedParams {
  /** 0-based. @default 0 */
  pagina?: number
  /** @default 20 */
  tamanho?: number
  /** Filtro opcional por tag (id). */
  tag?: string
}
