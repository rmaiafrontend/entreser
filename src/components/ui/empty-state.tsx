import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}

/**
 * EmptyState — estado vazio editorial (ícone em círculo + título display +
 * texto + ação). Usado dentro de cards de listagem sem resultados.
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('px-6 py-14 text-center', className)}>
      {icon && (
        <div className="mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-pill bg-cream-mid text-mauve">
          {icon}
        </div>
      )}
      <h3 className="font-display text-[21px] text-plum">{title}</h3>
      {description && (
        <p className="mx-auto mt-1.5 max-w-[380px] text-sm leading-relaxed text-plum/60">
          {description}
        </p>
      )}
      {action && <div className="mt-[18px] flex justify-center">{action}</div>}
    </div>
  )
}
