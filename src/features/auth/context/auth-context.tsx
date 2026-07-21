'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { authService } from '../services'
import type { SignInInput } from '../schemas/auth.schema'
import type { Session, UsuariaDTO } from '../types'

type Status = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  user: UsuariaDTO | null
  status: Status
  /** F4 — autentica e atualiza o contexto. Lança AuthError em caso de falha. */
  signIn(input: SignInInput): Promise<void>
  /** Registra no contexto uma sessão obtida por outro fluxo (Google, etc.). */
  registerSession(session: Session): void
  /** F9 — encerra a sessão. */
  signOut(): Promise<void>
  /** Recarrega a sessão a partir do serviço. */
  refresh(): Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuariaDTO | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  const refresh = useCallback(async () => {
    const session = await authService.getSession()
    setUser(session?.user ?? null)
    setStatus(session ? 'authenticated' : 'unauthenticated')
  }, [])

  // Carrega a sessão existente ao montar. O setState acontece no callback
  // assíncrono (após o await), não de forma síncrona no corpo do efeito.
  useEffect(() => {
    let ativo = true
    void authService.getSession().then((session) => {
      if (!ativo) return
      setUser(session?.user ?? null)
      setStatus(session ? 'authenticated' : 'unauthenticated')
    })
    return () => {
      ativo = false
    }
  }, [])

  const signIn = useCallback(async (input: SignInInput) => {
    const session = await authService.signIn(input)
    setUser(session.user)
    setStatus('authenticated')
  }, [])

  const registerSession = useCallback((session: Session) => {
    setUser(session.user)
    setStatus('authenticated')
  }, [])

  const signOut = useCallback(async () => {
    await authService.signOut()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, status, signIn, registerSession, signOut, refresh }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>.')
  }
  return ctx
}
