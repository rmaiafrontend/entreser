'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { EyeIcon, EyeOffIcon, LockIcon } from './icons'

export interface PasswordInputProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  errorMessage?: string
  autoFocus?: boolean
  name?: string
  id?: string
  className?: string
}

/**
 * PasswordInput — campo de senha com ícone de cadeado e toggle de visibilidade.
 * API onChange(value) casa com estado local ou com react-hook-form (Controller).
 */
export function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  errorMessage,
  autoFocus,
  name,
  id,
  className,
}: PasswordInputProps) {
  const [show, setShow] = useState(false)
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-plum/70">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center gap-2 rounded-input border bg-white px-3.5 py-2.5 transition-[border-color,box-shadow] duration-200',
          'focus-within:border-mauve focus-within:shadow-[0_0_0_1px_var(--color-mauve)]',
          errorMessage ? 'border-red-alert' : 'border-cream-dark',
        )}
      >
        <span className="inline-flex text-plum/40">
          <LockIcon size={16} />
        </span>
        <input
          id={id}
          name={name}
          type={show ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onChange={(e) => onChange?.(e.target.value)}
          className="min-w-0 flex-1 border-none bg-transparent text-[15px] text-plum outline-none placeholder:text-plum/30"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
          className="inline-flex text-plum/45 transition-colors hover:text-plum/70"
        >
          {show ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </button>
      </div>
      {errorMessage && <span className="text-xs text-red-alert">{errorMessage}</span>}
    </div>
  )
}
