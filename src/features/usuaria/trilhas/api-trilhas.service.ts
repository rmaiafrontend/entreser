import { api, isApiError } from '@/lib/http'
import {
  trilhaDetalheFromApi,
  trilhaResumoFromApi,
  type TrilhaDetalheApi,
  type TrilhaResumoApi,
} from './adapter'
import type { TrilhasUsuariaService } from './service'
import type { TrilhaDetalhe, TrilhaResumo } from './types'

/**
 * Implementação REAL das trilhas da Usuária: `GET /trilhas` (publicadas) e
 * `GET /trilhas/:id` (conteúdos ordenados + progresso). Ver plano §7.
 */
export class ApiTrilhasUsuariaService implements TrilhasUsuariaService {
  async getAll(): Promise<TrilhaResumo[]> {
    const data = await api.get<TrilhaResumoApi[]>('/trilhas')
    return Array.isArray(data) ? data.map(trilhaResumoFromApi) : []
  }

  async getById(id: string): Promise<TrilhaDetalhe | null> {
    try {
      const t = await api.get<TrilhaDetalheApi>(`/trilhas/${id}`)
      return trilhaDetalheFromApi(t)
    } catch (e) {
      if (isApiError(e, 'not_found')) return null
      throw e
    }
  }
}
