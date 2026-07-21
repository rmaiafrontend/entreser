import { cn } from '@/lib/utils'

interface SegmentedTabsProps<K extends string> {
  tabs: { key: K; label: string }[]
  value: K
  onChange: (key: K) => void
  /**
   * `block` (padrão) ocupa a largura do container (segmented control cheio) — o
   * comportamento atual em TODOS os breakpoints e em todos os outros consumidores.
   * `inline` mantém isso no mobile e, no desktop (lg+), vira uma fileira de pílulas
   * de largura automática que abraça os rótulos — para assentar sob o título sem
   * parecer uma caixa esticada e solta. Todas as classes de `inline` são lg-gated.
   */
  variant?: 'block' | 'inline'
  className?: string
}

/**
 * SegmentedTabs — alternador de abas translúcido para uso DENTRO do hero ameixa
 * (Para você / Trilhas / Explorar). Controlado.
 */
export function SegmentedTabs<K extends string>({
  tabs,
  value,
  onChange,
  variant = 'block',
  className,
}: SegmentedTabsProps<K>) {
  const inline = variant === 'inline'
  return (
    <div
      role="tablist"
      className={cn('flex rounded-xl bg-white/10 p-1 backdrop-blur-sm', inline && 'lg:inline-flex', className)}
    >
      {tabs.map((tab) => {
        const active = tab.key === value
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={cn(
              'flex-1 rounded-lg py-2.5 text-sm font-medium transition-es',
              inline && 'lg:flex-none lg:px-6',
              active ? 'bg-white/20 text-cream shadow-sm' : 'text-cream/50 hover:text-cream/70',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
