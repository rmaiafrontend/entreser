import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'error' | 'success' | 'info'

interface AdminFormMessageProps {
  tone?: Tone
  children: ReactNode
}

const toneStyles: Record<Tone, string> = {
  error: 'border-red-alert/30 bg-red-alert/8 text-red-alert',
  success: 'border-success-dark/30 bg-success-light text-success-dark',
  info: 'border-plum/15 bg-plum/5 text-plum/70',
}

/** Banner de mensagem do backoffice (tema claro). */
export function AdminFormMessage({ tone = 'error', children }: AdminFormMessageProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-input border px-3.5 py-2.5 text-sm leading-snug',
        toneStyles[tone],
      )}
    >
      {children}
    </div>
  )
}
