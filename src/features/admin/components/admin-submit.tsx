import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AdminSubmitProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  isLoading?: boolean
}

/** Botão primário do backoffice: pílula mauve, largura total, com loading. */
export function AdminSubmit({
  children,
  isLoading,
  type = 'submit',
  disabled,
  className,
  ...props
}: AdminSubmitProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-pill bg-mauve px-6 py-3 text-sm font-medium text-white transition-all hover:bg-mauve-dark active:scale-[0.98]',
        'disabled:opacity-60 disabled:active:scale-100',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  )
}
