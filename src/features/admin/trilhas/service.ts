import { todayISO } from '@/features/admin/lib/format'
import { delay, genId, loadCollection, saveCollection } from '@/features/admin/lib/mock'
import { sortByText } from '@/features/admin/lib/sort'
import { SEED_TRILHAS } from './seed'
import type { Trilha, TrilhaInput } from './types'

/**
 * Contrato do serviço de Trilhas. Implementado pelo mock e pelo
 * `ApiTrilhasService`. `getAll`/`getById` assíncronos (Fase 2).
 */
export interface TrilhasService {
  getAll(): Promise<Trilha[]>
  getById(id: string): Promise<Trilha | null>
  add(input: TrilhaInput): Promise<Trilha>
  update(id: string, input: TrilhaInput): Promise<Trilha>
}

const KEY = 'bo:trilhas'
let cache: Trilha[] | null = null

function ensure(): Trilha[] {
  if (!cache) cache = loadCollection(KEY, SEED_TRILHAS)
  return cache
}
function commit(next: Trilha[]): void {
  cache = next
  saveCollection(KEY, next)
}

/** Implementação mock (localStorage). Mantida como fallback offline — ver `index.ts`. */
export const mockTrilhasService: TrilhasService = {
  async getAll() {
    await delay(150)
    return sortByText(ensure(), (t) => t.titulo)
  },
  async getById(id) {
    await delay(120)
    return ensure().find((t) => t.id === id) ?? null
  },
  async add(input) {
    await delay()
    const hoje = todayISO()
    const nova: Trilha = {
      id: genId(),
      ...input,
      criadaEm: hoje,
      publicadaEm: input.publicada ? hoje : null,
    }
    commit([nova, ...ensure()])
    return nova
  },
  async update(id, input) {
    await delay()
    const hoje = todayISO()
    let updated: Trilha | undefined
    commit(
      ensure().map((t) => {
        if (t.id !== id) return t
        updated = {
          ...t,
          ...input,
          publicadaEm: input.publicada && !t.publicadaEm ? hoje : t.publicadaEm,
        }
        return updated
      }),
    )
    if (!updated) throw new Error('Trilha não encontrada.')
    return updated
  },
}
