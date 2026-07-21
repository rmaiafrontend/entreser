import { addDaysISO, todayISO } from '@/features/admin/lib/format'
import { delay, genId, loadCollection, saveCollection } from '@/features/admin/lib/mock'
import { SEED_PROFISSIONAIS } from './seed'
import type { Profissional, ProfissionalInput } from './types'

/**
 * Contrato do serviço de Profissionais. A UI depende só desta interface — ativa
 * pelo `ApiProfissionaisService` (backend real) via o seam em `./index`; o mock
 * (localStorage) fica como fallback offline. `getAll`/`getById` assíncronos.
 */
export interface ProfissionaisService {
  getAll(): Promise<Profissional[]>
  getById(id: string): Promise<Profissional | null>
  add(input: ProfissionalInput, criadaPor: string): Promise<Profissional>
  update(id: string, input: ProfissionalInput): Promise<Profissional>
  deactivate(id: string): Promise<void>
  reactivate(id: string): Promise<void>
  resendInvite(id: string): Promise<Profissional>
}

/**
 * Erro de domínio: cadastro barrado por e-mail (ou CRP) já existente. O adaptador
 * traduz o `409` do backend; a UI mostra a mensagem do servidor.
 */
export class EmailJaCadastradoError extends Error {
  constructor(message = 'E-mail já cadastrado.') {
    super(message)
    this.name = 'EmailJaCadastradoError'
  }
}

const KEY = 'bo:profissionais'
let cache: Profissional[] | null = null

function ensure(): Profissional[] {
  if (!cache) cache = loadCollection(KEY, SEED_PROFISSIONAIS)
  return cache
}

function commit(next: Profissional[]): void {
  cache = next
  saveCollection(KEY, next)
}

/** Implementação mock (localStorage). Mantida como fallback offline — ver `index.ts`. */
export const mockProfissionaisService: ProfissionaisService = {
  async getAll() {
    await delay(150)
    return [...ensure()]
  },

  async getById(id) {
    await delay(120)
    return ensure().find((p) => p.id === id) ?? null
  },

  async add(input, criadaPor) {
    await delay()
    const novo: Profissional = {
      id: genId(),
      ...input,
      ativa: true,
      convite: 'pendente',
      conviteExpiraEm: addDaysISO(7),
      criadaEm: todayISO(),
      criadaPor,
      bio: '',
    }
    commit([novo, ...ensure()])
    return novo
  },

  async update(id, input) {
    await delay()
    let updated: Profissional | undefined
    commit(
      ensure().map((p) => {
        if (p.id !== id) return p
        updated = { ...p, ...input }
        return updated
      }),
    )
    if (!updated) throw new Error('Profissional não encontrada.')
    return updated
  },

  async deactivate(id) {
    await delay()
    commit(ensure().map((p) => (p.id === id ? { ...p, ativa: false } : p)))
  },

  async reactivate(id) {
    await delay()
    commit(ensure().map((p) => (p.id === id ? { ...p, ativa: true } : p)))
  },

  async resendInvite(id) {
    await delay()
    let updated: Profissional | undefined
    commit(
      ensure().map((p) => {
        if (p.id !== id) return p
        updated = { ...p, convite: 'pendente', conviteExpiraEm: addDaysISO(7) }
        return updated
      }),
    )
    if (!updated) throw new Error('Profissional não encontrada.')
    return updated
  },
}
