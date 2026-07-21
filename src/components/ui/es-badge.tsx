import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeColor = 'primary' | 'danger' | 'success' | 'warning'
type BadgeVariant = 'solid' | 'flat'
type BadgePlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface ESBadgeProps {
  /** Texto/contagem. Vazio ('') vira um "dot". `undefined` oculta. */
  content?: ReactNode
  color?: BadgeColor
  variant?: BadgeVariant
  placement?: BadgePlacement
  children: ReactNode
  className?: string
}

const COLORS: Record<BadgeColor, Record<BadgeVariant, string>> = {
  primary: { solid: 'bg-mauve text-white', flat: 'bg-mauve/15 text-mauve' },
  danger: { solid: 'bg-red-alert text-white', flat: 'bg-red-alert/15 text-red-alert' },
  success: { solid: 'bg-success-dark text-white', flat: 'bg-success-dark/15 text-success-dark' },
  warning: { solid: 'bg-[#B8860B] text-white', flat: 'bg-[#B8860B]/15 text-[#7A5C00]' },
}

const PLACEMENTS: Record<BadgePlacement, string> = {
  'top-right': 'top-0 right-0 translate-x-[35%] -translate-y-[35%]',
  'top-left': 'top-0 left-0 -translate-x-[35%] -translate-y-[35%]',
  'bottom-right': 'bottom-0 right-0 translate-x-[35%] translate-y-[35%]',
  'bottom-left': 'bottom-0 left-0 -translate-x-[35%] translate-y-[35%]',
}

/**
 * ESBadge — badge de contagem/dot ancorado sobre um filho, 4 posições.
 */
export function ESBadge({
  content,
  color = 'primary',
  variant = 'solid',
  placement = 'top-right',
  children,
  className,
}: ESBadgeProps) {
  const isDot = content === ''
  return (
    <span className={cn('relative inline-flex', className)}>
      {children}
      {content !== undefined && (
        <span
          className={cn(
            'absolute flex items-center justify-center rounded-pill text-[10px] font-semibold',
            COLORS[color][variant],
            PLACEMENTS[placement],
            isDot ? 'h-2.5 min-w-2.5' : 'h-5 min-w-5 px-1.5',
          )}
        >
          {isDot ? '' : content}
        </span>
      )}
    </span>
  )
}
