'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mensagemDoErro } from '../lib/errors'
import { recuperarSenhaSchema, type RecuperarSenhaInput } from '../schemas/auth.schema'
import { authService } from '../services'
import { AuthField } from './auth-field'
import { AuthSubmit } from './auth-submit'
import { DevTokenNotice } from './dev-token-notice'
import { FormMessage } from './form-message'
import { IconMail } from './icons'

interface RecoverFormProps {
  defaultEmail?: string
}

/** F6 — solicitação de recuperação de senha. */
export function RecoverForm({ defaultEmail }: RecoverFormProps) {
  const [enviado, setEnviado] = useState(false)
  const [devToken, setDevToken] = useState<string | null>(null)
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecuperarSenhaInput>({
    resolver: zodResolver(recuperarSenhaSchema),
    defaultValues: { email: defaultEmail ?? '' },
  })

  async function onSubmit(values: RecuperarSenhaInput) {
    setErroGeral(null)
    try {
      const { devResetToken } = await authService.recuperarSenha(values)
      setDevToken(devResetToken ?? null)
      setEnviado(true)
    } catch (e) {
      setErroGeral(mensagemDoErro(e))
    }
  }

  if (enviado) {
    return (
      <div className="space-y-4">
        <FormMessage tone="success">
          Se houver uma conta com esse e-mail, enviamos um link para redefinir a
          senha. Verifique sua caixa de entrada.
        </FormMessage>

        {devToken && (
          <DevTokenNotice
            descricao="Sem envio de e-mail real nesta demonstração — use o link abaixo para redefinir a senha."
            href={`/redefinir-senha?token=${devToken}`}
            cta="Redefinir senha agora"
          />
        )}

        <Link
          href="/login"
          className="block text-center text-sm text-cream/50 transition-colors hover:text-cream"
        >
          Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {erroGeral && <FormMessage>{erroGeral}</FormMessage>}

      <p className="text-sm text-cream/50">
        Informe o e-mail da sua conta e enviaremos um link para criar uma nova
        senha.
      </p>

      <AuthField
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="maria@email.com"
        icon={<IconMail />}
        error={errors.email?.message}
        {...register('email')}
      />

      <AuthSubmit isLoading={isSubmitting}>Enviar link</AuthSubmit>
    </form>
  )
}
