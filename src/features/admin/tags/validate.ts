import type { TagItem } from './types'

/** Valida o nome de uma tag (2–50, único). Retorna '' quando ok. */
export function validateTagName(nome: string, items: TagItem[], ignoreId?: string): string {
  const v = nome.trim()
  if (v.length < 2 || v.length > 50) return 'O nome deve ter de 2 a 50 caracteres.'
  if (items.some((t) => t.nome.toLowerCase() === v.toLowerCase() && t.id !== ignoreId))
    return 'Já existe uma tag com este nome.'
  return ''
}

/** Uma tag está "em uso" se referenciada por conteúdos ou fases. */
export function tagEmUso(t: TagItem): boolean {
  return t.usoConteudos + t.usoFases > 0
}
