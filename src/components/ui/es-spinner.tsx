import { cn } from '@/lib/utils'

type SpinnerSize = 'sm' | 'md' | 'lg'

export interface ESSpinnerProps {
  size?: SpinnerSize
  label?: string
  className?: string
}

const DIM: Record<SpinnerSize, number> = { sm: 16, md: 32, lg: 48 }

/**
 * ESSpinner — spinner circular mauve em 3 tamanhos, com label opcional.
 */
export function ESSpinner({ size = 'md', label, className }: ESSpinnerProps) {
  const dim = DIM[size]
  return (
    <span className={cn('inline-flex flex-col items-center gap-2', className)}>
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin text-mauve"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
      {label && <span className="text-sm text-plum/70">{label}</span>}
    </span>
  )
}
