import { delay } from '@/features/admin/lib/mock'
import { SEED_CONTEUDOS, SEED_CONTEUDOS_POR_ID } from '../lib/seed'
import { isConcluido, readConcluidos, setConcluido } from '../lib/progresso-store'
import { conteudoResumoFromDomain } from './adapter'
import type { ConteudoDetalhe, ConteudoResumo, ListarParams } from './types'

/**
 * Contrato dos conteúdos do lado da Usuária: leitura (UF6), busca (UF3),
 * navegação por tag/formato (UF4) e registro de progresso binário (UF6).
 */
export interface ConteudosUsuariaService {
  getById(id: string): Promise<ConteudoDetalhe | null>
  buscar(q: string): Promise<ConteudoResumo[]>
  listar(params: ListarParams): Promise<ConteudoResumo[]>
  setProgresso(id: string, concluido: boolean): Promise<void>
}

/** Normaliza para busca case-insensitive e sem acentos (fiel à spec UF3). */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export const mockConteudosUsuariaService: ConteudosUsuariaService = {
  async getById(id) {
    await delay(150)
    const c = SEED_CONTEUDOS_POR_ID.get(id)
    if (!c || !c.publicado) return null
    return { ...c, consumido: isConcluido(id) }
  },

  async buscar(q) {
    await delay(200)
    const termo = norm(q.trim())
    if (!termo) return []
    const concluidos = readConcluidos()
    return SEED_CONTEUDOS.filter((c) => c.publicado)
      .filter((c) => norm(c.titulo).includes(termo) || norm(c.descricao).includes(termo))
      .map((c) => conteudoResumoFromDomain(c, concluidos.has(c.id)))
  },

  async listar({ tag, formato }) {
    await delay(200)
    const concluidos = readConcluidos()
    return SEED_CONTEUDOS.filter((c) => c.publicado)
      .filter((c) => (tag ? c.tags.includes(tag) : true))
      .filter((c) => (formato ? c.formato === formato : true))
      .map((c) => conteudoResumoFromDomain(c, concluidos.has(c.id)))
  },

  async setProgresso(id, concluido) {
    await delay(120)
    setConcluido(id, concluido)
  },
}
