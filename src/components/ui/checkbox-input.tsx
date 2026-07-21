import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxInputProps {
  label: ReactNode
  isSelected?: boolean
  onChange?: (checked: boolean) => void
  isDisabled?: boolean
  name?: string
  id?: string
  className?: string
}

/**
 * CheckboxInput — checkbox nativo (accent mauve) com label clicável ao lado.
 */
export function CheckboxInput({
  label,
  isSelected,
  onChange,
  isDisabled,
  name,
  id,
  className,
}: CheckboxInputProps) {
  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-2',
        isDisabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={!!isSelected}
        disabled={isDisabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="h-4 w-4 cursor-[inherit] accent-mauve"
      />
      <span className="text-sm text-plum/80">{label}</span>
    </label>
  )
}
