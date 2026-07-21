'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { SignInInput } from '@/features/auth/schemas/auth.schema'
import { authService } from '@/features/auth/services'
import type { AdminSignInResult } from '@/features/auth/services/auth.service'
import type { AdminDTO, AdminSession } from '@/features/auth/types'

type Status = 'loading' | 'authenticated' | 'unauthenticated'

interface AdminAuthContextValue {
  admin: AdminDTO | null
  status: Status
  /**
   * F4 — autentica no backoffice. Retorna o resultado para a tela decidir o
   * destino (sessão direta vs. troca de senha provisória no primeiro acesso).
   */
  signIn(input: SignInInput): Promise<AdminSignInResult>
  /** Registra no contexto uma sessão obtida por outro fluxo (troca de senha). */
  registerSession(session: AdminSession): void
  signOut(): Promise<void>
  refresh(): Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminDTO | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  const refresh = useCallback(async () => {
    const session = await authService.getAdminSession()
    setAdmin(session?.user ?? null)
    setStatus(session ? 'authenticated' : 'unauthenticated')
  }, [])

  useEffect(() => {
    let ativo = true
    void authService.getAdminSession().then((session) => {
      if (!ativo) return
      setAdmin(session?.user ?? null)
      setStatus(session ? 'authenticated' : 'unauthenticated')
    })
    return () => {
      ativo = false
    }
  }, [])

  const signIn = useCallback(async (input: SignInInput) => {
    const result = await authService.adminSignIn(input)
    if (result.tipo === 'sessao') {
      setAdmin(result.session.user)
      setStatus('authenticated')
    }
    return result
  }, [])

  const registerSession = useCallback((session: AdminSession) => {
    setAdmin(session.user)
    setStatus('authenticated')
  }, [])

  const signOut = useCallback(async () => {
    await authService.adminSignOut()
    setAdmin(null)
    setStatus('unauthenticated')
  }, [])

  return (
    <AdminAuthContext.Provider
      value={{ admin, status, signIn, registerSession, signOut, refresh }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) {
    throw new Error('useAdminAuth deve ser usado dentro de <AdminAuthProvider>.')
  }
  return ctx
}
