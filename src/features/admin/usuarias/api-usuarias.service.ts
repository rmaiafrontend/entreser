import { api } from '@/lib/http'
import {
  pacientePageToRows,
  planoFilterToApi,
  statusFilterToApi,
  type PacientePageApi,
} from './adapter'
import type { UsuariaListParams, UsuariaListResult, UsuariasService } from './service'

/**
 * Implementação REAL do `UsuariasService` contra o backend
 * (`GET /api/v1/pacientes`, paginado desde 14/jul). Read-only: o painel só
 * consulta. Busca/status/plano são server-side; `fase` não é filtrável (o
 * backend não expõe o param).
 */
export class ApiUsuariasService implements UsuariasService {
  async list({ page, size, busca, status, plano }: UsuariaListParams): Promise<UsuariaListResult> {
    const qs = new URLSearchParams()
    qs.set('page', String(page))
    qs.set('size', String(size))
    const q = busca?.trim()
    if (q) qs.set('busca', q)
    if (status) qs.set('status', statusFilterToApi(status))
    if (plano) qs.set('plano', planoFilterToApi(plano))
    const data = await api.get<PacientePageApi>(`/pacientes?${qs.toString()}`)
    return pacientePageToRows(data, page, size)
  }
}
