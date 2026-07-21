/** Opção de resposta de uma pergunta do onboarding. */
export interface Opcao {
  id: string
  texto: string
  ordem: number
  /** Peso (0–10) por fase: faseId → peso. */
  mapa: Record<string, number>
}

/** Pergunta do questionário de triagem (M05). */
export interface Pergunta {
  id: string
  texto: string
  ordem: number
  ativa: boolean
  /** Opções completas (com mapa). VAZIO na LISTA — só o by-id/`getAllFull` popula. */
  opcoes: Opcao[]
  /**
   * Contagem de opções vinda do DTO da lista (14/jul), sem hidratar por-id.
   * Ausente no by-id (que traz `opcoes`); consumidores usam `?? opcoes.length`.
   */
  totalOpcoes?: number
  /** `true` = todas as opções mapeadas (DTO da lista). Ausente no by-id → deriva de `opcoes`. */
  temMapeamento?: boolean
}

export interface PerguntaInput {
  texto: string
  ordem: number
  ativa: boolean
}

export interface OpcaoInput {
  texto: string
  ordem: number
}
