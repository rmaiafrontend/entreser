/**
 * Progresso de conteúdos no modo mock — conjunto de ids "concluídos" em
 * localStorage. Compartilhado por feed/conteúdos/trilhas para refletir o mesmo
 * estado de consumo (ProgressoConteudo.concluido, binário — M05). Trocável pelo
 * backend real (`POST /conteudos/:id/progresso`) ao virar os seams.
 */
const KEY = 'usuaria:progresso'

export function readConcluidos(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

export function isConcluido(id: string): boolean {
  return readConcluidos().has(id)
}

export function setConcluido(id: string, concluido: boolean): void {
  const set = readConcluidos()
  if (concluido) set.add(id)
  else set.delete(id)
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...set]))
  } catch {
    /* localStorage indisponível — ignora */
  }
}
