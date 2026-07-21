import { api, isApiError } from '@/lib/http'
import { conteudoFromApi, conteudoToRequest, type ConteudoApi } from './adapter'
import type { ConteudosService } from './service'
import type { Conteudo, ConteudoInput } from './types'

/**
 * Implementação REAL do `ConteudosService` contra o backend
 * (base `/api/v1/admin/conteudos`). Mesmo padrão de Tags/Fase 1.
 *
 * NOTA: `togglePublish` usa `PATCH` com o request completo e `publicado`
 * invertido (não há endpoint dedicado de publicação). `remove` faz `DELETE`,
 * que no backend é **soft delete** (marca `publicado=false`; o registro
 * permanece como rascunho) — não há hard delete disponível.
 */
const BASE = '/admin/conteudos'

export class ApiConteudosService implements ConteudosService {
  async getAll(): Promise<Conteudo[]> {
    const data = await api.get<ConteudoApi[]>(BASE)
    return Array.isArray(data) ? data.map(conteudoFromApi) : []
  }

  async getById(id: string): Promise<Conteudo | null> {
    try {
      const c = await api.get<ConteudoApi>(`${BASE}/${id}`)
      return c?.id ? conteudoFromApi(c) : null
    } catch (erro) {
      if (isApiError(erro, 'not_found')) return null
      throw erro
    }
  }

  async add(input: ConteudoInput): Promise<Conteudo> {
    const c = await api.post<ConteudoApi>(BASE, conteudoToRequest(input))
    return conteudoFromApi(c)
  }

  async update(id: string, input: ConteudoInput): Promise<Conteudo> {
    const c = await api.patch<ConteudoApi>(`${BASE}/${id}`, conteudoToRequest(input))
    return conteudoFromApi(c)
  }

  async togglePublish(conteudo: Conteudo): Promise<void> {
    // O `conteudo` recebido vem da LISTA, cujo DTO é enxuto (sem `corpoArtigo`,
    // `mediaUrl` nem `tags`). Como o PATCH exige o objeto completo, montá-lo a
    // partir do item da lista gravaria defaults vazios por cima do que está no
    // banco — publicar apagava o artigo, a mídia e as tags. Relemos o registro
    // pelo by-id, que traz tudo.
    const full = await this.getById(conteudo.id)
    if (!full) throw new Error('Conteúdo não encontrado.')
    const req = conteudoToRequest(full)
    req.publicado = !full.publicado
    await api.patch<ConteudoApi>(`${BASE}/${conteudo.id}`, req)
  }

  async remove(id: string): Promise<void> {
    await api.delete<void>(`${BASE}/${id}`, { responseType: 'void' })
  }
}
