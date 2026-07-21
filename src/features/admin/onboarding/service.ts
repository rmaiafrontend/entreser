import { delay, genId, loadCollection, saveCollection } from '@/features/admin/lib/mock'
import { applyOrder } from '@/features/admin/lib/reorder'
import { SEED_PERGUNTAS } from './seed'
import type { OpcaoInput, Pergunta, PerguntaInput } from './types'

/**
 * Contrato do serviço de Onboarding. Implementado pelo mock e pelo
 * `ApiOnboardingService`. `getAll` (lista) e `getById` (com opções + mapa)
 * assíncronos (Fase 2). `updatePergunta` recebe o input completo (o PATCH do
 * backend leva `PerguntaOnboardingRequest` inteiro).
 */
export interface OnboardingService {
  /** Lista leve: `opcoes` vazio, mas com `totalOpcoes`/`temMapeamento` para os cards. */
  getAll(): Promise<Pergunta[]>
  /** Lista com opções completas (+mapa) — usada só pelo Simulador. */
  getAllFull(): Promise<Pergunta[]>
  getById(id: string): Promise<Pergunta | null>
  addPergunta(input: PerguntaInput): Promise<Pergunta>
  updatePergunta(id: string, input: PerguntaInput): Promise<void>
  deletePergunta(id: string): Promise<void>
  /** Reordena as perguntas: recebe TODOS os ids na ordem final (`PUT .../perguntas/ordem`). */
  reorderPerguntas(orderedIds: string[]): Promise<void>
  addOpcao(perguntaId: string, input: OpcaoInput): Promise<void>
  updateOpcao(perguntaId: string, opcaoId: string, input: OpcaoInput): Promise<void>
  deleteOpcao(perguntaId: string, opcaoId: string): Promise<void>
  /** Reordena as opções de uma pergunta: todos os ids na ordem final. */
  reorderOpcoes(perguntaId: string, orderedIds: string[]): Promise<void>
  setMapa(perguntaId: string, opcaoId: string, mapa: Record<string, number>): Promise<void>
}

/**
 * Erro de domínio: exclusão barrada porque o item (pergunta/opção) já foi
 * respondido por usuárias. O adaptador traduz o conflito HTTP correspondente e a
 * UI reage explicando o motivo em vez de mostrar um erro genérico.
 */
export class OnboardingEmUsoError extends Error {
  constructor(message = 'Este item já foi respondido por usuárias e não pode ser excluído.') {
    super(message)
    this.name = 'OnboardingEmUsoError'
  }
}

const KEY = 'bo:onboarding'
let cache: Pergunta[] | null = null

function ensure(): Pergunta[] {
  if (!cache) cache = loadCollection(KEY, SEED_PERGUNTAS)
  return cache
}
function commit(next: Pergunta[]): void {
  cache = next
  saveCollection(KEY, next)
}
function cloneP(p: Pergunta): Pergunta {
  return { ...p, opcoes: p.opcoes.map((o) => ({ ...o, mapa: { ...o.mapa } })) }
}

/** Implementação mock (localStorage). Mantida como fallback offline — ver `index.ts`. */
export const mockOnboardingService: OnboardingService = {
  async getAll() {
    await delay(150)
    return ensure().map(cloneP)
  },
  async getAllFull() {
    // Mock já tem tudo em memória — igual ao getAll (opções completas).
    await delay(150)
    return ensure().map(cloneP)
  },
  async getById(id) {
    await delay(120)
    const p = ensure().find((x) => x.id === id)
    return p ? cloneP(p) : null
  },
  async addPergunta(input) {
    await delay()
    const nova: Pergunta = { id: genId(), ...input, opcoes: [] }
    commit([...ensure(), nova])
    return nova
  },
  async updatePergunta(id, input) {
    await delay(300)
    commit(ensure().map((p) => (p.id === id ? { ...p, ...input } : p)))
  },
  async deletePergunta(id) {
    await delay(300)
    commit(ensure().filter((p) => p.id !== id))
  },
  async reorderPerguntas(orderedIds) {
    await delay(200)
    commit(applyOrder(ensure(), orderedIds))
  },
  async addOpcao(perguntaId, input) {
    await delay(300)
    commit(
      ensure().map((p) =>
        p.id === perguntaId ? { ...p, opcoes: [...p.opcoes, { id: genId(), ...input, mapa: {} }] } : p,
      ),
    )
  },
  async updateOpcao(perguntaId, opcaoId, input) {
    await delay(300)
    commit(
      ensure().map((p) =>
        p.id === perguntaId
          ? { ...p, opcoes: p.opcoes.map((o) => (o.id === opcaoId ? { ...o, ...input } : o)) }
          : p,
      ),
    )
  },
  async deleteOpcao(perguntaId, opcaoId) {
    await delay(300)
    commit(
      ensure().map((p) =>
        p.id === perguntaId ? { ...p, opcoes: p.opcoes.filter((o) => o.id !== opcaoId) } : p,
      ),
    )
  },
  async reorderOpcoes(perguntaId, orderedIds) {
    await delay(200)
    commit(
      ensure().map((p) => (p.id === perguntaId ? { ...p, opcoes: applyOrder(p.opcoes, orderedIds) } : p)),
    )
  },
  async setMapa(perguntaId, opcaoId, mapa) {
    await delay(300)
    commit(
      ensure().map((p) =>
        p.id === perguntaId
          ? { ...p, opcoes: p.opcoes.map((o) => (o.id === opcaoId ? { ...o, mapa } : o)) }
          : p,
      ),
    )
  },
}
