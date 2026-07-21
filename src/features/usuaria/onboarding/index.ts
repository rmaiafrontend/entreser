/**
 * Seam do onboarding da Usuária. ATIVO: `ApiOnboardingUsuariaService`.
 *
 * A fase é inferida no servidor: `POST /onboarding/respostas` (lista completa)
 * dispara ALGO-FASE e persiste a fase; `finalizar` a lê em `GET /usuaria/fase`
 * (`faseAtual`). NÃO existe `POST /onboarding/finalizar` — por decisão. O handoff
 * onboarding→feed passa pelo backend (não pelo `fase-store`), então feed e fase
 * também devem estar na API. Volte para `mockOnboardingUsuariaService` sem backend.
 */
import { ApiOnboardingUsuariaService } from './api-onboarding.service'
import type { OnboardingUsuariaService } from './service'
// import { mockOnboardingUsuariaService } from './service' // ← usar sem backend

export const onboardingUsuariaService: OnboardingUsuariaService = new ApiOnboardingUsuariaService()
// export const onboardingUsuariaService: OnboardingUsuariaService = mockOnboardingUsuariaService

export type { OnboardingUsuariaService } from './service'
