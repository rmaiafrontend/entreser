/**
 * Erros de autenticação padronizados.
 *
 * Segue o formato de erro da spec M01:
 *   { erro: { codigo, mensagem, campo } }
 *
 * As mensagens seguem o tom de voz do projeto (acolhedor, nunca burocrático)
 * e são exibidas direto na UI.
 */

export const AUTH_ERROR_CODES = [
  'DADOS_INVALIDOS',
  'EMAIL_JA_CADASTRADO',
  'CREDENCIAIS_INVALIDAS',
  'EMAIL_NAO_CONFIRMADO',
  'CONTA_INATIVA',
  'RATE_LIMITED',
  'TOKEN_NAO_ENCONTRADO',
  'TOKEN_EXPIRADO',
  'TOKEN_JA_USADO',
  'EMAIL_NAO_VERIFICADO_GOOGLE',
  'NAO_AUTENTICADO',
  'ERRO_INESPERADO',
] as const

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[number]

const MENSAGENS: Record<AuthErrorCode, string> = {
  DADOS_INVALIDOS: 'Confira os dados informados.',
  EMAIL_JA_CADASTRADO: 'Este e-mail já está cadastrado na plataforma.',
  CREDENCIAIS_INVALIDAS: 'E-mail ou senha incorretos.',
  EMAIL_NAO_CONFIRMADO: 'Confirme seu e-mail antes de entrar.',
  CONTA_INATIVA: 'Esta conta não está ativa no momento.',
  RATE_LIMITED: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  TOKEN_NAO_ENCONTRADO: 'Este link não é válido.',
  TOKEN_EXPIRADO: 'Este link expirou. Solicite um novo.',
  TOKEN_JA_USADO: 'Este link já foi utilizado.',
  EMAIL_NAO_VERIFICADO_GOOGLE: 'Não foi possível confirmar seu e-mail no Google.',
  NAO_AUTENTICADO: 'Você precisa entrar para continuar.',
  ERRO_INESPERADO: 'Algo deu errado. Tente novamente em instantes.',
}

/**
 * Erro de domínio do módulo de auth. Carrega um `codigo` estável (para lógica)
 * e, quando aplicável, o `campo` do formulário relacionado.
 */
export class AuthError extends Error {
  readonly codigo: AuthErrorCode
  readonly campo?: string

  constructor(codigo: AuthErrorCode, options?: { campo?: string; mensagem?: string }) {
    super(options?.mensagem ?? MENSAGENS[codigo])
    this.name = 'AuthError'
    this.codigo = codigo
    this.campo = options?.campo
  }
}

/** Extrai uma mensagem amigável de qualquer erro, com fallback seguro. */
export function mensagemDoErro(erro: unknown): string {
  if (erro instanceof AuthError) return erro.message
  return MENSAGENS.ERRO_INESPERADO
}

/** Type guard para checar o código de um erro de auth. */
export function isAuthError(erro: unknown, codigo?: AuthErrorCode): erro is AuthError {
  return erro instanceof AuthError && (codigo === undefined || erro.codigo === codigo)
}
