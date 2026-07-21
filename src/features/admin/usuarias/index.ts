/**
 * Seam do serviço de Usuárias (Fase 2). A UI importa `usuariasService` daqui.
 * Ativo: `ApiUsuariasService` (`GET /pacientes`). Fallback offline: `mockUsuariasService`.
 */
import { ApiUsuariasService } from './api-usuarias.service'
import type { UsuariasService } from './service'
// import { mockUsuariasService } from './service' // ← fallback offline

export const usuariasService: UsuariasService = new ApiUsuariasService()

export type { UsuariasService } from './service'
