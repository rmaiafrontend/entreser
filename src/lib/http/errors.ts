/**
 * Erro genérico da camada HTTP.
 *
 * O backend NÃO tem envelope de erro (guia §5.2): a resposta pode ser string
 * crua, corpo vazio, JSON ad-hoc ou o default do Spring. O cliente normaliza
 * tudo em `ApiError`, classificando por `kind` (derivado do status HTTP). Os
 * adaptadores de feature (ex.: `ApiAuthService`) traduzem `ApiError` → erro de
 * domínio (ex.: `AuthError`) quando precisam de códigos estáveis para a UI.
 */

export type ApiErrorKind =
  | 'bad_request'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'rate_limited'
  | 'server'
  | 'network'
  | 'unknown'

export interface ApiErrorInit {
  status: number
  kind: ApiErrorKind
  message: string
  /** corpo cru da resposta (texto), útil para body-sniffing na tradução. */
  bodyText: string
  /** corpo parseado como JSON quando aplicável (ad-hoc do Spring, etc.). */
  body?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly kind: ApiErrorKind
  readonly bodyText: string
  readonly body?: unknown

  constructor(init: ApiErrorInit) {
    super(init.message)
    this.name = 'ApiError'
    this.status = init.status
    this.kind = init.kind
    this.bodyText = init.bodyText
    this.body = init.body
  }
}

/** Classifica o status HTTP num `kind`. Status 0 = falha de rede/CORS. */
export function kindFromStatus(status: number): ApiErrorKind {
  switch (status) {
    case 0:
      return 'network'
    case 400:
      return 'bad_request'
    case 401:
      return 'unauthorized'
    case 403:
      return 'forbidden'
    case 404:
      return 'not_found'
    case 409:
      return 'conflict'
    case 429:
      return 'rate_limited'
    default:
      return status >= 500 ? 'server' : 'unknown'
  }
}

export function isApiError(erro: unknown, kind?: ApiErrorKind): erro is ApiError {
  return erro instanceof ApiError && (kind === undefined || erro.kind === kind)
}
