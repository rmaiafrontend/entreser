/**
 * Seam do serviço de Fases (Fase 2). A UI importa `fasesService` daqui.
 * Ativo: `ApiFasesService` (backend real). Fallback offline: `mockFasesService`.
 */
import { ApiFasesService } from './api-fases.service'
import type { FasesService } from './service'
// import { mockFasesService } from './service' // ← fallback offline

export const fasesService: FasesService = new ApiFasesService()

export type { FasesService } from './service'
