'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { PhoneIcon } from './icons'

const digitsOnly = (v: string) => (v || '').replace(/\D/g, '')

/**
 * Máscara progressiva de telefone brasileiro: `(11) 98765-4321` (celular, 11
 * dígitos) ou `(11) 3456-7890` (fixo, 10). Formata parcialmente enquanto se
 * digita; usa o 3º dígito (`9`) para decidir o corte antes de completar.
 */
export function maskPhoneBR(value: string): string {
  const d = digitsOnly(value).slice(0, 11)
  if (d.length <= 2) return d ? `(${d}` : ''
  const rest = d.slice(2)
  const ddd = d.slice(0, 2)
  if (rest.length === 0) return `(${ddd}) `
  const mobile = d.length > 10 || d[2] === '9'
  const cut = mobile ? 5 : 4
  if (rest.length <= cut) return `(${ddd}) ${rest}`
  return `(${ddd}) ${rest.slice(0, cut)}-${rest.slice(cut)}`
}

/** Índice, na string mascarada, logo após o n-ésimo dígito (para o cursor). */
function caretAfterDigits(masked: string, n: number): number {
  if (n <= 0) return 0
  let count = 0
  for (let i = 0; i < masked.length; i++) {
    if (/\d/.test(masked[i])) {
      count++
      if (count === n) return i + 1
    }
  }
  return masked.length
}

export interface PhoneInputProps {
  label?: string
  placeholder?: string
  value?: string
  /** Recebe o valor já mascarado — `(11) 98765-4321`. */
  onChange?: (value: string) => void
  errorMessage?: string
  isRequired?: boolean
  isDisabled?: boolean
  /** Ícone à esquerda; por padrão o ícone de telefone. Passe `null` para ocultar. */
  startContent?: ReactNode
  name?: string
  id?: string
  className?: string
}

/**
 * PhoneInput — campo de telefone com máscara BR, visual idêntico ao TextInput.
 * Mantém o cursor no lugar ao formatar e emite o valor já mascarado (o form
 * continua responsável por extrair os dígitos no submit).
 */
export function PhoneInput({
  label,
  placeholder = '(11) 98765-4321',
  value = '',
  onChange,
  errorMessage,
  isRequired,
  isDisabled,
  startContent = <PhoneIcon size={16} />,
  name,
  id,
  className,
}: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const caretRef = useRef<number | null>(null)

  const display = maskPhoneBR(value)

  // Restaura o cursor após o React re-renderizar com o valor mascarado.
  useLayoutEffect(() => {
    if (caretRef.current != null && inputRef.current) {
      inputRef.current.setSelectionRange(caretRef.current, caretRef.current)
      caretRef.current = null
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target
    const rawCaret = el.selectionStart ?? el.value.length
    const digitsBefore = (el.value.slice(0, rawCaret).match(/\d/g) || []).length
    const masked = maskPhoneBR(el.value)
    caretRef.current = caretAfterDigits(masked, digitsBefore)
    onChange?.(masked)
  }

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
          ref={inputRef}
          id={id}
          name={name}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={16}
          value={display}
          placeholder={placeholder}
          required={isRequired}
          disabled={isDisabled}
          onChange={handleChange}
          className="min-w-0 flex-1 border-none bg-transparent font-body text-sm text-plum outline-none placeholder:text-plum/30 disabled:cursor-not-allowed"
        />
      </div>
      {errorMessage && <span className="text-xs text-red-alert">{errorMessage}</span>}
    </div>
  )
}
