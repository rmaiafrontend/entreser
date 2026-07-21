import { z } from 'zod'

/**
 * Schemas de validação compartilhados pelas telas de auth.
 *
 * Uma única fonte de regras (senha, telefone BR, idade mínima, etc.) para que,
 * quando o backend real entrar, ele reutilize exatamente os mesmos schemas —
 * cliente e servidor nunca divergem.
 *
 * As regras seguem a seção "Regras de validação" da spec M01.
 */

// ── Helpers de data ───────────────────────────────────────────────
function idadeEmAnos(iso: string): number {
  const nascimento = new Date(`${iso}T00:00:00`)
  const hoje = new Date()
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mes = hoje.getMonth() - nascimento.getMonth()
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  return idade
}

function ehDataFutura(iso: string): boolean {
  return new Date(`${iso}T00:00:00`) > new Date()
}

/** Remove tudo que não é dígito (usado para normalizar telefone). */
export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '')
}

// ── Campos reutilizáveis ──────────────────────────────────────────
const NOME_REGEX = /^[A-Za-zÀ-ÿ'’\- ]+$/
const SENHA_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/

export const nomeSchema = z
  .string()
  .trim()
  .min(2, 'Informe ao menos 2 caracteres.')
  .max(100, 'No máximo 100 caracteres.')
  .regex(NOME_REGEX, 'Use apenas letras, espaços, hífen e apóstrofo.')

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Informe seu e-mail.')
  .email('Informe um e-mail válido.')
  .max(255, 'E-mail muito longo.')

export const senhaSchema = z
  .string()
  .min(8, 'A senha precisa de pelo menos 8 caracteres.')
  .regex(SENHA_REGEX, 'Inclua maiúscula, minúscula e número.')

export const telefoneSchema = z
  .string()
  .min(1, 'Informe seu telefone.')
  .refine((v) => {
    const d = apenasDigitos(v)
    return d.length === 10 || d.length === 11
  }, 'Informe um telefone com DDD, ex: (83) 99999-9999.')

export const dataNascimentoSchema = z
  .string()
  .min(1, 'Informe sua data de nascimento.')
  .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), 'Data inválida.')
  .refine((v) => !ehDataFutura(v), 'A data não pode estar no futuro.')
  .refine((v) => idadeEmAnos(v) >= 18, 'É necessário ter pelo menos 18 anos.')

const aceiteTermosSchema = z
  .boolean()
  .refine((v) => v === true, 'Aceite os Termos para continuar.')

// ── Schemas compostos (um por formulário) ─────────────────────────

/** F4 — Login com e-mail e senha. */
export const signInSchema = z.object({
  email: emailSchema,
  senha: z.string().min(1, 'Informe sua senha.'),
})

/** F1 — Cadastro da Usuária via e-mail e senha. */
export const signUpSchema = z
  .object({
    nome: nomeSchema,
    email: emailSchema,
    telefone: telefoneSchema,
    dataNascimento: dataNascimentoSchema,
    senha: senhaSchema,
    confirmarSenha: z.string().min(1, 'Confirme sua senha.'),
    aceitaTermos: aceiteTermosSchema,
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  })

/** F6 — Solicitação de recuperação de senha. */
export const recuperarSenhaSchema = z.object({
  email: emailSchema,
})

/** F7 — Redefinição de senha via token. */
export const redefinirSenhaSchema = z
  .object({
    senha: senhaSchema,
    confirmarSenha: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  })

/** F2 — Dados complementares após cadastro via Google. */
export const completarCadastroSchema = z.object({
  telefone: telefoneSchema,
  dataNascimento: dataNascimentoSchema,
  aceitaTermos: aceiteTermosSchema,
})

// ── Tipos inferidos (entrada dos formulários) ─────────────────────
export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type RecuperarSenhaInput = z.infer<typeof recuperarSenhaSchema>
export type RedefinirSenhaInput = z.infer<typeof redefinirSenhaSchema>
export type CompletarCadastroInput = z.infer<typeof completarCadastroSchema>
