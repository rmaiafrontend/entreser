'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BottomNav } from '../ui'
import { UsuariaHeader } from './usuaria-header'
import { USUARIA_NAV_MOBILE, NAV_HIDDEN_PREFIXES } from './usuaria-nav'

/**
 * UsuariaShell — casca responsiva do app autenticado da Usuária (M05).
 *
 * - Desktop (lg+): header flutuante no topo (sticky); conteúdo em largura total.
 * - Mobile: BottomNav fixa embaixo; espaço inferior reservado (`pb-24`).
 *
 * A nav (as duas) some no leitor de conteúdo e no onboarding (telas full-screen).
 */
export function UsuariaShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const hideNav = NAV_HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))

  return (
    <div className={cn('min-h-dvh bg-canvas', !hideNav && 'pb-24 lg:pb-0')}>
      {!hideNav && <UsuariaHeader />}
      {children}
      {!hideNav && <BottomNav items={USUARIA_NAV_MOBILE} className="lg:hidden" />}
    </div>
  )
}
