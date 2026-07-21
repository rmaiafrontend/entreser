'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mensagemDoErro } from '@/features/auth/lib/errors'
import { recuperarSenhaSchema, type RecuperarSenhaInput } from '@/features/auth/schemas/auth.schema'
import { authService } from '@/features/auth/services'
import { AdminDevNotice } from './admin-dev-notice'
import { AdminField } from './admin-field'
import { AdminFormMessage } from './admin-form-message'
import { AdminSubmit } from './admin-submit'

interface AdminRecoverFormProps {
  defaultEmail?: string
}

/** F6 — recuperação de senha do admin. */
export function AdminRecoverForm({ defaultEmail }: AdminRecoverFormProps) {
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
      const { devResetToken } = await authService.adminRecuperarSenha(values)
      setDevToken(devResetToken ?? null)
      setEnviado(true)
    } catch (e) {
      setErroGeral(mensagemDoErro(e))
    }
  }

  if (enviado) {
    return (
      <div className="space-y-4">
        <AdminFormMessage tone="success">
          Se houver uma conta com esse e-mail, enviamos um link para redefinir a
          senha.
        </AdminFormMessage>

        {devToken && (
          <AdminDevNotice
            descricao="Sem envio de e-mail real nesta demonstração — use o link abaixo para redefinir a senha."
            href={`/admin/redefinir-senha?token=${devToken}`}
            cta="Redefinir senha agora"
          />
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {erroGeral && <AdminFormMessage>{erroGeral}</AdminFormMessage>}

      <p className="text-sm text-plum/55">
        Informe o e-mail da sua conta e enviaremos um link para criar uma nova
        senha.
      </p>

      <AdminField
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="voce@entreser.com.br"
        error={errors.email?.message}
        {...register('email')}
      />

      <AdminSubmit isLoading={isSubmitting}>Enviar link</AdminSubmit>
    </form>
  )
}
