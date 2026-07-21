'use client'

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { IconCheck } from './icons'

interface AuthCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  error?: string
}

/**
 * Checkbox no tema escuro (aceite de Termos). Encaminha a ref para o
 * react-hook-form. O input nativo fica acessível (sr-only) e a caixa
 * estilizada + o check reagem via variantes `peer-checked`.
 */
export const AuthCheckbox = forwardRef<HTMLInputElement, AuthCheckboxProps>(
  function AuthCheckbox({ label, error, id, ...props }, ref) {
    const generatedId = useId()
    const fieldId = id ?? generatedId
    const errorId = `${fieldId}-error`

    return (
      <div>
        <label className="relative flex cursor-pointer items-start gap-2.5">
          <input
            id={fieldId}
            ref={ref}
            type="checkbox"
            className="peer sr-only"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          <span className="mt-0.5 h-5 w-5 shrink-0 rounded-md border border-white/25 bg-white/10 transition-all peer-checked:border-cream peer-checked:bg-cream peer-focus-visible:ring-2 peer-focus-visible:ring-cream/40" />
          <IconCheck className="pointer-events-none absolute left-0 top-0.5 h-5 w-5 p-0.5 text-plum opacity-0 transition-opacity peer-checked:opacity-100" />
          <span className="text-sm leading-snug text-cream/55">{label}</span>
        </label>
        {error && (
          <p id={errorId} className="mt-1.5 text-xs font-medium text-mauve-soft">
            {error}
          </p>
        )}
      </div>
    )
  },
)
