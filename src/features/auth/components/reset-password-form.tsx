'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mensagemDoErro } from '../lib/errors'
import { redefinirSenhaSchema, type RedefinirSenhaInput } from '../schemas/auth.schema'
import { authService } from '../services'
import { AuthField } from './auth-field'
import { AuthSubmit } from './auth-submit'
import { FormMessage } from './form-message'
import { IconLock } from './icons'

interface ResetPasswordFormProps {
  token?: string
}

/** F7 — redefinição de senha via token. */
export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [concluido, setConcluido] = useState(false)
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RedefinirSenhaInput>({
    resolver: zodResolver(redefinirSenhaSchema),
    defaultValues: { senha: '', confirmarSenha: '' },
  })

  async function onSubmit(values: RedefinirSenhaInput) {
    setErroGeral(null)
    if (!token) {
      setErroGeral('Link inválido. Solicite uma nova recuperação de senha.')
      return
    }
    try {
      await authService.redefinirSenha(token, values)
      setConcluido(true)
    } catch (e) {
      setErroGeral(mensagemDoErro(e))
    }
  }

  if (concluido) {
    return (
      <div className="space-y-4">
        <FormMessage tone="success">
          Senha redefinida com sucesso. Por segurança, entre novamente com a nova
          senha.
        </FormMessage>
        <Link
          href="/login"
          className="block text-center text-sm font-medium text-cream transition-colors hover:text-cream/80"
        >
          Ir para o login
        </Link>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="space-y-4">
        <FormMessage>
          Link inválido ou ausente. Solicite uma nova recuperação de senha.
        </FormMessage>
        <Link
          href="/recuperar-senha"
          className="block text-center text-sm font-medium text-cream transition-colors hover:text-cream/80"
        >
          Recuperar senha
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {erroGeral && <FormMessage>{erroGeral}</FormMessage>}

      <AuthField
        label="Nova senha"
        type="password"
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        icon={<IconLock />}
        error={errors.senha?.message}
        {...register('senha')}
      />

      <AuthField
        label="Confirmar nova senha"
        type="password"
        autoComplete="new-password"
        placeholder="Repita a nova senha"
        icon={<IconLock />}
        error={errors.confirmarSenha?.message}
        {...register('confirmarSenha')}
      />

      <AuthSubmit isLoading={isSubmitting}>Redefinir senha</AuthSubmit>
    </form>
  )
}
