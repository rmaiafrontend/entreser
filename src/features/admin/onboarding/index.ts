/**
 * Seam do serviço de Onboarding (Fase 2). A UI importa `onboardingService` daqui.
 * Ativo: `ApiOnboardingService`. Fallback offline: `mockOnboardingService`.
 */
import { ApiOnboardingService } from './api-onboarding.service'
import type { OnboardingService } from './service'
// import { mockOnboardingService } from './service' // ← fallback offline

export const onboardingService: OnboardingService = new ApiOnboardingService()

export type { OnboardingService } from './service'
