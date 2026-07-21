'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGoogleSignIn } from '../hooks/use-google-sign-in'
import { mensagemDoErro } from '../lib/errors'
import { signUpSchema, type SignUpInput } from '../schemas/auth.schema'
import { authService } from '../services'
import { AuthCheckbox } from './auth-checkbox'
import { AuthDivider } from './auth-divider'
import { AuthField } from './auth-field'
import { AuthSubmit } from './auth-submit'
import { BirthDateField } from './birth-date-field'
import { FormMessage } from './form-message'
import { GoogleButton } from './google-button'
import { IconLock, IconMail, IconShield, IconUser } from './icons'
import { PhoneField } from './phone-field'

export function SignupForm() {
  const router = useRouter()
  const google = useGoogleSignIn()
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      senha: '',
      confirmarSenha: '',
      aceitaTermos: false,
    },
  })

  async function onSubmit(values: SignUpInput) {
    setErroGeral(null)
    try {
      const { email, devConfirmToken } = await authService.signUp(values)
      const params = new URLSearchParams({ email })
      if (devConfirmToken) params.set('devToken', devConfirmToken)
      router.push(`/confirmar-email?${params.toString()}`)
    } catch (e) {
      setErroGeral(mensagemDoErro(e))
    }
  }

  const erro = erroGeral ?? google.error

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {erro && <FormMessage>{erro}</FormMessage>}

      <AuthField
        label="Nome"
        autoComplete="name"
        placeholder="Maria da Silva"
        icon={<IconUser />}
        error={errors.nome?.message}
        {...register('nome')}
      />

      <AuthField
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="maria@email.com"
        icon={<IconMail />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Controller
        control={control}
        name="telefone"
        render={({ field }) => (
          <PhoneField
            ref={field.ref}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.telefone?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="dataNascimento"
        render={({ field }) => (
          <BirthDateField
            label="Data de nascimento"
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.dataNascimento?.message}
          />
        )}
      />

      <AuthField
        label="Senha"
        type="password"
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        icon={<IconLock />}
        error={errors.senha?.message}
        {...register('senha')}
      />

      <AuthField
        label="Confirmar senha"
        type="password"
        autoComplete="new-password"
        placeholder="Repita sua senha"
        icon={<IconLock />}
        error={errors.confirmarSenha?.message}
        {...register('confirmarSenha')}
      />

      <div className="pt-1">
        <AuthCheckbox
          label={
            <>
              Aceito os{' '}
              <Link href="/termos" className="text-cream underline underline-offset-2">
                Termos de Uso
              </Link>{' '}
              e a{' '}
              <Link href="/privacidade" className="text-cream underline underline-offset-2">
                Política de Privacidade
              </Link>
            </>
          }
          error={errors.aceitaTermos?.message}
          {...register('aceitaTermos')}
        />
      </div>

      <AuthSubmit isLoading={isSubmitting}>Criar minha conta</AuthSubmit>

      <div className="flex items-center justify-center gap-1.5 pt-1">
        <IconShield className="text-cream/30" />
        <span className="text-[11px] text-cream/25">
          Seus dados estão protegidos pela LGPD
        </span>
      </div>

      <AuthDivider />

      <GoogleButton onClick={google.signInComGoogle} isLoading={google.isLoading} />
    </form>
  )
}
