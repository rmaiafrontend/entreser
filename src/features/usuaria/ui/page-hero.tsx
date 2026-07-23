import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { PlumHero } from './plum-hero'

interface PageHeroProps {
  eyebrow?: string
  title?: ReactNode
  description?: ReactNode
  /** Ação/elemento à direita do título (ícone, avatar, botão). */
  aside?: ReactNode
  /** Barra superior (voltar/ações) renderizada acima do bloco de título. */
  topBar?: ReactNode
  /** Conteúdo extra abaixo da descrição (abas, progresso). */
  children?: ReactNode
  /**
   * Largura da coluna do CORPO no desktop (`md` = max-w-3xl, `lg` = max-w-5xl) —
   * combine com `PageContent` na mesma `width`. O card do hero NÃO segue mais esta
   * prop: ele é sempre renderizado na largura canônica (max-w-5xl) para que a
   * faixa seja UMA só em todas as rotas; `width` apenas alinha a largura do
   * conteúdo do hero à coluna do corpo. @default 'lg'
   */
  width?: 'md' | 'lg'
  /** Classes extras no contêiner da `topBar` — ex.: `lg:hidden` para um voltar só no mobile. */
  topBarClassName?: string
  className?: string
}

/**
 * PageHero — hero das telas internas da Usuária adaptado ao desktop. No mobile é
 * a faixa ameixa full-bleed do `PlumHero`; no desktop (lg+) vira um card
 * arredondado e contido, alinhado à coluna de conteúdo e flutuando sob o header
 * — mesmo tratamento da Home, para dar consistência entre as rotas.
 *
 * Combine com `PageContent` (mesma `width`) para alinhar hero e corpo na mesma
 * coluna centralizada.
 */
export function PageHero({ width = 'lg', className, ...rest }: PageHeroProps) {
  return (
    // A coluna do hero é SEMPRE canônica (max-w-5xl): a faixa tem a mesma largura
    // em todas as rotas. `width` passa a controlar só a coluna do corpo — abaixo,
    // via `innerClassName`, o CONTEÚDO do hero (md) recolhe para max-w-3xl e alinha
    // com o `PageContent width="md"` (ambos centrados na página).
    <div className="lg:mx-auto lg:max-w-5xl lg:px-6 lg:pt-6">
      <PlumHero
        wide
        elevated
        innerClassName={width === 'md' ? 'lg:max-w-3xl lg:px-6' : undefined}
        {...rest}
        className={cn('max-lg:rounded-b-[30px] pb-6 lg:rounded-card lg:pb-8', className)}
      />
    </div>
  )
}

/**
 * PageContent — coluna de conteúdo centralizada, alinhada ao `PageHero`. `md` para
 * telas de leitura/formulário (max-w-3xl) e `lg` para vitrines em grade (max-w-5xl).
 */
export function PageContent({
  width = 'lg',
  className,
  children,
}: {
  width?: 'md' | 'lg' | 'sm'
  className?: string
  children: ReactNode
}) {
  const max = width === 'lg' ? 'max-w-5xl' : width === 'md' ? 'max-w-3xl' : 'max-w-xl'
  return <div className={cn('mx-auto w-full px-5 sm:px-6', max, className)}>{children}</div>
}
