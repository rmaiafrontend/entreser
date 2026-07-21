import type { ReactNode } from 'react'

interface AdminAuthShellProps {
  children: ReactNode
  title: string
  subtitle?: string
  footer?: ReactNode
}

/**
 * Moldura das telas de acesso do backoffice (tema claro/creme). Fundo em
 * gradiente creme→rosé (o mesmo "clima" da casca), wordmark da marca + selo
 * "Backoffice", card branco centralizado com título em Cormorant. Tom
 * utilitário, distinto do app emocional da Usuária (tema escuro glassmorphic).
 */
export function AdminAuthShell({ children, title, subtitle, footer }: AdminAuthShellProps) {
  return (
    <div className="bg-backoffice flex min-h-dvh flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-[22px] flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/marca-entreser-plum.png" alt="entre ser" className="mb-3 w-[150px]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mauve">
            Backoffice
          </span>
        </div>

        <div className="rounded-card bg-white p-8 shadow-card">
          <h1 className="text-center font-display text-[26px] font-normal text-plum">{title}</h1>
          {subtitle && <p className="mt-1 text-center text-sm text-plum/55">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-5 text-center text-sm text-plum/55">{footer}</div>}
      </div>
    </div>
  )
}
