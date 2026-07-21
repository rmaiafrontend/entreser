import { todayISO } from '@/features/admin/lib/format'
import { delay, genId, loadCollection, saveCollection } from '@/features/admin/lib/mock'
import { SEED_CONTEUDOS } from './seed'
import type { Conteudo, ConteudoInput } from './types'

/**
 * Contrato do serviço de Conteúdos. Implementado pelo mock (localStorage) e pelo
 * `ApiConteudosService`. `getAll`/`getById` assíncronos (Fase 2). `togglePublish`
 * recebe o conteúdo completo (o backend faz PATCH com o request inteiro).
 */
export interface ConteudosService {
  getAll(): Promise<Conteudo[]>
  getById(id: string): Promise<Conteudo | null>
  add(input: ConteudoInput): Promise<Conteudo>
  update(id: string, input: ConteudoInput): Promise<Conteudo>
  togglePublish(conteudo: Conteudo): Promise<void>
  remove(id: string): Promise<void>
}

const KEY = 'bo:conteudos'
let cache: Conteudo[] | null = null

function ensure(): Conteudo[] {
  if (!cache) cache = loadCollection(KEY, SEED_CONTEUDOS)
  return cache
}
function commit(next: Conteudo[]): void {
  cache = next
  saveCollection(KEY, next)
}

/** Implementação mock (localStorage). Mantida como fallback offline — ver `index.ts`. */
export const mockConteudosService: ConteudosService = {
  async getAll() {
    await delay(150)
    return [...ensure()]
  },
  async getById(id) {
    await delay(120)
    return ensure().find((c) => c.id === id) ?? null
  },
  async add(input) {
    await delay()
    const hoje = todayISO()
    const novo: Conteudo = {
      id: genId(),
      ...input,
      criadoEm: hoje,
      atualizadoEm: hoje,
      publicadoEm: input.publicado ? hoje : null,
    }
    commit([novo, ...ensure()])
    return novo
  },
  async update(id, input) {
    await delay()
    const hoje = todayISO()
    let updated: Conteudo | undefined
    commit(
      ensure().map((c) => {
        if (c.id !== id) return c
        updated = {
          ...c,
          ...input,
          atualizadoEm: hoje,
          publicadoEm: input.publicado && !c.publicadoEm ? hoje : c.publicadoEm,
        }
        return updated
      }),
    )
    if (!updated) throw new Error('Conteúdo não encontrado.')
    return updated
  },
  async togglePublish(conteudo) {
    await delay(300)
    const hoje = todayISO()
    commit(
      ensure().map((c) =>
        c.id === conteudo.id
          ? {
              ...c,
              publicado: !c.publicado,
              atualizadoEm: hoje,
              publicadoEm: !c.publicado && !c.publicadoEm ? hoje : c.publicadoEm,
            }
          : c,
      ),
    )
  },
  async remove(id) {
    await delay(300)
    commit(ensure().filter((c) => c.id !== id))
  },
}
