import { cn } from '@/lib/utils'

export interface TextareaInputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  errorMessage?: string
  isRequired?: boolean
  isDisabled?: boolean
  /** Número mínimo de linhas visíveis. @default 3 */
  minRows?: number
  name?: string
  id?: string
  className?: string
}

/**
 * TextareaInput — área multilinha redimensionável, mesmos estados do TextInput.
 */
export function TextareaInput({
  label,
  placeholder,
  value,
  onChange,
  errorMessage,
  isRequired,
  isDisabled,
  minRows = 3,
  name,
  id,
  className,
}: TextareaInputProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-plum/70">
          {label}
          {isRequired && <span className="text-red-alert"> *</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        rows={minRows}
        value={value}
        placeholder={placeholder}
        required={isRequired}
        disabled={isDisabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'w-full resize-y rounded-[10px] border bg-white/60 px-3 py-2 font-body text-sm text-plum backdrop-blur-sm outline-none transition-[border-color,box-shadow] duration-200',
          'placeholder:text-plum/30 focus:border-mauve focus:shadow-[0_0_0_1px_var(--color-mauve)]',
          errorMessage ? 'border-red-alert' : 'border-cream-dark',
          isDisabled && 'opacity-50',
        )}
      />
      {errorMessage && <span className="text-xs text-red-alert">{errorMessage}</span>}
    </div>
  )
}
