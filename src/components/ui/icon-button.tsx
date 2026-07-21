import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface IconButtonProps {
  children: ReactNode
  onPress?: () => void
  /** Tooltip e rótulo acessível. */
  title: string
  variant?: 'default' | 'danger'
  type?: 'button' | 'submit'
  className?: string
}

/**
 * IconButton — botão quadrado só-ícone (34px), com hover suave. Variante
 * `danger` para ações destrutivas (remover).
 */
export function IconButton({
  children,
  onPress,
  title,
  variant = 'default',
  type = 'button',
  className,
}: IconButtonProps) {
  return (
    <button
      type={type}
      onClick={onPress}
      title={title}
      aria-label={title}
      className={cn(
        'inline-flex h-[34px] w-[34px] items-center justify-center rounded-[10px] transition-colors',
        variant === 'danger' ? 'text-red-alert hover:bg-red-alert/10' : 'text-plum/55 hover:bg-plum/5',
        className,
      )}
    >
      {children}
    </button>
  )
}
