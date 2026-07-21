import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Formato } from '@/features/admin/conteudos/types'
import { FORMATO_LABEL, type ContentItemVM } from '../lib/content'

interface ContentCardProps {
  item: ContentItemVM
  variant?: 'default' | 'compact' | 'featured'
  className?: string
}

const GRADIENT: Record<Formato, string> = {
  artigo: 'from-plum-soft to-mauve-ghost',
  video: 'from-mauve-ghost to-plum-soft',
  audio: 'from-cream-mid to-plum-soft',
}

function TypeIcon({ formato }: { formato: Formato }) {
  const cls = 'text-plum/30'
  if (formato === 'video') {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
        <path d="M10 8.5v7l5.5-3.5-5.5-3.5z" fill="currentColor" />
      </svg>
    )
  }
  if (formato === 'audio') {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden>
        <path d="M12 3v18m-4-13v8m-4-4v0m8-7v14m4-10v6m4-3v0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1" />
      <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function DoneBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-[11px] font-semibold text-success-dark', className)}
      title="Concluído"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Concluído
    </span>
  )
}

/**
 * ContentCard — unidade de conteúdo do M05 (artigo/vídeo/áudio) no tema escuro
 * da Usuária. `default` (herói 2:1) e `compact` (linha). Sem coração/favorito
 * (UF8 dormente no MVP); quando o conteúdo já foi consumido, exibe selo de
 * concluído. Vira link quando `item.href` está definido.
 */
export function ContentCard({ item, variant = 'default', className }: ContentCardProps) {
  const { title, formato, duration, meta, thumbUrl, consumido, href } = item
  const label = FORMATO_LABEL[formato]

  const body =
    variant === 'featured' ? (
      <div
        className={cn(
          'group relative overflow-hidden rounded-card border border-white/40 bg-white/80 shadow-card backdrop-blur-xl',
          'transition-es hover:shadow-card-hover lg:flex',
          className,
        )}
      >
        <div
          className={cn(
            'relative aspect-[16/9] w-full overflow-hidden sm:aspect-[2/1] lg:aspect-auto lg:w-[44%]',
            !thumbUrl && `bg-gradient-to-br ${GRADIENT[formato]}`,
          )}
        >
          {thumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="scale-[1.6]">
                <TypeIcon formato={formato} />
              </div>
            </div>
          )}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
            <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-plum backdrop-blur-sm">
              {label}
            </span>
            {consumido && (
              <span className="flex h-7 items-center gap-1 rounded-full bg-white/85 px-2 text-[10px] font-semibold text-success-dark backdrop-blur-sm">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Concluído
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3 p-6 lg:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-mauve">Comece por aqui</p>
          <h3 className="font-display text-xl font-light leading-tight text-plum lg:text-[26px]">{title}</h3>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] text-plum/45">
            <span>{label}</span>
            {duration && (
              <>
                <span aria-hidden>·</span>
                <span>{duration}</span>
              </>
            )}
            {meta && (
              <>
                <span aria-hidden>·</span>
                <span className="text-mauve/80">{meta}</span>
              </>
            )}
          </div>
        </div>
      </div>
    ) : variant === 'compact' ? (
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl p-3',
          'border border-white/40 bg-white/80 backdrop-blur-xl',
          'shadow-card transition-es hover:scale-[1.01] hover:shadow-card-hover active:scale-[0.99]',
          className,
        )}
      >
        <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br', GRADIENT[formato])}>
          {thumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <TypeIcon formato={formato} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-mauve">{label}</p>
          <p className="mt-0.5 line-clamp-2 font-display text-[15px] leading-snug text-plum">{title}</p>
          {(duration || consumido) && (
            <div className="mt-1 flex items-center gap-2">
              {duration && <span className="text-xs text-plum/40">{duration}</span>}
              {consumido && <DoneBadge />}
            </div>
          )}
        </div>
      </div>
    ) : (
      <div
        className={cn(
          'group relative overflow-hidden rounded-card',
          'border border-white/40 bg-white/80 backdrop-blur-xl',
          'shadow-card transition-es hover:scale-[1.01] hover:shadow-card-hover',
          className,
        )}
      >
        <div className={cn('relative aspect-[2/1] w-full overflow-hidden', !thumbUrl && `bg-gradient-to-br ${GRADIENT[formato]}`)}>
          {thumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <TypeIcon formato={formato} />
            </div>
          )}

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-plum backdrop-blur-sm">
              {label}
            </span>
            {consumido && (
              <span className="flex h-7 items-center gap-1 rounded-full bg-white/85 px-2 text-[10px] font-semibold text-success-dark backdrop-blur-sm">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Concluído
              </span>
            )}
          </div>

          {duration && (
            <div className="absolute bottom-3 right-3">
              <span className="rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                {duration}
              </span>
            </div>
          )}
        </div>

        <div className="flex h-[80px] flex-col justify-between overflow-hidden px-3.5 pb-3.5 pt-3">
          <h3 className="line-clamp-2 font-display text-base leading-tight text-plum">{title}</h3>
          <p className="text-[11px] text-plum/40">{meta || ' '}</p>
        </div>
      </div>
    )

  if (href) {
    return (
      <Link href={href} className="block">
        {body}
      </Link>
    )
  }
  return body
}
