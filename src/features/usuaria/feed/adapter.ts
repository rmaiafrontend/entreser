import { formatoFromApi } from '@/features/admin/conteudos/adapter'
import type { FeedFase, FeedItem, FeedPage } from './types'

/** Tag no feed: a spec devolve string (nome); toleramos objeto {nome}. */
type TagApi = string | { id?: string; nome?: string }

interface FeedItemApi {
  id: string
  titulo: string
  formato: string
  duracaoMinutos?: number | null
  thumbUrl?: string | null
  tags?: TagApi[] | null
  consumido?: boolean
  emTrilha?: { id: string; titulo: string } | null
}

/**
 * Resposta do `/feed`. Aceita DUAS formas (confirmar ao vivo antes de fixar):
 * a da spec `{ fase, conteudos, paginacao }` e o `Page<T>` do Spring `{ content,
 * number, size, totalElements, last }`.
 */
export interface FeedResponseApi {
  fase?: { id: string; nome: string } | null
  conteudos?: FeedItemApi[] | null
  paginacao?: { pagina?: number; tamanho?: number; total?: number } | null
  content?: FeedItemApi[] | null
  number?: number
  size?: number
  totalElements?: number
  last?: boolean
}

function tagName(t: TagApi): string {
  return typeof t === 'string' ? t : t.nome ?? t.id ?? ''
}

export function feedItemFromApi(c: FeedItemApi): FeedItem {
  return {
    id: c.id,
    titulo: c.titulo,
    formato: formatoFromApi(c.formato),
    duracaoMinutos: c.duracaoMinutos ?? null,
    thumbUrl: c.thumbUrl ?? null,
    tags: (c.tags ?? []).map(tagName).filter(Boolean),
    consumido: Boolean(c.consumido),
    emTrilha: c.emTrilha ?? null,
  }
}

function faseFromApi(f: { id: string; nome: string } | null | undefined): FeedFase | null {
  return f ? { id: f.id, nome: f.nome } : null
}

export function feedFromApi(raw: FeedResponseApi): FeedPage {
  // Forma da spec: { fase, conteudos, paginacao }
  if (Array.isArray(raw.conteudos)) {
    const itens = raw.conteudos.map(feedItemFromApi)
    const pag = raw.paginacao ?? {}
    const pagina = pag.pagina ?? 0
    const tamanho = pag.tamanho ?? itens.length
    const total = pag.total ?? itens.length
    return { fase: faseFromApi(raw.fase), itens, pagina, tamanho, total, temMais: (pagina + 1) * tamanho < total }
  }
  // Forma Spring Page<T>
  if (Array.isArray(raw.content)) {
    const itens = raw.content.map(feedItemFromApi)
    const pagina = raw.number ?? 0
    const tamanho = raw.size ?? itens.length
    const total = raw.totalElements ?? itens.length
    return { fase: faseFromApi(raw.fase), itens, pagina, tamanho, total, temMais: raw.last === false }
  }
  return { fase: faseFromApi(raw.fase), itens: [], pagina: 0, tamanho: 0, total: 0, temMais: false }
}
