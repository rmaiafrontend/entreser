'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mensagemDoErro } from '@/features/auth/lib/errors'
import { redefinirSenhaSchema, type RedefinirSenhaInput } from '@/features/auth/schemas/auth.schema'
import { authService } from '@/features/auth/services'
import { useAdminAuth } from '../context/admin-auth-context'
import { AdminField } from './admin-field'
import { AdminFormMessage } from './admin-form-message'
import { AdminSubmit } from './admin-submit'

/** F12 — primeiro acesso: troca a senha provisória e entra. */
export function AdminFirstAccessForm() {
  const router = useRouter()
  const { registerSession } = useAdminAuth()
  const [email, setEmail] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RedefinirSenhaInput>({
    resolver: zodResolver(redefinirSenhaSchema),
    defaultValues: { senha: '', confirmarSenha: '' },
  })

  useEffect(() => {
    let ativo = true
    void authService.getPendingAdminChange().then((p) => {
      if (!ativo) return
      if (!p) {
        router.replace('/admin/login')
        return
      }
      setEmail(p.email)
      setCarregando(false)
    })
    return () => {
      ativo = false
    }
  }, [router])

  async function onSubmit(values: RedefinirSenhaInput) {
    setErroGeral(null)
    try {
      const session = await authService.adminTrocarSenhaProvisoria(values)
      registerSession(session)
      router.push('/admin')
    } catch (e) {
      setErroGeral(mensagemDoErro(e))
    }
  }

  if (carregando) {
    return <p className="text-sm text-plum/50">Carregando…</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {erroGeral && <AdminFormMessage>{erroGeral}</AdminFormMessage>}

      <AdminFormMessage tone="info">
        Primeiro acesso de{' '}
        <strong className="font-medium text-plum">{email}</strong>. Defina uma
        nova senha para continuar.
      </AdminFormMessage>

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

      <AdminSubmit isLoading={isSubmitting}>Definir senha e entrar</AdminSubmit>
    </form>
  )
}
