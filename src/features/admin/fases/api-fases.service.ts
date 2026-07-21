import { api } from '@/lib/http'
import { faseFromApi, faseToRequest, type FaseApi } from './adapter'
import type { FasesService } from './service'
import type { Fase, FaseInput } from './types'

/**
 * Implementação REAL do `FasesService` contra o backend (`/api/v1/admin/fases`).
 *
 * Particularidades (14/jul):
 * - o GET agora retorna `tags[]` embutido → a edição pré-preenche as tags reais e
 *   `update` passa a PERSISTI-las via `PUT /{id}/tags` (substitui o conjunto);
 * - reorder transacional via `PUT /admin/fases/ordem` (ver `reorder`).
 */
const BASE = '/admin/fases'

export class ApiFasesService implements FasesService {
  async getAll(): Promise<Fase[]> {
    const data = await api.get<FaseApi[]>(BASE)
    return Array.isArray(data) ? data.map(faseFromApi) : []
  }

  async add(input: FaseInput): Promise<Fase> {
    const f = await api.post<FaseApi>(BASE, faseToRequest(input))
    const fase = faseFromApi(f)
    if (input.tags.length) {
      await api.put<void>(`${BASE}/${fase.id}/tags`, input.tags, { responseType: 'void' })
    }
    return { ...fase, tags: [...input.tags] }
  }

  async update(id: string, input: FaseInput): Promise<Fase> {
    const f = await api.patch<FaseApi>(`${BASE}/${id}`, faseToRequest(input))
    // Persiste as tags (agora legíveis): PUT substitui o conjunto inteiro — envia
    // sempre, inclusive vazio, para refletir remoções feitas na edição.
    await api.put<void>(`${BASE}/${id}/tags`, input.tags, { responseType: 'void' })
    return { ...faseFromApi(f), tags: [...input.tags] }
  }

  async reorder(orderedIds: string[]): Promise<void> {
    // Reorder transacional (§ resposta B-3.2): backend reatribui `ordem` a partir
    // da lista completa de ids numa transação — sem colisão de UNIQUE(ordem).
    await api.put(`${BASE}/ordem`, orderedIds, { responseType: 'void' })
  }
}
