import { cn } from '@/lib/utils'

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'card'

export interface ESSkeletonProps {
  variant?: SkeletonVariant
  width?: number | string
  height?: number | string
  className?: string
}

const DEFAULTS: Record<SkeletonVariant, { width: string; height: string; radius: string }> = {
  text: { width: '100%', height: '1rem', radius: 'rounded-md' },
  circular: { width: '3rem', height: '3rem', radius: 'rounded-pill' },
  rectangular: { width: '100%', height: '6rem', radius: 'rounded-md' },
  card: { width: '100%', height: '12rem', radius: 'rounded-card' },
}

function toCss(v: number | string | undefined): string | undefined {
  if (v == null) return undefined
  return typeof v === 'number' ? `${v}px` : v
}

/**
 * ESSkeleton — placeholder shimmer (text/circular/rectangular/card).
 */
export function ESSkeleton({ variant = 'text', width, height, className }: ESSkeletonProps) {
  const d = DEFAULTS[variant]
  return (
    <span
      className={cn('animate-shimmer block', d.radius, className)}
      style={{ width: toCss(width) ?? d.width, height: toCss(height) ?? d.height }}
    />
  )
}
