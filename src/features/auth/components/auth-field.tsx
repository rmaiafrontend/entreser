'use client'

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'
import { IconEye, IconEyeOff } from './icons'

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: ReactNode
  error?: string
}

/**
 * Campo de formulário no tema escuro das telas de auth (glassmorphism).
 * Encaminha a ref para integrar com react-hook-form (`{...register(campo)}`).
 * Campos `password` ganham um botão de mostrar/ocultar automaticamente.
 */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  function AuthField({ label, icon, error, type = 'text', id, ...props }, ref) {
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
          className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-cream/40"
        >
          {label}
        </label>

        <div
          className={cn(
            'flex items-center gap-3 rounded-2xl border bg-white/10 px-4 py-3.5 backdrop-blur-sm transition-all focus-within:bg-white/15',
            error
              ? 'border-mauve-soft/60'
              : 'border-white/10 focus-within:border-cream/30',
          )}
        >
          {icon && <span className="shrink-0 text-cream/50">{icon}</span>}

          <input
            id={fieldId}
            ref={ref}
            type={inputType}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="flex-1 bg-transparent text-sm text-cream placeholder:text-cream/25 focus:outline-none"
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setRevelado((v) => !v)}
              aria-label={revelado ? 'Ocultar senha' : 'Mostrar senha'}
              className="shrink-0 text-cream/40 transition-colors hover:text-cream/70"
            >
              {revelado ? <IconEyeOff /> : <IconEye />}
            </button>
          )}
        </div>

        {error && (
          <p id={errorId} className="mt-1.5 text-xs font-medium text-mauve-soft">
            {error}
          </p>
        )}
      </div>
    )
  },
)
