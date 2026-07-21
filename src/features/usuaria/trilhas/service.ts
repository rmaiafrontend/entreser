import { delay } from '@/features/admin/lib/mock'
import { SEED_CONTEUDOS_POR_ID, SEED_TRILHAS } from '../lib/seed'
import { readConcluidos } from '../lib/progresso-store'
import type { TrilhaDetalhe, TrilhaItem, TrilhaResumo } from './types'

/** Contrato das trilhas do lado da Usuária (UF5). */
export interface TrilhasUsuariaService {
  getAll(): Promise<TrilhaResumo[]>
  getById(id: string): Promise<TrilhaDetalhe | null>
}

function progresso(consumidos: number, total: number): number {
  return total > 0 ? Math.round((consumidos / total) * 100) : 0
}

export const mockTrilhasUsuariaService: TrilhasUsuariaService = {
  async getAll() {
    await delay(200)
    const concluidos = readConcluidos()
    return SEED_TRILHAS.map((t) => {
      // Ids fantasmas (conteúdo removido) não contam para o total.
      const validos = t.conteudos.filter((id) => SEED_CONTEUDOS_POR_ID.has(id))
      const consumidos = validos.filter((id) => concluidos.has(id)).length
      return {
        id: t.id,
        titulo: t.titulo,
        descricao: t.descricao,
        thumb: t.thumb,
        total: validos.length,
        consumidos,
        progresso: progresso(consumidos, validos.length),
      }
    })
  },

  async getById(id) {
    await delay(200)
    const t = SEED_TRILHAS.find((x) => x.id === id)
    if (!t) return null
    const concluidos = readConcluidos()
    const itens: TrilhaItem[] = t.conteudos
      .map((cid) => SEED_CONTEUDOS_POR_ID.get(cid))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map((c, i) => ({
        ordem: i + 1,
        conteudoId: c.id,
        titulo: c.titulo,
        formato: c.formato,
        duracao: c.duracao,
        thumb: c.thumb,
        consumido: concluidos.has(c.id),
      }))
    const total = itens.length
    const consumidos = itens.filter((i) => i.consumido).length
    return {
      id: t.id,
      titulo: t.titulo,
      descricao: t.descricao,
      thumb: t.thumb,
      itens,
      total,
      consumidos,
      progresso: progresso(consumidos, total),
    }
  },
}
