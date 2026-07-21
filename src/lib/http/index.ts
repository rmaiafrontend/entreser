/**
 * Camada HTTP compartilhada (Fase 0 da integração backend).
 *
 * Ponto único de import para telas e serviços: `@/lib/http`. Consumido pelo
 * futuro `ApiAuthService` (Fase 1) e por cada `ApiXService` do backoffice.
 */

export {
  api,
  request,
  refreshSession,
  onSessionExpired,
} from './client'
export type { HttpMethod, RequestOptions, ResponseType } from './client'

export { ApiError, isApiError, kindFromStatus } from './errors'
export type { ApiErrorInit, ApiErrorKind } from './errors'

export {
  clearAccessToken,
  getAccessToken,
  getAccessTokenClaims,
  getAccessTokenExpiry,
  hasAccessToken,
  isAccessTokenExpired,
  setAccessToken,
} from './token-store'
