import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon } from './icons'

export interface BackButtonProps {
  href: string
  label?: string
  className?: string
}

/**
 * BackButton — link de "voltar" (seta + rótulo) usado no topo de sub-telas.
 * Navega via next/link para deep-link e prefetch.
 */
export function BackButton({ href, label = 'Voltar', className }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-mauve transition-colors hover:text-mauve-dark',
        className,
      )}
    >
      <span className="inline-flex transition-transform group-hover:-translate-x-0.5">
        <ChevronLeftIcon size={17} />
      </span>
      {label}
    </Link>
  )
}
