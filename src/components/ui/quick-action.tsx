import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface QuickActionProps {
  /** Ícone (SVG) exibido acima do rótulo. */
  icon: ReactNode
  /** Rótulo curto do atalho. */
  label: string
  /** Rota de destino (usa next/link). */
  href: string
  className?: string
}

/**
 * QuickAction — cartão-atalho "glass" (ícone + rótulo) que navega via next/link.
 */
export function QuickAction({ icon, label, href, className }: QuickActionProps) {
  return (
    <Link
      href={href}
      className={cn(
        'surface-glass flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-card p-4 text-center shadow-card transition-all duration-300',
        'hover:scale-[1.02] hover:shadow-card-hover active:scale-[0.97]',
        className,
      )}
    >
      <span className="inline-flex text-mauve">{icon}</span>
      <span className="text-xs font-medium text-plum">{label}</span>
    </Link>
  )
}
