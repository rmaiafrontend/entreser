import { delay } from '@/features/admin/lib/mock'
import { SEED_USUARIAS, type Plano, type UsuariaRow, type UsuariaStatus } from './data'

/** Parâmetros de listagem paginada/filtrada (server-side desde 14/jul). */
export interface UsuariaListParams {
  page: number
  size: number
  busca?: string
  status?: UsuariaStatus | ''
  plano?: Plano | ''
}

/** Página de resultados + metadados de paginação. */
export interface UsuariaListResult {
  rows: UsuariaRow[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

/**
 * Contrato do serviço de Usuárias (projeção read-only). Implementado pelo mock
 * (semente estática de `data.ts`) e pelo `ApiUsuariasService`
 * (`GET /pacientes` paginado). Filtro por `fase` não existe: o backend não expõe
 * o param (ver follow-up de pendências).
 */
export interface UsuariasService {
  list(params: UsuariaListParams): Promise<UsuariaListResult>
}

/** Implementação mock (semente estática, filtro/paginação em memória). */
export const mockUsuariasService: UsuariasService = {
  async list({ page, size, busca, status, plano }) {
    await delay(150)
    const q = (busca ?? '').trim().toLowerCase()
    const all = SEED_USUARIAS.filter((u) => {
      if (q && !`${u.nome} ${u.email}`.toLowerCase().includes(q)) return false
      if (status && u.status !== status) return false
      if (plano && u.plano !== plano) return false
      return true
    })
    const totalElements = all.length
    const totalPages = Math.max(1, Math.ceil(totalElements / size))
    const rows = all.slice(page * size, page * size + size)
    return { rows, totalElements, totalPages, page, size }
  },
}
