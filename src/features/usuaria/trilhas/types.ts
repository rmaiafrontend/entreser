import type { Formato } from '@/features/admin/conteudos/types'

/** Conteúdo dentro de uma trilha, na ordem curada (M05: ConteudoTrilha.ordem). */
export interface TrilhaItem {
  ordem: number
  conteudoId: string
  titulo: string
  formato: Formato
  duracao: number | null
  thumb: string | null
  consumido: boolean
}

/** Resumo de trilha para a listagem (UF5). */
export interface TrilhaResumo {
  id: string
  titulo: string
  descricao: string
  thumb: string | null
  total: number
  consumidos: number
  /** 0–100. */
  progresso: number
}

/** Trilha detalhada: metadados + conteúdos ordenados com progresso (UF5). */
export interface TrilhaDetalhe {
  id: string
  titulo: string
  descricao: string
  thumb: string | null
  itens: TrilhaItem[]
  total: number
  consumidos: number
  progresso: number
}
