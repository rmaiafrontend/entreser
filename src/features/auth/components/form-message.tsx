import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'error' | 'success' | 'info'

interface FormMessageProps {
  tone?: Tone
  children: ReactNode
}

const toneStyles: Record<Tone, string> = {
  error: 'border-mauve-soft/40 bg-mauve-soft/10 text-mauve-soft',
  success: 'border-cream/30 bg-cream/10 text-cream',
  info: 'border-white/15 bg-white/5 text-cream/70',
}

/** Banner de mensagem no topo de um formulário (erro geral, sucesso, info). */
export function FormMessage({ tone = 'error', children }: FormMessageProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-2xl border px-4 py-3 text-sm leading-snug',
        toneStyles[tone],
      )}
    >
      {children}
    </div>
  )
}
