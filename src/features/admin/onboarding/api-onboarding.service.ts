import { api, isApiError } from '@/lib/http'
import {
  mapaToMapeamentos,
  opcaoToRequest,
  perguntaFromApi,
  perguntaToRequest,
  type PerguntaApi,
} from './adapter'
import { OnboardingEmUsoError, type OnboardingService } from './service'
import type { OpcaoInput, Pergunta, PerguntaInput } from './types'

/**
 * Traduz um conflito de exclusão (item já respondido) em erro de domínio.
 *
 * Contrato confirmado (backend, 16/jul): a FK `ON DELETE RESTRICT` vira **409**
 * (`{message, code:"CONFLITO_DADOS"}`) pelo `@ExceptionHandler(DataIntegrityViolationException)`
 * global — antes escapava como 500. O sniff do corpo que existia aqui saiu de
 * propósito: ele reportaria "já respondida" para QUALQUER erro cujo texto
 * contivesse "respond"/"uso"/"vínculo", afirmando com confiança algo falso.
 */
function traduzExclusao(erro: unknown): unknown {
  if (isApiError(erro, 'conflict')) return new OnboardingEmUsoError()
  return erro
}

/**
 * Implementação REAL do `OnboardingService` contra `/api/v1/admin/onboarding`.
 *
 * Particularidades (confirmadas ao vivo):
 * - a LISTA (`GET /perguntas`) traz `opcoes: null`; o por-id (`GET /perguntas/{id}`)
 *   traz `opcoesResposta[]` com `mapeamentos[]`. Por isso `getAll` hidrata por by-id
 *   (para os cards mostrarem contagem de opções + status de mapeamento);
 * - reordenar (pergunta/opção) troca o campo `ordem` via 2 PATCHes;
 * - `setMapa` substitui os mapeamentos da opção via `PUT /opcoes/{id}/mapeamentos`.
 */
const PERG = '/admin/onboarding/perguntas'
const OPC = '/admin/onboarding/opcoes'

export class ApiOnboardingService implements OnboardingService {
  async getAll(): Promise<Pergunta[]> {
    // A lista traz `totalOpcoes`/`temMapeamento` (14/jul) — os cards já mostram
    // contagem e status de mapeamento sem hidratar cada pergunta por by-id (N+1
    // eliminado). `opcoes` fica vazio na lista; use `getAllFull` quando precisar
    // das opções completas (Simulador).
    const list = await api.get<PerguntaApi[]>(PERG)
    if (!Array.isArray(list)) return []
    return list.map(perguntaFromApi)
  }

  async getAllFull(): Promise<Pergunta[]> {
    // Hidrata as opções (+mapa) de cada pergunta por by-id. Custo N+1 pago só
    // quando o Simulador abre — não a cada carga da lista.
    const list = await api.get<PerguntaApi[]>(PERG)
    if (!Array.isArray(list)) return []
    return Promise.all(list.map((p) => this.getById(p.id).then((full) => full ?? perguntaFromApi(p))))
  }

  async getById(id: string): Promise<Pergunta | null> {
    try {
      const p = await api.get<PerguntaApi>(`${PERG}/${id}`)
      return p?.id ? perguntaFromApi(p) : null
    } catch (erro) {
      if (isApiError(erro, 'not_found')) return null
      throw erro
    }
  }

  async addPergunta(input: PerguntaInput): Promise<Pergunta> {
    const p = await api.post<PerguntaApi>(PERG, perguntaToRequest(input))
    return perguntaFromApi(p)
  }

  async updatePergunta(id: string, input: PerguntaInput): Promise<void> {
    await api.patch<PerguntaApi>(`${PERG}/${id}`, perguntaToRequest(input))
  }

  async deletePergunta(id: string): Promise<void> {
    // DELETE /admin/onboarding/perguntas/{id} (API §15.1) — endpoint existente.
    try {
      await api.delete(`${PERG}/${id}`, { responseType: 'void' })
    } catch (erro) {
      throw traduzExclusao(erro)
    }
  }

  async reorderPerguntas(orderedIds: string[]): Promise<void> {
    // Reorder transacional (§ resposta B-3.2): o backend reatribui `ordem` numa
    // única transação a partir da lista completa de ids — sem colisão de UNIQUE.
    await api.put(`${PERG}/ordem`, orderedIds, { responseType: 'void' })
  }

  async addOpcao(perguntaId: string, input: OpcaoInput): Promise<void> {
    await api.post(`${PERG}/${perguntaId}/opcoes`, opcaoToRequest(perguntaId, input))
  }

  async updateOpcao(perguntaId: string, opcaoId: string, input: OpcaoInput): Promise<void> {
    await api.patch(`${OPC}/${opcaoId}`, opcaoToRequest(perguntaId, input))
  }

  async deleteOpcao(perguntaId: string, opcaoId: string): Promise<void> {
    void perguntaId // DELETE /admin/onboarding/opcoes/{id} (API §15.2) usa só o opcaoId.
    try {
      await api.delete(`${OPC}/${opcaoId}`, { responseType: 'void' })
    } catch (erro) {
      throw traduzExclusao(erro)
    }
  }

  async reorderOpcoes(perguntaId: string, orderedIds: string[]): Promise<void> {
    await api.put(`${PERG}/${perguntaId}/opcoes/ordem`, orderedIds, { responseType: 'void' })
  }

  async setMapa(perguntaId: string, opcaoId: string, mapa: Record<string, number>): Promise<void> {
    // perguntaId não é necessário no endpoint (path usa opcaoId), mantido pela interface.
    void perguntaId
    await api.put(`${OPC}/${opcaoId}/mapeamentos`, mapaToMapeamentos(mapa), { responseType: 'void' })
  }
}
