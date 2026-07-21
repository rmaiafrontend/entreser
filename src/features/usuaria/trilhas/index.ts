/**
 * Seam das trilhas da Usuária. ATIVO: `ApiTrilhasUsuariaService` (`GET /trilhas` e
 * `GET /trilhas/:id`, conferidos contra o backend). Volte para `mockTrilhasUsuariaService`
 * se precisar rodar sem backend.
 */
import { ApiTrilhasUsuariaService } from './api-trilhas.service'
import type { TrilhasUsuariaService } from './service'
// import { mockTrilhasUsuariaService } from './service' // ← usar sem backend

export const trilhasUsuariaService: TrilhasUsuariaService = new ApiTrilhasUsuariaService()
// export const trilhasUsuariaService: TrilhasUsuariaService = mockTrilhasUsuariaService

export type { TrilhasUsuariaService } from './service'
