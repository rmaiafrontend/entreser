import { api, isApiError } from '@/lib/http'
import { tagFromApi, type TagApi } from './adapter'
import { TagEmUsoError, type TagsService } from './service'
import type { TagItem } from './types'

/**
 * Implementação REAL do `TagsService` contra o backend (base `/api/v1/admin/tags`).
 *
 * Espelha o padrão do `ApiAuthService` (Fase 1): fala pelo `@/lib/http` e traduz
 * `ApiError` (heterogêneo, sem envelope — guia §5.2) em erro de domínio quando a
 * UI precisa reagir (aqui: `TagEmUsoError` no `DELETE` de tag vinculada).
 */
const BASE = '/admin/tags'

export class ApiTagsService implements TagsService {
  async getAll(): Promise<TagItem[]> {
    const data = await api.get<TagApi[]>(BASE)
    return Array.isArray(data) ? data.map(tagFromApi) : []
  }

  async add(nome: string): Promise<TagItem> {
    const nomeLimpo = nome.trim()
    const criada = await api.post<TagApi>(BASE, { nome: nomeLimpo })
    // POST pode devolver a entidade criada ou corpo vazio; cobrimos os dois.
    return criada?.id
      ? tagFromApi(criada)
      : { id: '', nome: nomeLimpo, usoConteudos: 0, usoFases: 0 }
  }

  async rename(id: string, nome: string): Promise<TagItem> {
    const nomeLimpo = nome.trim()
    const atualizada = await api.patch<TagApi>(`${BASE}/${id}`, { nome: nomeLimpo })
    return atualizada?.id
      ? tagFromApi(atualizada)
      : { id, nome: nomeLimpo, usoConteudos: 0, usoFases: 0 }
  }

  async remove(id: string): Promise<void> {
    try {
      await api.delete<void>(`${BASE}/${id}`, { responseType: 'void' })
    } catch (erro) {
      // Contrato confirmado (backend, 16/jul): "tag em uso" chega como 409 — via
      // o `@ExceptionHandler(DataIntegrityViolationException)` global. O sniff do
      // corpo que existia aqui saiu de propósito: ele reportaria "em uso" para
      // QUALQUER erro cujo texto contivesse "uso"/"vínculo" (um 500 real, p.ex.),
      // afirmando com confiança algo falso. Sem 409, o erro sobe como erro.
      if (isApiError(erro, 'conflict')) throw new TagEmUsoError()
      throw erro
    }
  }
}
