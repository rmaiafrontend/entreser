import { delay } from '@/features/admin/lib/mock'
import { SEED_PERGUNTAS } from '@/features/admin/onboarding/seed'
import { SEED_FASES } from '@/features/admin/fases/seed'
import { inferirFase } from '@/features/admin/onboarding/inferencia'
import { writeFaseAtualId } from '../lib/fase-store'
import type { OnbPergunta, OnbResultado, RespostaEscolhida } from './types'

/**
 * Contrato do onboarding da Usuária (UF1). `finalizar` recebe as respostas para
 * o mock computar a fase localmente (ALGO-FASE); no backend real o argumento é
 * ignorado — o servidor usa as respostas já registradas via `responder`.
 */
export interface OnboardingUsuariaService {
  getPerguntas(): Promise<OnbPergunta[]>
  responder(perguntaId: string, opcaoId: string): Promise<void>
  finalizar(respostas: RespostaEscolhida[]): Promise<OnbResultado>
}

/**
 * Mock — perguntas ativas (sem expor os pesos), e a fase inferida via o mesmo
 * `inferirFase` (ALGO-FASE) do backoffice. A fase escolhida é persistida em
 * `fase-store` para o feed/gate refletirem imediatamente.
 */
export const mockOnboardingUsuariaService: OnboardingUsuariaService = {
  async getPerguntas() {
    await delay(200)
    return SEED_PERGUNTAS.filter((p) => p.ativa)
      .slice()
      .sort((a, b) => a.ordem - b.ordem)
      .map((p) => ({
        id: p.id,
        texto: p.texto,
        ordem: p.ordem,
        opcoes: p.opcoes
          .slice()
          .sort((a, b) => a.ordem - b.ordem)
          .map((o) => ({ id: o.id, texto: o.texto, ordem: o.ordem })),
      }))
  },

  async responder() {
    // No mock a resposta não precisa ser persistida — `finalizar` recebe tudo.
    await delay(80)
  },

  async finalizar(respostas) {
    await delay(400)
    const escolhidas = respostas
      .map((r) => SEED_PERGUNTAS.find((p) => p.id === r.perguntaId)?.opcoes.find((o) => o.id === r.opcaoId))
      .filter((o): o is NonNullable<typeof o> => Boolean(o))

    const fases = SEED_FASES.filter((f) => f.ativa).map((f) => ({ id: f.id, nome: f.nome, ordem: f.ordem }))
    const r = inferirFase(fases, escolhidas)
    // Fallback defensivo: se nenhuma fase pontuar (não ocorre com o seed atual),
    // o mock não trava — assume a de menor ordem. O backend real lançaria erro.
    const escolhida = (r.faseId ? fases.find((f) => f.id === r.faseId) : null) ?? fases[0] ?? null
    if (escolhida) writeFaseAtualId(escolhida.id)
    return { fase: escolhida ? { id: escolhida.id, nome: escolhida.nome } : null }
  },
}
