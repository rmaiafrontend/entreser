import Link from 'next/link'
import { cn } from '@/lib/utils'
import { TrilhasIcon } from '@/components/ui'

/** Barra de progresso do handoff: trilho plum/8, preenchimento mauve, arredondada. */
function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('overflow-hidden rounded-full bg-plum/[0.08]', className)}>
      <div className="h-full rounded-full bg-mauve" style={{ width: `${pct}%` }} />
    </div>
  )
}

/**
 * TrilhaProgressCard — card destacado "Continue de onde parou" (handoff Trilhas):
 * fundo mauve-tint, tile de ícone 56px, título serifado + selo "Indicada",
 * "X de Y conteúdos", % grande serifado e barra de progresso.
 */
export function TrilhaProgressCard({
  title,
  meta,
  progress,
  href,
  indicada = true,
}: {
  title: string
  meta: string
  progress: number
  href: string
  indicada?: boolean
}) {
  return (
    <Link
      href={href}
      className="block rounded-[22px] border border-mauve/20 bg-gradient-to-br from-[rgba(122,74,92,0.1)] to-[rgba(122,74,92,0.03)] px-[17px] py-4 shadow-[0_6px_20px_rgba(45,24,64,0.08)] transition-es hover:shadow-card-hover active:scale-[0.99]"
    >
      <div className="mb-[14px] flex items-center gap-[14px]">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mauve/[0.13] text-mauve">
          <TrilhasIcon size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-display text-[18px] font-medium leading-[1.1] text-plum">{title}</h4>
            {indicada && (
              <span className="rounded-full bg-mauve px-[9px] py-[3px] text-[9.5px] font-bold uppercase tracking-[0.08em] text-cream">
                Indicada
              </span>
            )}
          </div>
          <p className="mt-1 text-[12.5px] text-plum/50">{meta}</p>
        </div>
        <span className="shrink-0 font-display text-[21px] text-mauve">{Math.round(progress)}%</span>
      </div>
      <ProgressBar value={progress} className="h-[7px]" />
    </Link>
  )
}

/**
 * TrilhaCard — item da lista "Todas as trilhas" (handoff): capa 68px, título
 * serifado + % na mesma linha, descrição truncada e barra de progresso.
 */
export function TrilhaCard({
  title,
  description,
  progress,
  href,
  thumbUrl,
  className,
}: {
  title: string
  description?: string
  progress: number
  href: string
  thumbUrl?: string | null
  className?: string
}) {
  const pct = Math.round(progress)
  return (
    <Link href={href} className="block">
      <div
        className={cn(
          'flex items-center gap-[14px] rounded-[20px] border border-white/60 bg-white p-[13px] shadow-[0_4px_16px_rgba(45,24,64,0.07)] transition-es hover:shadow-card-hover active:scale-[0.99]',
          className,
        )}
      >
        <div className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-2xl">
          {thumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-mauve-soft to-cream-mid text-plum/30">
              <TrilhasIcon size={24} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-[10px]">
            <h4 className="min-w-0 truncate font-display text-[17px] font-medium leading-[1.15] text-plum">{title}</h4>
            <span className={cn('shrink-0 text-[12.5px] font-semibold', pct > 0 ? 'text-mauve' : 'text-plum/35')}>
              {pct}%
            </span>
          </div>
          {description && <p className="mt-[3px] truncate text-[12.5px] text-plum/45">{description}</p>}
          <ProgressBar value={progress} className="mt-[9px] h-[6px]" />
        </div>
      </div>
    </Link>
  )
}
