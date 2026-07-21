import { cn } from '@/lib/utils'

export interface ESProgressBarProps {
  /** 0–100 (clampado). */
  value?: number
  label?: string
  showValueLabel?: boolean
  size?: 'sm' | 'md'
  color?: 'primary' | 'success'
  className?: string
}

/**
 * ESProgressBar — barra de progresso (clamp 0–100), cores primary/success.
 */
export function ESProgressBar({
  value = 0,
  label,
  showValueLabel = false,
  size = 'md',
  color = 'primary',
  className,
}: ESProgressBarProps) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('w-full', className)}>
      {(label || showValueLabel) && (
        <div className="mb-1.5 flex justify-between">
          {label && <span className="text-sm font-medium text-plum/70">{label}</span>}
          {showValueLabel && <span className="text-sm text-plum/70">{Math.round(v)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('overflow-hidden rounded-pill bg-cream-mid', size === 'sm' ? 'h-1.5' : 'h-2.5')}
      >
        <div
          className={cn(
            'h-full rounded-pill transition-[width] duration-300',
            color === 'success' ? 'bg-success-dark' : 'bg-mauve',
          )}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  )
}
