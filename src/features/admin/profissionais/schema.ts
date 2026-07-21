import { z } from 'zod'
import { onlyDigits } from '@/features/admin/lib/format'
import type { Profissional } from './types'

const NOME_REGEX = /^[A-Za-zÀ-ÿ'’\- ]+$/
const CRP_REGEX = /^\d{2}\/\d{4,6}$/

/**
 * Schema do formulário de profissional. É uma fábrica porque as regras de
 * unicidade (e-mail/CRP) dependem da lista atual e do id em edição — assim a
 * validação (formato + duplicidade) fica centralizada no Zod e o mesmo schema
 * serve cliente e (futuro) servidor.
 */
export function profissionalSchema(existing: Profissional[], editingId?: string) {
  return z
    .object({
      nome: z
        .string()
        .trim()
        .min(2, 'Informe um nome válido (mín. 2 letras).')
        .max(100, 'No máximo 100 caracteres.')
        .regex(NOME_REGEX, 'Use apenas letras, espaços, hífen e apóstrofo.'),
      email: z
        .string()
        .trim()
        .min(1, 'Informe o e-mail.')
        .email('Informe um e-mail em formato válido.'),
      telefone: z
        .string()
        .refine((v) => {
          const d = onlyDigits(v)
          return d.length === 10 || d.length === 11
        }, 'Telefone inválido — use DDD + 8 ou 9 dígitos.'),
      crp: z
        .string()
        .trim()
        .regex(CRP_REGEX, 'CRP no formato NN/NNNNNN (ex.: 06/12345).'),
      abordagem: z
        .string()
        .trim()
        .min(1, 'Informe a abordagem.')
        .max(100, 'No máximo 100 caracteres.'),
    })
    .refine(
      (d) =>
        !existing.some(
          (p) => p.email.toLowerCase() === d.email.trim().toLowerCase() && p.id !== editingId,
        ),
      { message: 'Este e-mail já está cadastrado.', path: ['email'] },
    )
    .refine(
      (d) => !existing.some((p) => p.crp === d.crp.trim() && p.id !== editingId),
      { message: 'Este CRP já está cadastrado.', path: ['crp'] },
    )
}

export type ProfissionalFormValues = z.infer<ReturnType<typeof profissionalSchema>>
