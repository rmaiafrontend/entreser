'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ToastProvider } from '@/components/ui'
import { useAdminAuth } from '@/features/admin/context/admin-auth-context'
import { BackofficeShell } from '@/features/admin/components/backoffice-shell'

/**
 * Guard + casca das rotas autenticadas do backoffice.
 *
 * No frontend-only a proteção é no cliente (sessão do contexto). Num backend
 * real seria reforçada no servidor (proxy otimista + Data Access Layer com
 * checagem de `perfil`). Uma vez autenticada, envolve as páginas no
 * ToastProvider e na casca (sidebar + topbar). As páginas seguem podendo ser
 * Server Components — só a casca é cliente.
 */
export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { status } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login')
    }
  }, [status, router])

  if (status !== 'authenticated') {
    return (
      <div className="bg-backoffice flex min-h-dvh items-center justify-center text-sm text-mauve">
        Carregando…
      </div>
    )
  }

  return (
    <ToastProvider>
      <BackofficeShell>{children}</BackofficeShell>
    </ToastProvider>
  )
}
