interface HeroProgressProps {
  /** 0–100 (clampado). */
  value: number
  label?: string
  showValue?: boolean
  className?: string
}

/**
 * HeroProgress — barra de progresso para uso DENTRO dos heros ameixa (trilho
 * `white/10`, preenchimento `cream/80`). Distinta da `ESProgressBar`, que é
 * feita para cards claros.
 */
export function HeroProgress({ value, label, showValue = true, className }: HeroProgressProps) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="text-[11px] text-cream/40">{label}</span>}
          {showValue && <span className="text-[11px] font-medium text-cream/60">{Math.round(v)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 overflow-hidden rounded-full bg-white/10"
      >
        <div className="h-full rounded-full bg-cream/80 transition-[width] duration-500" style={{ width: `${v}%` }} />
      </div>
    </div>
  )
}
