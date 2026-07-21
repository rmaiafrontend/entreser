/** Fase do ciclo (M05). Agrega tags que orientam o feed e a inferência. */
export interface Fase {
  id: string
  nome: string
  descricao: string
  ordem: number
  ativa: boolean
  /** Ids das tags atreladas. */
  tags: string[]
}

export interface FaseInput {
  nome: string
  descricao: string
  ordem: number
  ativa: boolean
  tags: string[]
}
