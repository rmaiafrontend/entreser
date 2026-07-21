import { formatoFromApi } from '@/features/admin/conteudos/adapter'
import type { TrilhaDetalhe, TrilhaItem, TrilhaResumo } from './types'

/** Entidade `Trilha` aninhada em `.trilha` nas respostas da Usuária (Jackson: getters camelCase). */
interface TrilhaEntityApi {
  id: string
  titulo: string
  descricao?: string | null
  thumbUrl?: string | null
  publicada?: boolean
  publicadaEm?: string | null
  criadaEm?: string | null
  atualizadaEm?: string | null
}

/**
 * Item de conteúdo ACHATADO em `GET /trilhas/{id}` → `conteudos[]`. O controller monta
 * o Map à mão: sem `ordem`, sem aninhamento em `conteudo`, com a flag `concluido` (não
 * `consumido`) e SEM `duracaoMinutos`. Chaves de data literais `criadaEm`/`atualizadaEm`.
 */
interface ConteudoDetalheApi {
  id: string
  titulo?: string | null
  descricao?: string | null
  formato?: string | null
  url?: string | null
  thumbUrl?: string | null
  publicado?: boolean
  criadaEm?: string | null
  atualizadaEm?: string | null
  concluido?: boolean
}

/**
 * Resumo de trilha em `GET /trilhas` — cada item espalha `calcularProgresso(...)` no topo
 * (`totalConteudos`, `conteudosConcluidos`, `percentualConcluido`) e aninha a entidade em `.trilha`.
 */
export interface TrilhaResumoApi {
  totalConteudos?: number
  conteudosConcluidos?: number
  percentualConcluido?: number
  trilha: TrilhaEntityApi
}

/** Detalhe de trilha em `GET /trilhas/{id}` — resumo + `conteudos[]` já ordenados por `ordem`. */
export interface TrilhaDetalheApi extends TrilhaResumoApi {
  conteudos?: ConteudoDetalheApi[] | null
}

export function trilhaResumoFromApi(t: TrilhaResumoApi): TrilhaResumo {
  return {
    id: t.trilha.id,
    titulo: t.trilha.titulo,
    descricao: t.trilha.descricao ?? '',
    thumb: t.trilha.thumbUrl ?? null,
    total: t.totalConteudos ?? 0,
    consumidos: t.conteudosConcluidos ?? 0,
    progresso: t.percentualConcluido ?? 0,
  }
}

export function trilhaDetalheFromApi(t: TrilhaDetalheApi): TrilhaDetalhe {
  // `conteudos` já vem ordenado por `ct.ordem ASC` no repositório; o backend não expõe
  // `ordem`, então usamos o índice do array (1-based). `duracao` não vem no detalhe → null.
  const itens: TrilhaItem[] = (t.conteudos ?? []).map((c, i) => ({
    ordem: i + 1,
    conteudoId: c.id,
    titulo: c.titulo ?? '',
    formato: formatoFromApi(c.formato ?? 'artigo'),
    duracao: null,
    thumb: c.thumbUrl ?? null,
    consumido: Boolean(c.concluido),
  }))
  return {
    id: t.trilha.id,
    titulo: t.trilha.titulo,
    descricao: t.trilha.descricao ?? '',
    thumb: t.trilha.thumbUrl ?? null,
    itens,
    total: t.totalConteudos ?? itens.length,
    consumidos: t.conteudosConcluidos ?? itens.filter((i) => i.consumido).length,
    progresso: t.percentualConcluido ?? 0,
  }
}
