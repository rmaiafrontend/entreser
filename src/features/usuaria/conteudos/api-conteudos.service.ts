import { api, isApiError } from '@/lib/http'
import { formatoToApi, type ConteudoApi } from '@/features/admin/conteudos/adapter'
import { conteudoDetalheFromApi, conteudoResumoFromApi, type ConteudoByIdApi } from './adapter'
import type { ConteudosUsuariaService } from './service'
import type { ConteudoDetalhe, ConteudoResumo, ListarParams } from './types'

/**
 * Implementação REAL dos conteúdos da Usuária (M05):
 * - `GET /conteudos/:id` → envelope `{ conteudo, progresso }` (leitor UF6);
 * - `GET /conteudos/buscar?q=` e `GET /conteudos?tag=` → `List<Conteudo>` cru
 *   (busca UF3 / navegação por tag UF4 — `formato` é filtrado no cliente, ver
 *   `use-explorar`, pois o backend ignora o param);
 * - `POST /conteudos/:id/progresso { concluido }` (progresso binário UF6).
 */
export class ApiConteudosUsuariaService implements ConteudosUsuariaService {
  async getById(id: string): Promise<ConteudoDetalhe | null> {
    try {
      const res = await api.get<ConteudoByIdApi>(`/conteudos/${id}`)
      return conteudoDetalheFromApi(res)
    } catch (e) {
      if (isApiError(e, 'not_found')) return null
      throw e
    }
  }

  async buscar(q: string): Promise<ConteudoResumo[]> {
    const data = await api.get<ConteudoApi[]>(`/conteudos/buscar?q=${encodeURIComponent(q)}`)
    return Array.isArray(data) ? data.map(conteudoResumoFromApi) : []
  }

  async listar({ tag, formato }: ListarParams): Promise<ConteudoResumo[]> {
    const q = new URLSearchParams()
    if (tag) q.set('tag', tag)
    // O backend ignora `formato` (só filtra por `tag`); `use-explorar` refiltra no cliente.
    if (formato) q.set('formato', formatoToApi(formato))
    const qs = q.toString()
    const data = await api.get<ConteudoApi[]>(`/conteudos${qs ? `?${qs}` : ''}`)
    return Array.isArray(data) ? data.map(conteudoResumoFromApi) : []
  }

  async setProgresso(id: string, concluido: boolean): Promise<void> {
    await api.post(`/conteudos/${id}/progresso`, { concluido }, { responseType: 'void' })
  }
}
