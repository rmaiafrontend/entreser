'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/auth-context'
import { mensagemDoErro } from '../lib/errors'
import { authService } from '../services'

/**
 * Encapsula o fluxo Google (F2/F5) compartilhado por login e cadastro:
 * - conta existente  → registra a sessão e vai para /home;
 * - conta nova       → vai para /completar-cadastro (dados complementares).
 */
export function useGoogleSignIn() {
  const router = useRouter()
  const { registerSession } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signInComGoogle = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      const resultado = await authService.signInComGoogle()
      if (resultado.tipo === 'sessao') {
        registerSession(resultado.session)
        router.push('/home')
      } else {
        router.push('/completar-cadastro')
      }
    } catch (e) {
      setError(mensagemDoErro(e))
      setIsLoading(false)
    }
  }, [router, registerSession])

  return { signInComGoogle, isLoading, error }
}
