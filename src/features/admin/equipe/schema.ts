import { z } from 'zod'

const NOME_REGEX = /^[A-Za-zÀ-ÿ'’\- ]+$/

/**
 * Schema do formulário de membro da equipe. Recebe os e-mails já cadastrados na
 * plataforma (equipe + profissionais) para checar unicidade.
 */
export function equipeSchema(existingEmails: string[]) {
  const taken = new Set(existingEmails.map((e) => e.trim().toLowerCase()))
  return z
    .object({
      nome: z
        .string()
        .trim()
        .min(2, 'Informe o nome completo (mín. 2 letras).')
        .max(100, 'No máximo 100 caracteres.')
        .regex(NOME_REGEX, 'Use apenas letras, espaços, hífen e apóstrofo.'),
      email: z.string().trim().min(1, 'Informe o e-mail.').email('Informe um e-mail válido.'),
    })
    .refine((d) => !taken.has(d.email.trim().toLowerCase()), {
      message: 'Este e-mail já está cadastrado na plataforma.',
      path: ['email'],
    })
}

export type EquipeFormValues = z.infer<ReturnType<typeof equipeSchema>>
