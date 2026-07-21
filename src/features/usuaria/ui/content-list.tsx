import type { ReactNode } from 'react'
import { ContentCard } from './content-card'
import type { ContentItemVM } from '../lib/content'

interface ContentListProps {
  title?: string
  /** Ação à direita do título (ex.: link "Ver tudo →"). */
  action?: ReactNode
  items: ContentItemVM[]
  variant?: 'default' | 'compact'
  /**
   * Distribui os cards em grade a partir do desktop (2 colunas em `compact`, 2–3
   * em `default`). No mobile permanece em coluna única. @default false
   */
  grid?: boolean
  /** Texto exibido quando `items` está vazio. Omitido → nada é renderizado. */
  emptyMessage?: string
  className?: string
}

/**
 * ContentList — seção com cabeçalho (eyebrow + ação) e lista de `ContentCard`.
 * Dedupe das listas "Recomendados"/"Explorar"/fase repetidas no protótipo.
 */
export function ContentList({ title, action, items, variant = 'compact', grid = false, emptyMessage, className }: ContentListProps) {
  const layout = grid
    ? variant === 'compact'
      ? 'grid gap-2 lg:grid-cols-2'
      : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
    : variant === 'compact'
      ? 'space-y-2'
      : 'space-y-3'
  return (
    <section className={className}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between">
          {title && <p className="text-eyebrow text-mauve">{title}</p>}
          {action}
        </div>
      )}
      {items.length === 0 ? (
        emptyMessage ? (
          <p className="rounded-2xl border border-white/40 bg-white/50 px-4 py-8 text-center text-sm text-plum/45 backdrop-blur-sm">
            {emptyMessage}
          </p>
        ) : null
      ) : (
        <div className={layout}>
          {items.map((item) => (
            <ContentCard key={item.id} item={item} variant={variant} />
          ))}
        </div>
      )}
    </section>
  )
}
