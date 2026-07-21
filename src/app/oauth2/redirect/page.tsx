'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setAccessToken } from '@/lib/http'
import { useAuth } from '@/features/auth/context/auth-context'

/**
 * Retorno do OAuth2 do backend (guia §2.2).
 *
 * O backend autentica no Google e redireciona o browser para
 * `${app}/oauth2/redirect?token=<jwt>` (na ORIGEM, sem `/api/v1`). Esta rota
 * captura o token, guarda em memória e segue para a home. O refresh token já
 * chegou no cookie HttpOnly.
 *
 * Após guardar o token, hidrata o AuthContext (`refresh()` → `getSession` →
 * `/auth/refresh` + `/paciente/perfil`) para que o guard do grupo `(app)`
 * reconheça a sessão, e então segue para a home.
 */
function OAuthRedirectInner() {
  const router = useRouter()
  const params = useSearchParams()
  const { refresh } = useAuth()

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      router.replace('/login?erro=oauth')
      return
    }
    setAccessToken(token)
    void refresh().then(() => router.replace('/home'))
  }, [params, router, refresh])

  return (
    <main className="grid min-h-screen place-items-center bg-plum text-cream">
      <p className="font-onest text-sm text-cream/80">Entrando…</p>
    </main>
  )
}

export default function OAuthRedirectPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-plum text-cream">
          <p className="font-onest text-sm text-cream/80">Entrando…</p>
        </main>
      }
    >
      <OAuthRedirectInner />
    </Suspense>
  )
}
