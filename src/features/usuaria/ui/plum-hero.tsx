import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PlumHeroProps {
  eyebrow?: string
  title?: ReactNode
  description?: ReactNode
  /** Ação/elemento à direita do título (ícone, avatar, botão). */
  aside?: ReactNode
  /** Barra superior (voltar/ações) renderizada acima do bloco de título. */
  topBar?: ReactNode
  /** Conteúdo extra abaixo da descrição (abas, progresso). */
  children?: ReactNode
  /** Largura interna: `false` = coluna de leitura (max-w-lg); `true` = dashboard (max-w-5xl). */
  wide?: boolean
  /**
   * Sobrescreve a largura interna com granularidade: `sm` (max-w-lg), `md`
   * (max-w-2xl, leitura confortável) ou `lg` (max-w-5xl). Quando definido, tem
   * prioridade sobre `wide`.
   */
  contentWidth?: 'sm' | 'md' | 'lg'
  /**
   * Ativa o tratamento de “superfície elevada” APENAS no desktop (lg+): card com
   * anel hairline + realce superior, sombra refinada, brilhos recalibrados para o
   * card contido (não mais para a faixa full-bleed do mobile) e uma altura mínima
   * compartilhada que dá ritmo vertical entre TODAS as faixas. Não muda nada no
   * mobile. @default false
   */
  elevated?: boolean
  /**
   * Classes extras no contêiner interno. Usado pelo PageHero para alinhar a
   * largura do CONTEÚDO do hero à coluna do corpo no desktop, mantendo o card
   * sempre na largura canônica.
   */
  innerClassName?: string
  /** Classes extras no contêiner da `topBar` — ex.: `lg:hidden` para um voltar só no mobile. */
  topBarClassName?: string
  className?: string
}

const CONTENT_WIDTH: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'max-w-lg',
  md: 'max-w-2xl',
  lg: 'max-w-5xl',
}

/**
 * PlumHero — cabeçalho imersivo do app da Usuária: gradiente ameixa com orbs
 * desfocados. Extrai a marcação repetida em feed/trilhas/fase/leitor. O padding
 * inferior padrão (`pb-14`) deixa espaço para um card sobreposto (`-mt-*`);
 * ajuste via `className` quando não houver sobreposição.
 *
 * Com `elevated` (ligado pelo PageHero e pela Home) o hero vira, no desktop, uma
 * superfície deliberadamente elevada e com ritmo vertical compartilhado — veja a
 * prop `elevated`. Tudo é gated em `lg:`; o mobile permanece idêntico.
 */
export function PlumHero({
  eyebrow,
  title,
  description,
  aside,
  topBar,
  children,
  wide = false,
  contentWidth,
  elevated = false,
  innerClassName,
  topBarClassName,
  className,
}: PlumHeroProps) {
  const innerWidth = CONTENT_WIDTH[contentWidth ?? (wide ? 'lg' : 'sm')]
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-plum via-plum-mid to-mauve-dark px-4 pt-10 pb-14',
        // Desktop elevado: respiro maior + anel hairline + realce interno + sombra
        // ameixa refinada (mesma tinta do token de sombra). Só em lg+.
        elevated &&
          'lg:px-8 lg:ring-1 lg:ring-inset lg:ring-white/[0.08] lg:shadow-[0_24px_60px_-28px_rgb(45_24_64_/_0.5)]',
        className,
      )}
    >
      {/* Orbs base — calibrados para a faixa full-bleed do mobile. No desktop
          elevado saem de cena e dão lugar aos brilhos recalibrados do card. */}
      <div
        className={cn(
          'pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl',
          elevated && 'lg:hidden',
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute -left-10 bottom-4 h-32 w-32 rounded-full bg-white/10 blur-3xl',
          elevated && 'lg:hidden',
        )}
      />

      {elevated && (
        <>
          {/* Realce superior — fio de luz “vindo de cima” na borda do card */}
          <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-gradient-to-r from-transparent via-white/20 to-transparent lg:block" />
          {/* Profundidade em camadas — campo luminoso no canto superior direito:
              preenche o espaço antes vazio e evita o degradê “chapado”. */}
          <div
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{ background: 'radial-gradient(115% 90% at 82% -12%, rgb(255 255 255 / 0.10), transparent 58%)' }}
          />
          {/* Brilho quente inferior-direito — recalibrado para o card arredondado */}
          <div className="pointer-events-none absolute -bottom-16 -right-12 hidden h-64 w-64 rounded-full bg-mauve-mid/25 blur-[90px] lg:block" />
        </>
      )}

      <div
        className={cn(
          'relative z-10 mx-auto w-full',
          innerWidth,
          // min-h compartilhado + coluna flex para centralizar verticalmente o
          // conteúdo — dá o MESMO ritmo a todas as faixas (com/sem abas/descrição).
          elevated && 'lg:flex lg:min-h-[11rem] lg:flex-col',
          innerClassName,
        )}
      >
        {/* topBar (voltar/ações) — quando houver, em todos os tamanhos. A marca
            fica no header do desktop; o hero mobile não exibe logo. */}
        {topBar && <div className={cn('mb-6', topBarClassName)}>{topBar}</div>}
        {/* No desktop elevado, título + extras centralizam no min-h compartilhado;
            no mobile é um bloco comum sem estilo (renderização idêntica). */}
        <div className={cn(elevated && 'lg:flex lg:grow lg:flex-col lg:justify-center')}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {eyebrow && <p className="text-eyebrow text-cream/50">{eyebrow}</p>}
              {title && <h1 className="mt-1 font-display text-3xl font-light text-cream">{title}</h1>}
              {description && (
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/60">{description}</p>
              )}
            </div>
            {aside && <div className="shrink-0">{aside}</div>}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

/** Botão circular translúcido para a barra superior do hero (voltar/ações). */
export function HeroIconButton({
  onPress,
  href,
  children,
  'aria-label': ariaLabel,
}: {
  onPress?: () => void
  href?: string
  children: ReactNode
  'aria-label': string
}) {
  const cls =
    'flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream backdrop-blur-sm transition-es hover:bg-white/20'
  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onPress} aria-label={ariaLabel} className={cls}>
      {children}
    </button>
  )
}
