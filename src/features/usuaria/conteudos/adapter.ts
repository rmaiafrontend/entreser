import { conteudoFromApi, formatoFromApi, type ConteudoApi } from '@/features/admin/conteudos/adapter'
import { tagNome } from '../lib/tags'
import type { Conteudo } from '@/features/admin/conteudos/types'
import type { ConteudoDetalhe, ConteudoResumo } from './types'

/** Progresso da usuária no by-id — Map<String,Object> montado pelo controller (chaves `.put()`). */
export interface ProgressoConteudoApi {
  concluido: boolean
  concluidoEm: string | null
  tempoConsumidoSegundos: number
  duracaoEstimadaSegundos: number
  percentualConsumido: number
}

/** By-id da usuária: envelope `{ conteudo, progresso }` (`GET /conteudos/{id}`). */
export interface ConteudoByIdApi {
  conteudo: ConteudoApi
  progresso: ProgressoConteudoApi
}

/** Desembrulha o envelope e mapeia `progresso.concluido` → `consumido` (UF6). */
export function conteudoDetalheFromApi(res: ConteudoByIdApi): ConteudoDetalhe {
  return { ...conteudoFromApi(res.conteudo), consumido: Boolean(res.progresso?.concluido) }
}

/** Resumo a partir do domínio (mock) — resolve nomes de tags a partir dos ids. */
export function conteudoResumoFromDomain(c: Conteudo, consumido: boolean): ConteudoResumo {
  return {
    id: c.id,
    titulo: c.titulo,
    descricao: c.descricao,
    formato: c.formato,
    duracao: c.duracao,
    thumb: c.thumb,
    tags: c.tags.map((id) => ({ id, nome: tagNome(id) })),
    consumido,
  }
}

/**
 * Resumo a partir do DTO do backend (lista/busca). `GET /conteudos` e
 * `/conteudos/buscar` devolvem `List<Conteudo>` cru (entidade), SEM progresso:
 * `consumido` fica `false` (a marcação só existe no by-id). `tags` é `@Transient`
 * e não é populada por este controller, então virá vazia.
 */
export function conteudoResumoFromApi(c: ConteudoApi): ConteudoResumo {
  return {
    id: c.id,
    titulo: c.titulo,
    descricao: c.descricao ?? '',
    formato: formatoFromApi(c.formato),
    duracao: c.duracaoMinutos ?? null,
    thumb: c.thumbUrl ?? null,
    tags: (c.tags ?? []).map((t) => ({ id: t.id, nome: t.nome ?? '' })).filter((t) => t.id && t.nome),
    consumido: false,
  }
}
