/** Membro da equipe interna (Admin Geral) com acesso ao backoffice. */
export interface EquipeMembro {
  id: string
  nome: string
  email: string
  ativa: boolean
  /** ISO (YYYY-MM-DD). */
  criadaEm: string
}

export interface EquipeInput {
  nome: string
  email: string
}
