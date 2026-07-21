import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface InfoNoteProps {
  children: ReactNode
  className?: string
}

/**
 * InfoNote — aviso informativo em tom mauve (ghost). Usado em modais e forms
 * para explicar consequências (convites, senhas temporárias, etc.).
 */
export function InfoNote({ children, className }: InfoNoteProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-[14px] border border-mauve/20 bg-mauve-ghost p-4 text-[13px] leading-[1.55] text-mauve-dark',
        className,
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-px shrink-0"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      <div>{children}</div>
    </div>
  )
}
