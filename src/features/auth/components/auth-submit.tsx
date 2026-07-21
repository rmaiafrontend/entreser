import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { IconArrowRight } from './icons'

interface AuthSubmitProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  isLoading?: boolean
}

/** Botão primário das telas de auth: pílula creme, largura total, com loading. */
export function AuthSubmit({
  children,
  isLoading,
  type = 'submit',
  disabled,
  className,
  ...props
}: AuthSubmitProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        'mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-cream py-4 text-base font-medium text-plum shadow-lg transition-all hover:bg-cream-mid active:scale-[0.97]',
        'disabled:opacity-60 disabled:active:scale-100',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="h-5 w-5 animate-spin text-plum" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {children}
          <IconArrowRight />
        </>
      )}
    </button>
  )
}
