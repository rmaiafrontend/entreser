import { SEED_TAGS } from '@/features/admin/tags/seed'

/**
 * Vocabulário de tags para a Usuária, derivado do mesmo seed do backoffice.
 * A Usuária vê nomes; o domínio guarda ids. Não há endpoint público de tags na
 * spec (UF4) — os chips de navegação saem daqui / das tags já embutidas no feed.
 */
const NOME_POR_ID = new Map(SEED_TAGS.map((t) => [t.id, t.nome]))

export function tagNome(id: string): string {
  return NOME_POR_ID.get(id) ?? id
}

export function tagNomes(ids: string[]): string[] {
  return ids.map(tagNome)
}

/** Todas as tags (id + nome) para os chips da aba Explorar. */
export const ALL_TAGS: { id: string; nome: string }[] = SEED_TAGS.map((t) => ({ id: t.id, nome: t.nome }))
