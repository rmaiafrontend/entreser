/**
 * Seam do serviço de Trilhas (Fase 2). A UI importa `trilhasService` daqui.
 * Ativo: `ApiTrilhasService` (backend real). Fallback offline: `mockTrilhasService`.
 */
import { ApiTrilhasService } from './api-trilhas.service'
import type { TrilhasService } from './service'
// import { mockTrilhasService } from './service' // ← fallback offline

export const trilhasService: TrilhasService = new ApiTrilhasService()

export type { TrilhasService } from './service'
