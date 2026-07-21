import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg'

export interface ESAvatarProps {
  src?: string
  name?: string
  size?: AvatarSize
  isBordered?: boolean
  className?: string
}

const SIZES: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
}

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]).join('').toUpperCase() || '?'
}

/**
 * ESAvatar — avatar circular com imagem ou fallback de iniciais; 3 tamanhos.
 */
export function ESAvatar({ src, name, size = 'md', isBordered = false, className }: ESAvatarProps) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-pill bg-plum-soft font-medium text-plum',
        SIZES[size],
        isBordered && 'ring-2 ring-mauve-soft',
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name || ''} className="h-full w-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </span>
  )
}
