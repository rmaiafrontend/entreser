import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ListItemProps {
  children: ReactNode
  startContent?: ReactNode
  endContent?: ReactNode
  /** Aplica hover clicável (fundo ao passar o mouse). */
  isClickable?: boolean
  className?: string
}

/**
 * ListItem — linha genérica com startContent/endContent e modo clicável.
 */
export function ListItem({
  children,
  startContent,
  endContent,
  isClickable = false,
  className,
}: ListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 border-b border-plum/5 px-4 py-3 transition-colors duration-200',
        isClickable && 'cursor-pointer hover:bg-plum/5',
        className,
      )}
    >
      {startContent && <div className="inline-flex shrink-0">{startContent}</div>}
      <div className="min-w-0 flex-1">{children}</div>
      {endContent && <div className="inline-flex shrink-0">{endContent}</div>}
    </div>
  )
}
