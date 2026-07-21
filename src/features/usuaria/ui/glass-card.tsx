import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  /** Faixa gradiente no topo do card (detalhe editorial do protótipo). */
  accent?: boolean
  className?: string
}

/**
 * GlassCard — cartão flutuante translúcido (vidro fosco) sobre o gradiente
 * ameixa. Recorrente em todas as telas da Usuária.
 */
export function GlassCard({ children, accent = false, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-card border border-white/40 bg-white/85 shadow-card backdrop-blur-xl',
        className,
      )}
    >
      {accent && <div className="h-1 bg-gradient-to-r from-mauve to-plum-light" />}
      {children}
    </div>
  )
}
