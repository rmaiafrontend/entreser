'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../context/auth-context'
import { useGoogleSignIn } from '../hooks/use-google-sign-in'
import { isAuthError, mensagemDoErro } from '../lib/errors'
import { signInSchema, type SignInInput } from '../schemas/auth.schema'
import { AuthDivider } from './auth-divider'
import { AuthField } from './auth-field'
import { AuthSubmit } from './auth-submit'
import { FormMessage } from './form-message'
import { GoogleButton } from './google-button'
import { IconLock, IconMail } from './icons'

export function LoginForm() {
  const router = useRouter()
  const { signIn } = useAuth()
  const google = useGoogleSignIn()
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', senha: '' },
  })

  async function onSubmit(values: SignInInput) {
    setErroGeral(null)
    try {
      await signIn(values)
      router.push('/home')
    } catch (e) {
      // Conta não confirmada → leva à tela de confirmação (F3).
      if (isAuthError(e, 'EMAIL_NAO_CONFIRMADO')) {
        router.push(`/confirmar-email?email=${encodeURIComponent(values.email)}`)
        return
      }
      setErroGeral(mensagemDoErro(e))
    }
  }

  const erro = erroGeral ?? google.error

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {erro && <FormMessage>{erro}</FormMessage>}

      <AuthField
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="maria@email.com"
        icon={<IconMail />}
        error={errors.email?.message}
        {...register('email')}
      />

      <div>
        <AuthField
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          icon={<IconLock />}
          error={errors.senha?.message}
          {...register('senha')}
        />
        <div className="mt-2 flex justify-end">
          <Link
            href={`/recuperar-senha?email=${encodeURIComponent(getValues('email'))}`}
            className="text-xs text-cream/40 transition-colors hover:text-cream/70"
          >
            Esqueci minha senha
          </Link>
        </div>
      </div>

      <AuthSubmit isLoading={isSubmitting}>Entrar</AuthSubmit>

      <AuthDivider />

      <GoogleButton onClick={google.signInComGoogle} isLoading={google.isLoading} />
    </form>
  )
}
