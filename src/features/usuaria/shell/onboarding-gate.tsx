'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { faseUsuariaService } from '../fase'

/**
 * OnboardingGate — logo após o login, verifica se a usuária já tem `FaseUsuaria`
 * definida (UF1, critério de aceite do M05). Sem fase → redireciona para
 * `/onboarding`; com fase → libera o app. O próprio `/onboarding` é sempre
 * liberado (evita loop). A verificação é barata e revalida a cada navegação sem
 * piscar loader (só a primeira checagem, sem fase confirmada, exibe o loader).
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState<'checking' | 'ok'>('checking')
  const onOnboarding = pathname.startsWith('/onboarding')

  useEffect(() => {
    if (onOnboarding) return
    let ativo = true
    faseUsuariaService
      .getMinhaFase()
      .then((mf) => {
        if (!ativo) return
        if (mf.atual) setState('ok')
        else router.replace('/onboarding')
      })
      .catch(() => {
        // Uma falha na verificação não deve prender a usuária fora do app.
        if (ativo) setState('ok')
      })
    return () => {
      ativo = false
    }
  }, [pathname, onOnboarding, router])

  // O onboarding é a própria porta de entrada — renderiza direto, sem gate.
  if (onOnboarding) return <>{children}</>

  if (state === 'checking') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream text-sm text-mauve">
        Carregando…
      </div>
    )
  }
  return <>{children}</>
}
