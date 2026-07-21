import { api } from '@/lib/http'
import { faseFromApi, type FaseApi } from '@/features/admin/fases/adapter'
import type { FaseUsuariaService } from './service'
import type { Fase, MinhaFase } from './types'

/**
 * Implementação REAL da fase da Usuária (UF7) contra o `PacienteProfileController`
 * (`@RequestMapping("/usuaria")` — FORA de `/api/v1`; toda chamada exige
 * `{ absolute: true }`, ver o rewrite `/usuaria/:path*` no `next.config`).
 *
 * - `GET /usuaria/fase` → `{ faseAtual: Fase | null, fasesDisponiveis: Fase[] }`
 *   (chaves LITERAIS do `Map` do controller; `fasesDisponiveis = findByAtivaTrue()`).
 *   Resolve a lacuna de "listar fases ativas" — não depende mais do `/feed`.
 * - `PATCH /usuaria/fase { faseId }` → 200/`Void`.
 */
interface MinhaFaseApi {
  faseAtual: FaseApi | null
  fasesDisponiveis: FaseApi[] | null
}

function faseStub(id: string): Fase {
  return { id, nome: '', descricao: '', ordem: 0, ativa: true, tags: [] }
}

export class ApiFaseUsuariaService implements FaseUsuariaService {
  async getMinhaFase(): Promise<MinhaFase> {
    const data = await api.get<MinhaFaseApi>('/usuaria/fase', { absolute: true })
    return {
      atual: data.faseAtual ? faseFromApi(data.faseAtual) : null,
      disponiveis: (data.fasesDisponiveis ?? []).map(faseFromApi),
    }
  }

  async trocarFase(faseId: string): Promise<Fase> {
    await api.patch('/usuaria/fase', { faseId }, { absolute: true, responseType: 'void' })
    // O PATCH devolve `Void`; relê `/usuaria/fase` para retornar a fase completa.
    const { atual, disponiveis } = await this.getMinhaFase()
    return disponiveis.find((f) => f.id === faseId) ?? atual ?? faseStub(faseId)
  }
}
