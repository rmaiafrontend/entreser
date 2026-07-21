/** Situação do convite de primeiro acesso da profissional. */
export type ConviteStatus = 'ativo' | 'pendente' | 'expirado'

/** Psicóloga que atende na plataforma (spec M01 · Profissional). */
export interface Profissional {
  id: string
  nome: string
  email: string
  /** Só dígitos (DDD + número). */
  telefone: string
  crp: string
  abordagem: string
  ativa: boolean
  convite: ConviteStatus
  /** ISO (YYYY-MM-DD) enquanto o convite estiver pendente/expirado; senão null. */
  conviteExpiraEm: string | null
  /** ISO (YYYY-MM-DD). */
  criadaEm: string
  criadaPor: string
  /** Bio pública — gerida pela própria profissional; somente leitura aqui. */
  bio: string
}

/** Campos editáveis no formulário de cadastro/edição. */
export interface ProfissionalInput {
  nome: string
  email: string
  /** Só dígitos. */
  telefone: string
  crp: string
  abordagem: string
}
