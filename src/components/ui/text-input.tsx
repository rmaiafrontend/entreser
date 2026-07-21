import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface TextInputProps {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'url'
  value?: string
  onChange?: (value: string) => void
  errorMessage?: string
  isRequired?: boolean
  isDisabled?: boolean
  /** Ícone à esquerda do campo. */
  startContent?: ReactNode
  /** Conteúdo à direita do campo (ex.: sufixo de unidade "min"). */
  endContent?: ReactNode
  /** Teclado virtual sugerido (ex.: 'numeric' para valores inteiros). */
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  /** Limite de caracteres do campo. */
  maxLength?: number
  name?: string
  id?: string
  className?: string
}

/**
 * TextInput — campo de linha única com label, ícone à esquerda e estados de
 * foco/erro. Foco/anel via CSS (focus-within), sem estado JS. A API onChange(value)
 * casa direto com react-hook-form via <Controller>.
 */
export function TextInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  errorMessage,
  isRequired,
  isDisabled,
  startContent,
  endContent,
  inputMode,
  maxLength,
  name,
  id,
  className,
}: TextInputProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-plum/70">
          {label}
          {isRequired && <span className="text-red-alert"> *</span>}
        </label>
      )}
      <div
        className={cn(
          'flex items-center gap-2 rounded-[10px] border bg-white/60 px-3 py-2 backdrop-blur-sm transition-[border-color,box-shadow] duration-200',
          'focus-within:border-mauve focus-within:shadow-[0_0_0_1px_var(--color-mauve)]',
          errorMessage ? 'border-red-alert' : 'border-cream-dark',
          isDisabled && 'opacity-50',
        )}
      >
        {startContent && <span className="inline-flex text-plum/40">{startContent}</span>}
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
          value={value}
          placeholder={placeholder}
          required={isRequired}
          disabled={isDisabled}
          onChange={(e) => onChange?.(e.target.value)}
          className="min-w-0 flex-1 border-none bg-transparent font-body text-sm text-plum outline-none placeholder:text-plum/30 disabled:cursor-not-allowed"
        />
        {endContent && <span className="inline-flex shrink-0 text-sm text-plum/45">{endContent}</span>}
      </div>
      {errorMessage && <span className="text-xs text-red-alert">{errorMessage}</span>}
    </div>
  )
}
