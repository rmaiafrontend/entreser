/**
 * Persistência local da "fase atual" da usuária no modo mock — compartilhada
 * entre o slice de fase (leitura/troca manual) e o de onboarding (que grava a
 * fase inferida ao finalizar). Trocável pelo backend real (`/usuaria/fase`) ao
 * virar os seams; enquanto isso mantém o fluxo onboarding → feed demoável.
 */
const KEY = 'usuaria:fase-atual'

export function readFaseAtualId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function writeFaseAtualId(id: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, id)
  } catch {
    /* localStorage indisponível — ignora */
  }
}
