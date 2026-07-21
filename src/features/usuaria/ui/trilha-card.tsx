import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ESProgressBar, TrilhasIcon } from '@/components/ui'

interface TrilhaCardProps {
  title: string
  description?: string
  /** 0–100. */
  progress: number
  href: string
  recommended?: boolean
  thumbUrl?: string | null
  icon?: ReactNode
  className?: string
}

/**
 * TrilhaCard — linha da lista de trilhas (ícone/capa + título + progresso + %).
 * Realça trilhas indicadas para a fase da usuária.
 */
export function TrilhaCard({ title, description, progress, href, recommended, thumbUrl, icon, className }: TrilhaCardProps) {
  return (
    <Link href={href} className="block">
      <div
        className={cn(
          'flex items-center gap-4 rounded-2xl border border-white/40 bg-white/60 p-4 backdrop-blur-sm transition-es',
          'hover:scale-[1.01] hover:bg-white/80 active:scale-[0.99]',
          recommended && 'border-mauve/30 bg-mauve-ghost/40',
          className,
        )}
      >
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl text-mauve',
            recommended ? 'bg-mauve/10' : 'bg-plum-soft',
          )}
        >
          {thumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            icon ?? <TrilhasIcon size={20} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-plum">{title}</p>
            {recommended && (
              <span className="shrink-0 rounded-full bg-mauve/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-mauve">
                Indicada
              </span>
            )}
          </div>
          {description && <p className="mt-0.5 truncate text-xs text-plum/40">{description}</p>}
          <div className="mt-2">
            <ESProgressBar value={progress} size="sm" />
          </div>
        </div>
        <span className="shrink-0 text-xs font-semibold text-plum/30">{Math.round(progress)}%</span>
      </div>
    </Link>
  )
}
