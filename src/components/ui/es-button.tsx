import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ESButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type ESButtonSize = 'sm' | 'md' | 'lg'

export interface ESButtonProps {
  /** Estilo visual do botão. @default 'primary' */
  variant?: ESButtonVariant
  /** Altura e paddings (32/40/48px). @default 'md' */
  size?: ESButtonSize
  /** Exibe spinner e desabilita o botão. */
  isLoading?: boolean
  /** Desabilita o botão (também forçado por isLoading). */
  isDisabled?: boolean
  /** Aplica largura total do container. */
  fullWidth?: boolean
  /** Conteúdo (ex.: ícone) antes do texto. Oculto durante isLoading. */
  startContent?: ReactNode
  /** Conteúdo (ex.: ícone) depois do texto. Oculto durante isLoading. */
  endContent?: ReactNode
  /** Handler de clique (mapeado para onClick). */
  onPress?: () => void
  children: ReactNode
  /** Tipo nativo do <button>. @default 'button' */
  type?: 'button' | 'submit' | 'reset'
  className?: string
  title?: string
  'aria-label'?: string
}

const VARIANTS: Record<ESButtonVariant, string> = {
  primary: 'bg-mauve text-white hover:bg-mauve-dark',
  secondary: 'border border-plum text-plum hover:bg-plum/5',
  ghost: 'text-mauve hover:bg-mauve/10',
  destructive: 'bg-red-alert text-white hover:bg-red-alert/90',
}

const SIZES: Record<ESButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-4 text-sm',
  md: 'h-10 gap-2 px-5 text-sm',
  lg: 'h-12 gap-2 px-6 text-base',
}

/**
 * ESButton — botão de ação principal (pílula), 4 variantes e 3 tamanhos,
 * com estados de loading/disabled. Hover/press via CSS (sem estado JS), então
 * é um componente "shared" — utilizável em Server e Client Components.
 */
export function ESButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  startContent,
  endContent,
  onPress,
  children,
  type = 'button',
  className,
  ...rest
}: ESButtonProps) {
  const disabled = isDisabled || isLoading
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onPress}
      className={cn(
        'inline-flex items-center justify-center rounded-pill font-body font-medium leading-none transition-es active:scale-[0.97]',
        'disabled:pointer-events-none disabled:opacity-50',
        SIZES[size],
        VARIANTS[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner />
      ) : (
        <>
          {startContent && <span className="inline-flex">{startContent}</span>}
          {children}
          {endContent && <span className="inline-flex">{endContent}</span>}
        </>
      )}
    </button>
  )
}

function ButtonSpinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
