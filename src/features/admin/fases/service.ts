import { delay, genId, loadCollection, saveCollection } from '@/features/admin/lib/mock'
import { applyOrder } from '@/features/admin/lib/reorder'
import { SEED_FASES } from './seed'
import type { Fase, FaseInput } from './types'

/**
 * Contrato do serviço de Fases. Implementado pelo mock e pelo `ApiFasesService`.
 * `getAll` assíncrono (Fase 2).
 */
export interface FasesService {
  getAll(): Promise<Fase[]>
  add(input: FaseInput): Promise<Fase>
  update(id: string, input: FaseInput): Promise<Fase>
  /** Reordena as fases: recebe TODOS os ids na ordem final (`PUT /admin/fases/ordem`). */
  reorder(orderedIds: string[]): Promise<void>
}

const KEY = 'bo:fases'
let cache: Fase[] | null = null

function ensure(): Fase[] {
  if (!cache) cache = loadCollection(KEY, SEED_FASES)
  return cache
}
function commit(next: Fase[]): void {
  cache = next
  saveCollection(KEY, next)
}

/** Implementação mock (localStorage). Mantida como fallback offline — ver `index.ts`. */
export const mockFasesService: FasesService = {
  async getAll() {
    await delay(150)
    return [...ensure()]
  },
  async add(input) {
    await delay()
    const novo: Fase = { id: genId(), ...input }
    commit([...ensure(), novo])
    return novo
  },
  async update(id, input) {
    await delay()
    let updated: Fase | undefined
    commit(
      ensure().map((f) => {
        if (f.id !== id) return f
        updated = { ...f, ...input }
        return updated
      }),
    )
    if (!updated) throw new Error('Fase não encontrada.')
    return updated
  },
  async reorder(orderedIds) {
    await delay(200)
    commit(applyOrder(ensure(), orderedIds))
  },
}
