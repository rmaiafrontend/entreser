'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../context/auth-context'
import { mensagemDoErro } from '../lib/errors'
import { completarCadastroSchema, type CompletarCadastroInput } from '../schemas/auth.schema'
import { authService } from '../services'
import type { GoogleProfile } from '../types'
import { AuthCheckbox } from './auth-checkbox'
import { AuthSubmit } from './auth-submit'
import { BirthDateField } from './birth-date-field'
import { FormMessage } from './form-message'
import { PhoneField } from './phone-field'

/** F2 — dados complementares após o cadastro via Google. */
export function CompleteGoogleForm() {
  const router = useRouter()
  const { registerSession } = useAuth()
  const [profile, setProfile] = useState<GoogleProfile | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CompletarCadastroInput>({
    resolver: zodResolver(completarCadastroSchema),
    defaultValues: { telefone: '', dataNascimento: '', aceitaTermos: false },
  })

  useEffect(() => {
    let ativo = true
    void authService.getPendingGoogle().then((p) => {
      if (!ativo) return
      if (!p) {
        router.replace('/cadastro')
        return
      }
      setProfile(p)
      setCarregando(false)
    })
    return () => {
      ativo = false
    }
  }, [router])

  async function onSubmit(values: CompletarCadastroInput) {
    setErroGeral(null)
    try {
      const session = await authService.completarCadastroGoogle(values)
      registerSession(session)
      router.push('/home')
    } catch (e) {
      setErroGeral(mensagemDoErro(e))
    }
  }

  if (carregando) {
    return <p className="text-center text-sm text-cream/40">Carregando…</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {erroGeral && <FormMessage>{erroGeral}</FormMessage>}

      {profile && (
        <FormMessage tone="info">
          Conectada como{' '}
          <strong className="font-medium text-cream">{profile.email}</strong>.
          Falta pouco: complete seu cadastro.
        </FormMessage>
      )}

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

      <AuthSubmit isLoading={isSubmitting}>Concluir cadastro</AuthSubmit>
    </form>
  )
}
