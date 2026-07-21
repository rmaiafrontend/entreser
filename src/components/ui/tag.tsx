import { cn } from '@/lib/utils'

type TagVariant = 'primary' | 'plum' | 'muted'
type TagSize = 'sm' | 'md'

export interface TagProps {
  label: string
  variant?: TagVariant
  size?: TagSize
  /** Exibe o botão "×" de remover. */
  isCloseable?: boolean
  onClose?: () => void
  className?: string
}

const VARIANTS: Record<TagVariant, string> = {
  primary: 'bg-mauve/10 text-mauve',
  plum: 'bg-plum/10 text-plum',
  muted: 'bg-cream-mid/70 text-plum/70',
}

const SIZES: Record<TagSize, string> = {
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

/**
 * Tag — etiqueta pill para categorias/metadados, opcionalmente removível.
 */
export function Tag({
  label,
  variant = 'primary',
  size = 'sm',
  isCloseable = false,
  onClose,
  className,
}: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill font-body font-medium',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      {label}
      {isCloseable && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Remover"
          className="inline-flex leading-none opacity-60 transition-opacity hover:opacity-100"
        >
          ×
        </button>
      )}
    </span>
  )
}
