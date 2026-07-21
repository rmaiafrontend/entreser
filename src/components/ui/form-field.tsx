import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FormFieldProps {
  /** Rótulo eyebrow (CAIXA-ALTA, mauve). */
  label?: ReactNode
  /** Texto auxiliar exibido quando não há erro. */
  description?: ReactNode
  /** Mensagem de erro (tem prioridade sobre description). */
  errorMessage?: ReactNode
  /** Marca o campo como obrigatório (asterisco). */
  isRequired?: boolean
  children: ReactNode
  className?: string
}

/**
 * FormField — wrapper de layout: label eyebrow + descrição/erro + obrigatório.
 */
export function FormField({
  label,
  description,
  errorMessage,
  isRequired,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <span className="text-eyebrow text-mauve">
          {label}
          {isRequired && <span className="text-red-alert"> *</span>}
        </span>
      )}
      {children}
      {errorMessage ? (
        <span className="mt-1 text-sm text-red-alert">{errorMessage}</span>
      ) : description ? (
        <span className="mt-1 text-sm text-plum/50">{description}</span>
      ) : null}
    </div>
  )
}
