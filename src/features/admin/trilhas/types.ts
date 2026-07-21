/** Trilha (M05): curadoria ordenada de conteúdos que a usuária percorre. */
export interface Trilha {
  id: string
  titulo: string
  descricao: string
  publicada: boolean
  /** Data URL da capa (opcional). */
  thumb: string | null
  /** Ids de conteúdo, na ordem da sequência sugerida. Vazio na LISTA (só o by-id popula). */
  conteudos: string[]
  /**
   * Contagem de conteúdos vinda do DTO da lista (14/jul) — evita o N+1 de by-id só
   * para exibir "N conteúdos" nos cards. No by-id (que traz os ids) reflete
   * `conteudos.length`; consumidores usam `totalConteudos ?? conteudos.length`.
   */
  totalConteudos?: number
  criadaEm: string
  publicadaEm: string | null
}

export interface TrilhaInput {
  titulo: string
  descricao: string
  thumb: string | null
  conteudos: string[]
  publicada: boolean
}
