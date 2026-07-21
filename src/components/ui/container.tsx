import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ContainerSize = 'sm' | 'md' | 'lg' | 'full'

export interface ContainerProps {
  /** Largura máxima. @default 'lg' */
  size?: ContainerSize
  children: ReactNode
  className?: string
}

const SIZES: Record<ContainerSize, string> = {
  sm: 'max-w-lg px-4',
  md: 'max-w-2xl px-4',
  lg: 'max-w-5xl px-6',
  full: 'max-w-full px-4',
}

/**
 * Container — wrapper de largura máxima centralizada (sm/md/lg/full).
 */
export function Container({ size = 'lg', children, className }: ContainerProps) {
  return <div className={cn('mx-auto w-full', SIZES[size], className)}>{children}</div>
}
