/**
 * Store do access token — SÓ em memória, nunca em localStorage (guia §2.3).
 *
 * O JWT (~1h) vive aqui; o refresh token é um cookie HttpOnly que o JS não
 * acessa. Num reload, a memória é perdida de propósito: a sessão é reidratada
 * via `POST /auth/refresh` (ver `refreshSession` no cliente HTTP).
 */

let accessToken: string | null = null
/** epoch (ms) do claim `exp` do JWT; null quando não há token ou exp ilegível. */
let expiraEmMs: number | null = null

export function setAccessToken(token: string | null): void {
  accessToken = token
  expiraEmMs = token ? decodeExp(token) : null
}

export function getAccessToken(): string | null {
  return accessToken
}

export function clearAccessToken(): void {
  accessToken = null
  expiraEmMs = null
}

export function hasAccessToken(): boolean {
  return accessToken !== null
}

/**
 * `true` quando não há token ou o `exp` já passou (com folga `skewMs`). Se o
 * token não tiver `exp` legível, assume válido e deixa o 401 do servidor decidir.
 */
export function isAccessTokenExpired(skewMs = 5000): boolean {
  if (!accessToken) return true
  if (expiraEmMs === null) return false
  return Date.now() >= expiraEmMs - skewMs
}

/** epoch (ms) de expiração do token atual (claim `exp`), ou null. */
export function getAccessTokenExpiry(): number | null {
  return expiraEmMs
}

/** Claims decodificados do token atual (ex.: `sub`, `email`), ou null. */
export function getAccessTokenClaims(): Record<string, unknown> | null {
  return accessToken ? decodeClaims(accessToken) : null
}

function decodeClaims(jwt: string): Record<string, unknown> | null {
  const parts = jwt.split('.')
  if (parts.length < 2) return null
  try {
    return JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>
  } catch {
    return null
  }
}

function decodeExp(jwt: string): number | null {
  const exp = decodeClaims(jwt)?.exp
  return typeof exp === 'number' ? exp * 1000 : null
}

function base64UrlDecode(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4 === 0 ? 0 : 4 - (b64.length % 4)
  const padded = b64 + '='.repeat(pad)
  if (typeof atob === 'function') return atob(padded)
  // Fallback SSR (Node) — atob existe no Node moderno, mas por garantia:
  return Buffer.from(padded, 'base64').toString('binary')
}
