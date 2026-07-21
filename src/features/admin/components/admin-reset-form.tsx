'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mensagemDoErro } from '@/features/auth/lib/errors'
import { redefinirSenhaSchema, type RedefinirSenhaInput } from '@/features/auth/schemas/auth.schema'
import { authService } from '@/features/auth/services'
import { AdminField } from './admin-field'
import { AdminFormMessage } from './admin-form-message'
import { AdminSubmit } from './admin-submit'

interface AdminResetFormProps {
  token?: string
}

/** F7 — redefinição de senha do admin via token. */
export function AdminResetForm({ token }: AdminResetFormProps) {
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
      await authService.adminRedefinirSenha(token, values)
      setConcluido(true)
    } catch (e) {
      setErroGeral(mensagemDoErro(e))
    }
  }

  if (concluido) {
    return (
      <div className="space-y-4">
        <AdminFormMessage tone="success">
          Senha redefinida com sucesso. Entre novamente com a nova senha.
        </AdminFormMessage>
        <Link
          href="/admin/login"
          className="block text-center text-sm font-medium text-mauve transition-colors hover:text-mauve-dark"
        >
          Ir para o login
        </Link>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="space-y-4">
        <AdminFormMessage>
          Link inválido ou ausente. Solicite uma nova recuperação de senha.
        </AdminFormMessage>
        <Link
          href="/admin/recuperar-senha"
          className="block text-center text-sm font-medium text-mauve transition-colors hover:text-mauve-dark"
        >
          Recuperar senha
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {erroGeral && <AdminFormMessage>{erroGeral}</AdminFormMessage>}

      <AdminField
        label="Nova senha"
        type="password"
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        error={errors.senha?.message}
        {...register('senha')}
      />

      <AdminField
        label="Confirmar nova senha"
        type="password"
        autoComplete="new-password"
        placeholder="Repita a nova senha"
        error={errors.confirmarSenha?.message}
        {...register('confirmarSenha')}
      />

      <AdminSubmit isLoading={isSubmitting}>Redefinir senha</AdminSubmit>
    </form>
  )
}
