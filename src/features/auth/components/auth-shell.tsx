import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { IconArrowLeft } from './icons'

interface AuthShellProps {
  children: ReactNode
  /** Seta de voltar (canto superior esquerdo). */
  back?: { href: string; label?: string }
  /** Link no canto superior direito (ex.: "Criar conta"). */
  topRight?: { href: string; label: string }
  /** Subtítulo abaixo do logo. */
  subtitle?: string
  /** Conteúdo fixo no rodapé (ex.: "Não tem conta? Criar conta"). */
  footer?: ReactNode
  className?: string
}

/**
 * Moldura visual compartilhada por todas as telas de auth.
 * Reproduz a identidade do protótipo: gradiente escuro plum→mauve, orbs
 * decorativos, barra superior, logo centralizado e área de conteúdo rolável.
 */
export function AuthShell({
  children,
  back,
  topRight,
  subtitle,
  footer,
  className,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-gradient-to-br from-plum via-plum-mid to-mauve-dark">
      {/* Orbs decorativos */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/8 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-20 h-48 w-48 rounded-full bg-white/8 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-40 h-24 w-24 rounded-full bg-mauve/20 blur-2xl" />

      {/* Barra superior */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-6">
        {back ? (
          <Link
            href={back.href}
            aria-label={back.label ?? 'Voltar'}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <IconArrowLeft />
          </Link>
        ) : (
          <span className="h-10 w-10" aria-hidden />
        )}

        {topRight && (
          <Link
            href={topRight.href}
            className="text-sm text-cream/60 transition-colors hover:text-cream"
          >
            {topRight.label}
          </Link>
        )}
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-1 flex-col overflow-y-auto px-6 py-6">
        <div
          className={cn(
            'mx-auto flex w-full max-w-sm flex-1 flex-col justify-center',
            className,
          )}
        >
          <div className="mb-8 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-entreser.png"
              alt="Entre Ser"
              className="mx-auto mb-3 h-10 w-auto"
            />
            {subtitle && <p className="text-sm text-cream/40">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>

      {/* Rodapé */}
      {footer && (
        <div className="relative z-10 pb-8 text-center text-sm text-cream/30">
          {footer}
        </div>
      )}
    </div>
  )
}
