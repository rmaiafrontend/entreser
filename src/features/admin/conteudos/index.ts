/**
 * Seam do serviço de Conteúdos (Fase 2). A UI importa `conteudosService` daqui.
 * Ativo: `ApiConteudosService` (backend real). Fallback offline: `mockConteudosService`.
 */
import { ApiConteudosService } from './api-conteudos.service'
import type { ConteudosService } from './service'
// import { mockConteudosService } from './service' // ← fallback offline

export const conteudosService: ConteudosService = new ApiConteudosService()

export type { ConteudosService } from './service'
