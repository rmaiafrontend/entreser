/** Opção de resposta apresentada à usuária — SEM pesos (a inferência é do backend). */
export interface OnbOpcao {
  id: string
  texto: string
  ordem: number
}

/** Pergunta do onboarding (UF1). */
export interface OnbPergunta {
  id: string
  texto: string
  ordem: number
  opcoes: OnbOpcao[]
}

/** Uma resposta escolhida (pergunta → opção). */
export interface RespostaEscolhida {
  perguntaId: string
  opcaoId: string
}

/** Resultado do onboarding: a fase inferida (ALGO-FASE). */
export interface OnbResultado {
  fase: { id: string; nome: string } | null
}
