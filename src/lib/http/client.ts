/**
 * Cliente HTTP compartilhado — o "interceptor" que o Angular teria, reescrito
 * para o Next. Responsabilidades:
 *
 * - base URL de `NEXT_PUBLIC_API_URL` (same-origin via proxy do next.config);
 * - `credentials: 'include'` sempre, para o cookie de refresh HttpOnly viajar;
 * - injeção do `Authorization: Bearer <jwt>` a partir do token em memória;
 * - retry único em 401 após `POST /auth/refresh` (uma refresh in-flight só);
 * - parsing tolerante: o backend não tem envelope e devolve string crua,
 *   boolean cru ou corpo vazio (guia §5.1/§5.2);
 * - normalização de erro em `ApiError`.
 */

import type { LoginResponse } from '@/lib/api/types'
import { ApiError, kindFromStatus } from './errors'
import { clearAccessToken, getAccessToken, setAccessToken } from './token-store'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '/api/v1').replace(/\/+$/, '')

export type ResponseType = 'json' | 'text' | 'boolean' | 'void'
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  /** como interpretar o corpo da resposta (default `json`). */
  responseType?: ResponseType
  /** anexa o Bearer e habilita o retry-on-401 (default `true`). */
  auth?: boolean
  /** envia o body como string JSON crua — ex.: `"ATIVO"` (guia §3.8/§5.1). */
  rawStringBody?: boolean
  /** trata `path` como caminho de origem verbatim (rotas legadas sem `/api/v1`). */
  absolute?: boolean
  /** sobrescreve o retry-on-401 (default: segue `auth`). */
  retryOn401?: boolean
  headers?: Record<string, string>
  signal?: AbortSignal
}

function buildUrl(path: string, absolute?: boolean): string {
  if (/^https?:\/\//.test(path)) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  return absolute ? clean : `${API_BASE}${clean}`
}

// ── refresh: uma única promise in-flight compartilhada ────────────────
let refreshPromise: Promise<LoginResponse | null> | null = null

/**
 * Reidrata a sessão via `POST /auth/refresh` (cookie automático). Retorna o
 * payload no formato do login (ou null se o refresh falhou). Usado tanto no
 * retry-on-401 quanto no bootstrap da sessão ao montar o app.
 */
export function refreshSession(): Promise<LoginResponse | null> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

async function performRefresh(): Promise<LoginResponse | null> {
  try {
    const res = await fetch(buildUrl('/auth/refresh'), {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) return failRefresh()
    const text = await res.text()
    const data = text ? (JSON.parse(text) as LoginResponse) : null
    if (data?.accessToken) {
      setAccessToken(data.accessToken)
      return data
    }
    return failRefresh()
  } catch {
    return failRefresh()
  }
}

function failRefresh(): null {
  clearAccessToken()
  notifySessionExpired()
  return null
}

// ── listeners de sessão expirada (o app registra um redirect) ─────────
type Listener = () => void
const listeners = new Set<Listener>()

export function onSessionExpired(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function notifySessionExpired(): void {
  for (const fn of listeners) {
    try {
      fn()
    } catch {
      /* um listener quebrado não deve derrubar os demais */
    }
  }
}

// ── request principal ─────────────────────────────────────────────────
export async function request<T = unknown>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const {
    method = 'GET',
    body,
    responseType = 'json',
    auth = true,
    rawStringBody = false,
    absolute = false,
    signal,
  } = opts
  const retryOn401 = opts.retryOn401 ?? auth

  const url = buildUrl(path, absolute)
  const headers: Record<string, string> = { ...opts.headers }
  const bodyInit = serializeBody(body, rawStringBody, headers)

  const applyAuthHeader = (): void => {
    if (!auth) return
    const token = getAccessToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
    else delete headers['Authorization']
  }
  applyAuthHeader()

  const send = (): Promise<Response> =>
    // `no-store`: API autenticada de admin — nunca queremos que o browser sirva
    // uma resposta em cache (ex.: listagem desatualizada logo após um PATCH).
    fetch(url, { method, headers, body: bodyInit, credentials: 'include', signal, cache: 'no-store' })

  let res: Response
  try {
    res = await send()
  } catch (erro) {
    if ((erro as Error)?.name === 'AbortError') throw erro
    throw new ApiError({
      status: 0,
      kind: 'network',
      message: 'Sem conexão com o servidor. Tente novamente.',
      bodyText: '',
    })
  }

  if (res.status === 401 && retryOn401) {
    const refreshed = await refreshSession()
    if (refreshed) {
      applyAuthHeader()
      res = await send()
    }
  }

  if (!res.ok) {
    throw toApiError(res.status, await safeText(res))
  }

  return parseBody<T>(res, responseType)
}

function serializeBody(
  body: unknown,
  rawStringBody: boolean,
  headers: Record<string, string>,
): BodyInit | undefined {
  if (body === undefined || body === null) return undefined
  if (typeof FormData !== 'undefined' && body instanceof FormData) return body
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'
  // rawStringBody: o backend espera `"ATIVO"` (string JSON crua) em alguns PATCH.
  return JSON.stringify(rawStringBody ? String(body) : body)
}

async function parseBody<T>(res: Response, responseType: ResponseType): Promise<T> {
  if (responseType === 'void') return undefined as T
  const text = await safeText(res)
  if (responseType === 'text') return text as unknown as T
  if (text.trim() === '') {
    // corpo vazio (204 / badRequest().body(null)).
    return (responseType === 'boolean' ? false : undefined) as T
  }
  if (responseType === 'boolean') return (text.trim() === 'true') as unknown as T
  try {
    return JSON.parse(text) as T
  } catch {
    // 200 com string crua onde se esperava JSON — devolve o texto sem quebrar.
    return text as unknown as T
  }
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text()
  } catch {
    return ''
  }
}

function toApiError(status: number, text: string): ApiError {
  const trimmed = text?.trim() ?? ''
  let parsed: unknown
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      parsed = JSON.parse(trimmed)
    } catch {
      /* corpo não-JSON (string crua ou vazio) */
    }
  }
  return new ApiError({
    status,
    kind: kindFromStatus(status),
    message: extractMessage(parsed, trimmed, status),
    bodyText: trimmed,
    body: parsed,
  })
}

function extractMessage(parsed: unknown, raw: string, status: number): string {
  if (parsed && typeof parsed === 'object') {
    const o = parsed as Record<string, unknown>
    if (typeof o.message === 'string' && o.message) return o.message
    if (typeof o.error === 'string' && o.error) return o.error
  }
  if (raw && !raw.startsWith('{') && !raw.startsWith('[')) return raw
  return mensagemPadrao(status)
}

function mensagemPadrao(status: number): string {
  if (status === 401) return 'Sessão expirada ou credenciais inválidas.'
  if (status === 403) return 'Você não tem acesso a este recurso.'
  if (status === 404) return 'Recurso não encontrado.'
  if (status === 429) return 'Muitas tentativas. Aguarde alguns minutos.'
  if (status >= 500) return 'O servidor encontrou um erro. Tente novamente.'
  return 'Não foi possível concluir a operação.'
}

/** Atalhos por verbo — açúcar sobre `request`. */
export const api = {
  get: <T>(path: string, opts?: RequestOptions): Promise<T> =>
    request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T> =>
    request<T>(path, { ...opts, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T> =>
    request<T>(path, { ...opts, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T> =>
    request<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: RequestOptions): Promise<T> =>
    request<T>(path, { ...opts, method: 'DELETE' }),
}
