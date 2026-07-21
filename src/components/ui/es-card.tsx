import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ESCardVariant = 'default' | 'solid' | 'dark' | 'ghost'

export interface ESCardProps {
  /** Aparência do card. @default 'default' */
  variant?: ESCardVariant
  /** Habilita o hover elevado (sombra + scale). @default true só para 'default' */
  isHoverable?: boolean
  children: ReactNode
  className?: string
}

const VARIANTS: Record<ESCardVariant, string> = {
  default: 'surface-glass shadow-card',
  solid: 'bg-white shadow-card',
  dark: 'bg-plum text-cream border border-transparent',
  ghost: 'bg-transparent',
}

/**
 * ESCard — container base (glass / 22px / sombra). Variantes default/dark/ghost.
 * Hover elevado via CSS quando isHoverable (padrão para 'default').
 */
export function ESCard({ variant = 'default', isHoverable, children, className }: ESCardProps) {
  const hoverable = isHoverable ?? variant === 'default'
  return (
    <div
      className={cn(
        'overflow-hidden rounded-card transition-all duration-300',
        VARIANTS[variant],
        hoverable && 'hover:scale-[1.01] hover:shadow-card-hover',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-1.5 p-6', className)}>{children}</div>
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col p-6 pt-0', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex items-center p-6 pt-0', className)}>{children}</div>
}
