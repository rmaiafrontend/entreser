/**
 * Suporte a "backend" mock do backoffice (frontend-only).
 *
 * Coleções persistidas em localStorage — seam trocável por chamadas HTTP reais
 * depois, sem mudar a UI. `delay` simula latência de rede para exibir estados
 * de carregamento nas ações (salvar, desativar, etc.).
 */

export const delay = (ms = 450): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

/** Lê uma coleção do localStorage; na primeira vez semeia com `seed`. */
export function loadCollection<T>(key: string, seed: T[]): T[] {
  if (typeof window === 'undefined') return clone(seed)
  try {
    const raw = window.localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T[]
    window.localStorage.setItem(key, JSON.stringify(seed))
  } catch {
    /* localStorage indisponível — cai no seed */
  }
  return clone(seed)
}

export function saveCollection<T>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(items))
  } catch {
    /* ignora persistência */
  }
}

/** Id opaco para novos registros do mock. */
export function genId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}
