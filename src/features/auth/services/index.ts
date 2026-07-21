import { ApiAuthService } from './api-auth.service'
import type { AuthService } from './auth.service'
// Mock frontend-only (dev sem backend): reative este import para voltar a ele.
// import { MockAuthService } from './mock-auth.service'

export type {
  AuthService,
  GoogleSignInResult,
  RecuperarSenhaResult,
  SignUpResult,
} from './auth.service'

/**
 * Implementação ativa do AuthService — ÚNICO ponto a trocar mock ↔ backend.
 *
 * Fase 1 da integração: `ApiAuthService` fala com o backend Spring Boot (JWT).
 * Nenhuma tela importa a implementação diretamente — só este símbolo. Para
 * voltar ao mock (dev sem backend), reative o import acima e troque por:
 *   export const authService = new MockAuthService()
 */
export const authService: AuthService = new ApiAuthService()
