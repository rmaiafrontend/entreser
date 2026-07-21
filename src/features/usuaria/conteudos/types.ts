import type { Conteudo, Formato } from '@/features/admin/conteudos/types'

export type { Conteudo, Formato }

/** Conteúdo completo + estado de progresso da usuária (UF6). */
export interface ConteudoDetalhe extends Conteudo {
  consumido: boolean
}

/** Item resumido para listas de busca (UF3) e navegação por tag (UF4). */
export interface ConteudoResumo {
  id: string
  titulo: string
  descricao: string
  formato: Formato
  duracao: number | null
  thumb: string | null
  /** Tags do conteúdo (id + nome) — alimentam a navegação por tag no Explorar (UF4). */
  tags: { id: string; nome: string }[]
  consumido: boolean
}

export interface ListarParams {
  /** Tag (id). */
  tag?: string
  formato?: Formato
}
