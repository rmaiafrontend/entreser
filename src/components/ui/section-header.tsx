import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}

/**
 * SectionHeader — cabeçalho editorial de seção (eyebrow + título display + ação).
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {eyebrow && <span className="text-eyebrow text-mauve">{eyebrow}</span>}
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-[26px] font-medium text-plum">{title}</h2>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {description && <p className="text-sm text-plum/60">{description}</p>}
    </div>
  )
}
