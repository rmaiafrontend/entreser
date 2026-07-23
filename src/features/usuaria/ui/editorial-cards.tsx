import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Formato } from '@/features/admin/conteudos/types'
import { FORMATO_LABEL, type ContentItemVM } from '../lib/content'

/**
 * Cards editoriais do redesign (handoff app usuária), reutilizados entre Feed e
 * Explorar:
 *  - `PosterCard`        — capa 4:3 + título/meta abaixo (carrosséis). Áudio vira
 *                          tile gradiente com ícone de onda (sem capa/duração);
 *  - `StartCard`         — card horizontal com botão play ("Comece por aqui");
 *  - `ReadingRow`        — linha de leitura (tile 56px + meta + chevron/salvar);
 *  - `RecommendedBanner` — banner 184px com overlay escuro e play ("Recomendado").
 * Todas viram `Link` quando o VM traz `href`.
 */

/* ── Ícones (stroke, currentColor) ── */
function IconImage({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.6" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  )
}
function IconWave({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  )
}
function IconDoc({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16v16H4z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  )
}
function IconPlay({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
function IconChevron({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}
function IconHeart({ size = 19 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  )
}

/** Une formato + campos num "Vídeo · Prática" / "Artigo · 4 min · Autocuidado". */
function metaLine(formato: Formato, ...extra: (string | undefined | null)[]): string {
  return [FORMATO_LABEL[formato], ...extra].filter(Boolean).join(' · ')
}

function maybeLink(href: string | undefined, className: string, node: ReactNode) {
  return href ? (
    <Link href={href} className={className}>
      {node}
    </Link>
  ) : (
    <>{node}</>
  )
}

export function PosterCard({ item, className }: { item: ContentItemVM; className?: string }) {
  const { title, formato, duration, meta, thumbUrl, href } = item
  // Áudio não tem capa: vira um tile gradiente com ícone de onda (e sem selo de
  // duração), como no handoff. Vídeo/artigo usam a capa + selo de duração.
  const isAudio = formato === 'audio'
  return maybeLink(
    href,
    'block transition-es hover:opacity-[0.97] active:scale-[0.99]',
    <div className={cn('block', className)}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] shadow-[0_8px_22px_rgba(45,24,64,0.12)]">
        {isAudio ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E4DCEA] to-[#F0E4D6] text-plum/30">
            <IconWave />
          </div>
        ) : thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-mauve-soft to-cream-mid text-plum/30">
            <IconImage />
          </div>
        )}
        {!isAudio && duration && (
          <span className="absolute bottom-2.5 right-2.5 rounded-full bg-plum/60 px-2.5 py-[3px] text-[11px] text-white backdrop-blur-sm">
            {duration}
          </span>
        )}
      </div>
      <h4 className="mt-[11px] font-display text-[17px] font-medium leading-tight text-plum">{title}</h4>
      <p className="mt-[3px] text-xs text-plum/50">{metaLine(formato, meta)}</p>
    </div>,
  )
}

export function StartCard({
  item,
  eyebrow = 'Comece por aqui',
  className,
}: {
  item: ContentItemVM
  eyebrow?: string
  className?: string
}) {
  const { title, formato, duration, meta, thumbUrl, href } = item
  return maybeLink(
    href,
    'block',
    <div
      className={cn(
        'flex items-stretch overflow-hidden rounded-[20px] border border-white/70 bg-[#FFFDFA] shadow-[0_8px_24px_rgba(45,24,64,0.11)] transition-es hover:shadow-card-hover active:scale-[0.99]',
        className,
      )}
    >
      <div className="relative w-[124px] shrink-0">
        {thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-mauve-soft to-cream-mid text-plum/30">
            <IconImage />
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-[3px] text-[9.5px] font-bold uppercase tracking-[0.07em] text-plum">
          {FORMATO_LABEL[formato]}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-[15px] py-[13px]">
        <p className="mb-[5px] text-[10px] font-bold uppercase tracking-[0.12em] text-mauve">{eyebrow}</p>
        <h4 className="mb-[9px] line-clamp-2 font-display text-[18px] font-medium leading-[1.16] text-plum">{title}</h4>
        <div className="flex items-center gap-2">
          {duration && <span className="text-xs text-plum/50">{duration}</span>}
          {duration && meta && <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-plum/30" />}
          {meta && <span className="truncate text-xs text-plum/50">{meta}</span>}
          <span className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-plum text-cream">
            <IconPlay />
          </span>
        </div>
      </div>
    </div>,
  )
}

export function ReadingRow({
  item,
  trailing = 'chevron',
  eyebrow = false,
  className,
}: {
  item: ContentItemVM
  /** Ícone à direita: `chevron` (abrir) ou `save` (favoritar — UF8 dormente). */
  trailing?: 'chevron' | 'save'
  /** Mostra o formato como eyebrow acima do título; a meta vira só a duração. */
  eyebrow?: boolean
  className?: string
}) {
  const { title, formato, duration, meta, thumbUrl, href } = item
  const metaText = eyebrow ? duration : metaLine(formato, duration, meta)
  return maybeLink(
    href,
    'block',
    <div
      className={cn(
        'flex items-center gap-[13px] rounded-[18px] border border-white/60 bg-white p-3 shadow-[0_4px_16px_rgba(45,24,64,0.07)] transition-es hover:shadow-card-hover active:scale-[0.99]',
        className,
      )}
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[14px]">
        {thumbUrl && formato !== 'audio' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-mauve-ghost to-cream-mid text-plum/35">
            {formato === 'audio' ? <IconWave size={24} /> : <IconDoc />}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="mb-[2px] text-[10px] font-bold uppercase tracking-[0.1em] text-mauve">{FORMATO_LABEL[formato]}</p>
        )}
        <p className="line-clamp-2 text-[14.5px] font-medium leading-[1.3] text-plum">{title}</p>
        {metaText && <p className="mt-[3px] text-xs text-plum/45">{metaText}</p>}
      </div>
      {trailing === 'save' ? (
        // Salvar (UF8) ainda dormente no MVP — decorativo por ora.
        <span className="shrink-0 text-mauve" aria-hidden>
          <IconHeart />
        </span>
      ) : (
        <span className="shrink-0 text-plum/30" aria-hidden>
          <IconChevron />
        </span>
      )}
    </div>,
  )
}

export function RecommendedBanner({
  item,
  eyebrow = 'Recomendado para você',
  className,
}: {
  item: ContentItemVM
  eyebrow?: string
  className?: string
}) {
  const { title, formato, duration, meta, thumbUrl, href } = item
  return maybeLink(
    href,
    'block',
    <div
      className={cn(
        'relative h-[184px] overflow-hidden rounded-[22px] shadow-[0_12px_30px_rgba(45,24,64,0.16)] transition-es active:scale-[0.99]',
        className,
      )}
    >
      {thumbUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumbUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-mauve-soft to-cream-mid text-plum/30">
          <IconImage />
        </div>
      )}
      {/* Gradiente escuro para legibilidade do texto embaixo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-plum/[0.12] via-plum/[0.04] to-plum/[0.84]" />
      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-[11px] py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-plum">
        {FORMATO_LABEL[formato]}
      </span>
      <div className="absolute inset-x-4 bottom-[15px] flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-[5px] text-[10px] font-bold uppercase tracking-[0.12em] text-mauve-soft">{eyebrow}</p>
          <h3 className="mb-[7px] line-clamp-2 font-display text-[22px] font-medium leading-[1.14] text-white">{title}</h3>
          <div className="flex items-center gap-2 text-xs text-white/80">
            {duration && <span>{duration}</span>}
            {duration && meta && <span className="h-[3px] w-[3px] rounded-full bg-white/50" />}
            {meta && <span className="truncate">{meta}</span>}
          </div>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream text-plum shadow-[0_6px_18px_rgba(0,0,0,0.4)]">
          <IconPlay size={19} />
        </span>
      </div>
    </div>,
  )
}
