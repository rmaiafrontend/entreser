/**
 * Seam do serviço de Equipe. A UI (`use-equipe`) importa `equipeService` daqui e
 * não sabe se fala com a API ou com o mock.
 * Ativo: `ApiEquipeService` (backend real). Fallback offline: `mockEquipeService`.
 */
import { ApiEquipeService } from './api-equipe.service'
import type { EquipeService } from './service'
// import { mockEquipeService } from './service' // ← fallback offline (sem backend)

export const equipeService: EquipeService = new ApiEquipeService()
// export const equipeService: EquipeService = mockEquipeService

export { EmailJaCadastradoError } from './service'
export type { EquipeService } from './service'
