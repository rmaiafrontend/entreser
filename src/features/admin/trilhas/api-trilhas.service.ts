import { api, isApiError } from '@/lib/http'
import { sortByText } from '@/features/admin/lib/sort'
import { trilhaFromApi, trilhaToRequest, type TrilhaApi } from './adapter'
import type { TrilhasService } from './service'
import type { Trilha, TrilhaInput } from './types'

/**
 * Implementação REAL do `TrilhasService` contra o backend (`/api/v1/admin/trilhas`).
 *
 * Curadoria: no `POST` (criação) a lista `conteudosOrdenados` vai no corpo e o
 * backend a persiste. Mas o `PATCH /{id}` (edição) **ignora** esse campo — só
 * atualiza título/descrição/capa/publicação (confirmado no código do backend,
 * `TrilhaAdminController.updateTrilha`). Por isso a EDIÇÃO grava a curadoria pelo
 * endpoint dedicado `PUT /{id}/conteudos` (replace-all ordenado, 204). Sem isso,
 * editar a curadoria de uma trilha existente era descartado em silêncio.
 */
const BASE = '/admin/trilhas'

export class ApiTrilhasService implements TrilhasService {
  async getAll(): Promise<Trilha[]> {
    const list = await api.get<TrilhaApi[]>(BASE)
    if (!Array.isArray(list)) return []
    // A lista traz `totalConteudos` (14/jul) — não é mais preciso hidratar cada
    // trilha por by-id só para a contagem do card (N+1 eliminado). `conteudos`
    // continua vazio na lista; só o by-id popula os ids (usado no form de edição).
    // ES-018: ordenação estável no cliente (a API já ordena, mas garantimos).
    return sortByText(list.map(trilhaFromApi), (t) => t.titulo)
  }

  async getById(id: string): Promise<Trilha | null> {
    try {
      const t = await api.get<TrilhaApi>(`${BASE}/${id}`)
      return t?.id ? trilhaFromApi(t) : null
    } catch (erro) {
      if (isApiError(erro, 'not_found')) return null
      throw erro
    }
  }

  async add(input: TrilhaInput): Promise<Trilha> {
    const t = await api.post<TrilhaApi>(BASE, trilhaToRequest(input))
    return trilhaFromApi(t)
  }

  async update(id: string, input: TrilhaInput): Promise<Trilha> {
    const req = trilhaToRequest(input)
    // 1) metadados (o PATCH ignora a curadoria)
    const t = await api.patch<TrilhaApi>(`${BASE}/${id}`, req)
    // 2) curadoria: replace-all ordenado no endpoint dedicado (204 No Content)
    await api.put(`${BASE}/${id}/conteudos`, req.conteudosOrdenados, { responseType: 'void' })
    return trilhaFromApi(t)
  }
}
