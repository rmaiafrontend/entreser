import type { Fase } from './types'

/** Tag aninhada dentro de uma Fase do backend (desde 14/jul). */
interface FaseTagApi {
  id: string
  nome?: string
}

/** Fase como o backend devolve (`GET /admin/fases[/{id}]`). Desde 14/jul traz `tags[]`. */
export interface FaseApi {
  id: string
  nome: string
  descricao: string | null
  ordem: number
  ativa: boolean
  criadaEm?: string
  tags?: FaseTagApi[] | null
}

/** Corpo de `POST`/`PATCH /admin/fases` — só metadados. Tags via `PUT /{id}/tags`. */
export interface FaseRequest {
  nome: string
  descricao: string
  ordem: number
  ativa: boolean
}

/**
 * Backend → domínio. Desde 14/jul o GET traz `tags[]` embutido (objetos `Tag`);
 * o domínio guarda só os ids (a UI resolve id→nome via `useTagOptions`).
 */
export function faseFromApi(f: FaseApi): Fase {
  return {
    id: f.id,
    nome: f.nome,
    descricao: f.descricao ?? '',
    ordem: f.ordem,
    ativa: f.ativa,
    tags: (f.tags ?? []).map((t) => t.id),
  }
}

/** Domínio → corpo do request (só metadados). */
export function faseToRequest(input: {
  nome: string
  descricao: string
  ordem: number
  ativa: boolean
}): FaseRequest {
  return {
    nome: input.nome.trim(),
    descricao: input.descricao,
    ordem: input.ordem,
    ativa: input.ativa,
  }
}
