import { cn } from '@/lib/utils'

export interface ESDividerProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

/**
 * ESDivider — separador fino (1px) horizontal/vertical em ameixa 10%.
 */
export function ESDivider({ orientation = 'horizontal', className }: ESDividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'bg-plum/10',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  )
}
