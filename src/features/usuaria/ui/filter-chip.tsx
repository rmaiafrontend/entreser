import { cn } from '@/lib/utils'

interface FilterChipProps {
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}

/**
 * FilterChip — pílula selecionável sobre fundo creme (filtros de tipo e navegação
 * por tag). Ativa = ameixa sólida; inativa = vidro claro.
 */
export function FilterChip({ label, active = false, onClick, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-[40px] shrink-0 items-center rounded-full px-4 py-2 text-sm transition-es',
        active
          ? 'bg-plum font-medium text-cream shadow-sm'
          : 'border border-white/40 bg-white/60 text-plum/70 backdrop-blur-sm hover:bg-white/80',
        className,
      )}
    >
      {label}
    </button>
  )
}
