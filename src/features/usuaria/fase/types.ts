import type { Fase } from '@/features/admin/fases/types'

// A Usuária lê a mesma entidade Fase do M05 (definida pelo backoffice).
export type { Fase }

/** Estado da tela "Minha fase" (UF7): fase atual + fases ativas para troca. */
export interface MinhaFase {
  atual: Fase | null
  disponiveis: Fase[]
}
