/**
 * Seam do serviço de Profissionais. A UI (`use-profissionais`) importa
 * `profissionaisService` daqui e não sabe se fala com a API ou com o mock.
 * Ativo: `ApiProfissionaisService` (backend real). Para trabalhar offline, troque
 * pela linha do `mockProfissionaisService`.
 */
import { ApiProfissionaisService } from './api-profissionais.service'
import type { ProfissionaisService } from './service'
// import { mockProfissionaisService } from './service' // ← fallback offline (sem backend)

export const profissionaisService: ProfissionaisService = new ApiProfissionaisService()
// export const profissionaisService: ProfissionaisService = mockProfissionaisService

export { EmailJaCadastradoError } from './service'
export type { ProfissionaisService } from './service'
