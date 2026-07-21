'use client'

import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { IconEye, IconEyeOff } from '@/features/auth/components/icons'

interface AdminFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

/**
 * Campo de formulário do backoffice (tema claro). Encaminha a ref para o
 * react-hook-form. Campos `password` ganham o botão mostrar/ocultar.
 */
export const AdminField = forwardRef<HTMLInputElement, AdminFieldProps>(
  function AdminField({ label, error, type = 'text', id, ...props }, ref) {
    const generatedId = useId()
    const fieldId = id ?? generatedId
    const errorId = `${fieldId}-error`
    const [revelado, setRevelado] = useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword && revelado ? 'text' : type

    return (
      <div>
        <label
          htmlFor={fieldId}
          className="mb-1.5 block text-sm font-medium text-plum/70"
        >
          {label}
        </label>

        <div
          className={cn(
            'flex items-center gap-2 rounded-input border bg-cream/40 px-3.5 py-2.5 transition-colors focus-within:bg-white',
            error ? 'border-red-alert' : 'border-cream-dark focus-within:border-plum',
          )}
        >
          <input
            id={fieldId}
            ref={ref}
            type={inputType}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="flex-1 bg-transparent text-sm text-plum outline-none focus-visible:shadow-none placeholder:text-plum/30"
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setRevelado((v) => !v)}
              aria-label={revelado ? 'Ocultar senha' : 'Mostrar senha'}
              className="shrink-0 text-plum/35 transition-colors hover:text-plum/60"
            >
              {revelado ? <IconEyeOff /> : <IconEye />}
            </button>
          )}
        </div>

        {error && (
          <p id={errorId} className="mt-1.5 text-xs font-medium text-red-alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
