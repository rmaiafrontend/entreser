import { delay } from '@/features/admin/lib/mock'
import { SEED_FASES } from '@/features/admin/fases/seed'
import { readFaseAtualId, writeFaseAtualId } from '../lib/fase-store'
import type { Fase, MinhaFase } from './types'

/**
 * Contrato da fase da Usuária (UF7). Implementado pelo mock e pelo
 * `ApiFaseUsuariaService`. A troca reflete no feed imediatamente (a view
 * recarrega o feed após `trocarFase`).
 */
export interface FaseUsuariaService {
  getMinhaFase(): Promise<MinhaFase>
  trocarFase(faseId: string): Promise<Fase>
}

/** Fases disponíveis para a usuária = apenas as ativas, em ordem de progressão. */
export function fasesAtivas(): Fase[] {
  return SEED_FASES.filter((f) => f.ativa).sort((a, b) => a.ordem - b.ordem)
}

/** Implementação mock — fase atual persistida em localStorage (ver `fase-store`). */
export const mockFaseUsuariaService: FaseUsuariaService = {
  async getMinhaFase() {
    await delay(150)
    const disponiveis = fasesAtivas()
    const id = readFaseAtualId()
    const atual = id ? disponiveis.find((f) => f.id === id) ?? null : null
    return { atual, disponiveis }
  },
  async trocarFase(faseId) {
    await delay()
    const fase = fasesAtivas().find((f) => f.id === faseId)
    if (!fase) throw new Error('Fase não encontrada.')
    writeFaseAtualId(faseId)
    return fase
  },
}
