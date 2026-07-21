import { cn } from '@/lib/utils'

export interface PaginationProps {
  page?: number
  totalPages?: number
  onChange?: (page: number) => void
  className?: string
}

function range(a: number, b: number): number[] {
  const r: number[] = []
  for (let i = a; i <= b; i++) r.push(i)
  return r
}

/**
 * Pagination — navegação de páginas para listas/tabelas (com reticências).
 * Não renderiza nada quando há uma única página.
 */
export function Pagination({ page = 1, totalPages = 1, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const near = 1
  const first = 1
  const last = totalPages
  const start = Math.max(first + 1, page - near)
  const end = Math.min(last - 1, page + near)

  const items: Array<number | '…'> = [first]
  if (start > first + 1) items.push('…')
  items.push(...range(start, end))
  if (end < last - 1) items.push('…')
  if (last > first) items.push(last)

  const go = (p: number) => {
    if (p >= 1 && p <= totalPages && p !== page) onChange?.(p)
  }

  return (
    <nav aria-label="Paginação" className={cn('flex items-center gap-1.5', className)}>
      <ArrowButton direction="prev" disabled={page <= 1} onClick={() => go(page - 1)} />
      {items.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="w-5 text-center text-plum/35">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'h-[34px] min-w-[34px] rounded-[10px] px-2 font-body text-sm transition-es',
              p === page
                ? 'bg-mauve font-semibold text-white'
                : 'border border-plum/12 bg-white font-medium text-plum hover:bg-plum/5',
            )}
          >
            {p}
          </button>
        ),
      )}
      <ArrowButton direction="next" disabled={page >= totalPages} onClick={() => go(page + 1)} />
    </nav>
  )
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Página anterior' : 'Próxima página'}
      className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-plum/12 bg-white text-plum transition-es hover:bg-plum/5 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
      </svg>
    </button>
  )
}
