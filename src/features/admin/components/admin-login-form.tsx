'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mensagemDoErro } from '@/features/auth/lib/errors'
import { signInSchema, type SignInInput } from '@/features/auth/schemas/auth.schema'
import { useAdminAuth } from '../context/admin-auth-context'
import { AdminField } from './admin-field'
import { AdminFormMessage } from './admin-form-message'
import { AdminSubmit } from './admin-submit'

/** F4 — login do backoffice. */
export function AdminLoginForm() {
  const router = useRouter()
  const { signIn } = useAdminAuth()
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', senha: '' },
  })

  async function onSubmit(values: SignInInput) {
    setErroGeral(null)
    try {
      const result = await signIn(values)
      // F12 — senha provisória: precisa trocar antes de acessar o painel.
      if (result.tipo === 'trocar_senha') {
        router.push('/admin/primeiro-acesso')
        return
      }
      router.push('/admin')
    } catch (e) {
      setErroGeral(mensagemDoErro(e))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {erroGeral && <AdminFormMessage>{erroGeral}</AdminFormMessage>}

      <AdminField
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="voce@entreser.com.br"
        error={errors.email?.message}
        {...register('email')}
      />

      <div>
        <AdminField
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          error={errors.senha?.message}
          {...register('senha')}
        />
        <div className="mt-2 flex justify-end">
          <Link
            href="/admin/recuperar-senha"
            className="text-xs text-mauve transition-colors hover:text-mauve-dark"
          >
            Esqueci minha senha
          </Link>
        </div>
      </div>

      <AdminSubmit isLoading={isSubmitting}>Entrar</AdminSubmit>
    </form>
  )
}
