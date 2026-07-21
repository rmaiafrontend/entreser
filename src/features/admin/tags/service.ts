import { delay, genId, loadCollection, saveCollection } from '@/features/admin/lib/mock'
import { SEED_TAGS } from './seed'
import type { TagItem } from './types'

/**
 * Contrato do serviço de Tags. Implementado tanto pelo mock (localStorage)
 * quanto pelo `ApiTagsService` (backend real). A UI consome via o seam em
 * `./index`, sem saber qual está ativo.
 *
 * `getAll` é assíncrono (Fase 2): mesmo o mock passa a devolver `Promise`, para
 * que trocar a implementação por HTTP não altere as assinaturas.
 */
export interface TagsService {
  getAll(): Promise<TagItem[]>
  add(nome: string): Promise<TagItem>
  rename(id: string, nome: string): Promise<TagItem>
  remove(id: string): Promise<void>
}

/**
 * Erro de domínio: tentativa de remover uma tag ainda vinculada a conteúdos ou
 * fases. Os adaptadores traduzem o erro HTTP correspondente para este tipo, e a
 * UI reage abrindo o diálogo de conflito.
 */
export class TagEmUsoError extends Error {
  constructor(message = 'Esta tag está em uso e não pode ser removida.') {
    super(message)
    this.name = 'TagEmUsoError'
  }
}

const KEY = 'bo:tags'
let cache: TagItem[] | null = null

function ensure(): TagItem[] {
  if (!cache) cache = loadCollection(KEY, SEED_TAGS)
  return cache
}
function commit(next: TagItem[]): void {
  cache = next
  saveCollection(KEY, next)
}

/** Implementação mock (localStorage). Mantida como fallback offline — ver `index.ts`. */
export const mockTagsService: TagsService = {
  async getAll() {
    await delay(150)
    return [...ensure()]
  },
  async add(nome) {
    await delay(300)
    const novo: TagItem = { id: genId(), nome: nome.trim(), usoConteudos: 0, usoFases: 0 }
    commit([novo, ...ensure()])
    return novo
  },
  async rename(id, nome) {
    await delay(300)
    let updated: TagItem | undefined
    commit(
      ensure().map((t) => {
        if (t.id !== id) return t
        updated = { ...t, nome: nome.trim() }
        return updated
      }),
    )
    if (!updated) throw new Error('Tag não encontrada.')
    return updated
  },
  async remove(id) {
    await delay(300)
    const alvo = ensure().find((t) => t.id === id)
    if (alvo && alvo.usoConteudos + alvo.usoFases > 0) throw new TagEmUsoError()
    commit(ensure().filter((t) => t.id !== id))
  },
}
