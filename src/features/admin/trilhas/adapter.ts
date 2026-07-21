import type { Trilha, TrilhaInput } from './types'

/** Item de `Trilha.conteudos` no backend: conteúdo + posição. */
interface ConteudoTrilhaApi {
  id: string
  conteudo: { id: string } | null
  ordem: number
}

/** Trilha como o backend devolve (`GET /admin/trilhas[/{id}]`). */
export interface TrilhaApi {
  id: string
  titulo: string
  descricao: string | null
  thumbUrl: string | null
  publicada: boolean
  publicadaEm: string | null
  criadaEm: string
  atualizadaEm?: string | null
  conteudos: ConteudoTrilhaApi[] | null
  /** Contagem no DTO da lista (14/jul); a lista traz `conteudos: null`. */
  totalConteudos?: number
}

/** Corpo de `POST`/`PATCH /admin/trilhas` (schema `TrilhaRequest`). */
export interface TrilhaRequest {
  titulo: string
  descricao: string
  thumbUrl: string | null
  publicada: boolean
  conteudosOrdenados: { conteudoId: string; ordem: number }[]
}

/** Backend → domínio. `conteudos` (objetos ordenados) vira lista de ids em ordem. */
export function trilhaFromApi(t: TrilhaApi): Trilha {
  const conteudos = (t.conteudos ?? [])
    .slice()
    .sort((a, b) => a.ordem - b.ordem)
    .map((ct) => ct.conteudo?.id)
    .filter((id): id is string => Boolean(id))
  return {
    id: t.id,
    titulo: t.titulo,
    descricao: t.descricao ?? '',
    publicada: t.publicada,
    thumb: t.thumbUrl ?? null,
    conteudos,
    totalConteudos: t.totalConteudos ?? conteudos.length,
    criadaEm: t.criadaEm,
    publicadaEm: t.publicadaEm ?? null,
  }
}

/** Domínio → request. Lista de ids em ordem vira `conteudosOrdenados` (1-based). */
export function trilhaToRequest(input: TrilhaInput): TrilhaRequest {
  return {
    titulo: input.titulo.trim(),
    descricao: input.descricao,
    thumbUrl: input.thumb,
    publicada: input.publicada,
    conteudosOrdenados: input.conteudos.map((conteudoId, i) => ({ conteudoId, ordem: i + 1 })),
  }
}
