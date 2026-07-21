import { api } from '@/lib/http'
import { perguntaFromApi } from './adapter'
import type { OnboardingUsuariaService } from './service'
import type { OnbPergunta, OnbResultado, RespostaEscolhida } from './types'

interface PerguntaApiDTO {
  id: string
  texto: string
  ordem: number
  opcoes?: { id: string; texto: string; ordem: number }[] | null
  opcoesResposta?: { id: string; texto: string; ordem: number }[] | null
}

/** Payload por resposta de `POST /onboarding/respostas` (DTO `RespostaOnboardingRequest`). */
interface RespostaOnboardingRequestDTO {
  perguntaId: string
  opcaoRespostaId: string
}

/** `GET /usuaria/fase` — chaves literais do Map do controller; `faseAtual` é a entidade Fase (ou null). */
interface MinhaFaseApi {
  faseAtual?: { id: string; nome: string } | null
}

/**
 * Implementação REAL do onboarding da Usuária (UF1).
 *
 * O backend NÃO tem POST por resposta nem `POST /onboarding/finalizar` (removido
 * por decisão): a UI acumula as respostas e envia a lista COMPLETA de uma vez em
 * `POST /onboarding/respostas`, que já dispara a inferência da fase (ALGO-FASE) e
 * a persiste no servidor. A fase resultante é lida em `GET /usuaria/fase` (rota
 * fora de `/api/v1` → `absolute`), no campo `faseAtual`. `responder` é no-op (não
 * há rota por resposta) — mantido só para o contrato compartilhado com o mock.
 */
export class ApiOnboardingUsuariaService implements OnboardingUsuariaService {
  async getPerguntas(): Promise<OnbPergunta[]> {
    const data = await api.get<PerguntaApiDTO[]>('/onboarding/perguntas')
    return Array.isArray(data) ? data.map(perguntaFromApi) : []
  }

  async responder(): Promise<void> {
    // Sem rota por resposta — as respostas são enviadas juntas em `finalizar`.
  }

  async finalizar(respostas: RespostaEscolhida[]): Promise<OnbResultado> {
    const payload: RespostaOnboardingRequestDTO[] = respostas.map((r) => ({
      perguntaId: r.perguntaId,
      opcaoRespostaId: r.opcaoId,
    }))
    await api.post('/onboarding/respostas', payload, { responseType: 'void' })
    // A fase já foi inferida e persistida pelo POST acima; lemos a atual.
    const minhaFase = await api.get<MinhaFaseApi>('/usuaria/fase', { absolute: true })
    const f = minhaFase?.faseAtual
    return { fase: f ? { id: f.id, nome: f.nome } : null }
  }
}
