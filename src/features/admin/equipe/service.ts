import { todayISO } from '@/features/admin/lib/format'
import { delay, genId, loadCollection, saveCollection } from '@/features/admin/lib/mock'
import { SEED_EQUIPE } from './seed'
import type { EquipeInput, EquipeMembro } from './types'

/**
 * Contrato do serviço de Equipe. A UI depende só desta interface — ativa pelo
 * `ApiEquipeService` (backend real) via o seam em `./index`; o mock (localStorage)
 * fica como fallback offline. No MVP só há leitura e adição: a API expõe apenas
 * `GET`/`POST /admin/admins`, sem edição/desativação/remoção.
 */
export interface EquipeService {
  getAll(): Promise<EquipeMembro[]>
  add(input: EquipeInput): Promise<EquipeMembro>
}

/**
 * Erro de domínio: cadastro barrado por e-mail já existente. O backend valida
 * contra TODOS os usuários da plataforma (equipe, profissionais e pacientes),
 * não só a equipe. O adaptador traduz o `409`; a UI mostra a mensagem do servidor.
 */
export class EmailJaCadastradoError extends Error {
  constructor(message = 'E-mail já cadastrado.') {
    super(message)
    this.name = 'EmailJaCadastradoError'
  }
}

const KEY = 'bo:equipe'
let cache: EquipeMembro[] | null = null

function ensure(): EquipeMembro[] {
  if (!cache) cache = loadCollection(KEY, SEED_EQUIPE)
  return cache
}

/** Implementação mock (localStorage). Mantida como fallback offline — ver `index.ts`. */
export const mockEquipeService: EquipeService = {
  async getAll() {
    await delay(150)
    return [...ensure()]
  },

  async add(input) {
    await delay()
    const email = input.email.trim().toLowerCase()
    // Espelha o 409 do backend para o fallback offline se comportar igual.
    if (ensure().some((m) => m.email === email)) throw new EmailJaCadastradoError()
    const novo: EquipeMembro = {
      id: genId(),
      nome: input.nome.trim(),
      email,
      ativa: true,
      criadaEm: todayISO(),
    }
    const next = [...ensure(), novo]
    cache = next
    saveCollection(KEY, next)
    return novo
  },
}
