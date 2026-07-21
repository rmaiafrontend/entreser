'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ESButton, EmptyState, CheckIcon } from '@/components/ui'
import { cn } from '@/lib/utils'
import { PageHero, PageContent, HeroIconButton, HeroProgress, ContentCard, ArrowLeftIcon } from '../ui'
import { conteudoHref, formatDuracao, type ContentItemVM } from '../lib/content'
import { useTrilha } from './use-trilhas'
import type { TrilhaItem } from './types'

function itemToVM(i: TrilhaItem): ContentItemVM {
  return {
    id: i.conteudoId,
    title: i.titulo,
    formato: i.formato,
    duration: formatDuracao(i.formato, i.duracao),
    thumbUrl: i.thumb,
    consumido: i.consumido,
    href: conteudoHref(i.conteudoId),
  }
}

/**
 * TrilhaDetailView (UF5) — segue o modelo da spec: trilha é uma LISTA ORDENADA de
 * conteúdos com progresso binário. Cada item abre o leitor compartilhado
 * (`/conteudos/[id]`); a usuária pode consumir na ordem ou fora dela. (O
 * protótipo tratava a trilha como curso de lições com player/reflexão — isso
 * pertence ao leitor e ao módulo de Diário; ver plano §6.)
 */
export function TrilhaDetailView({ id }: { id: string }) {
  const router = useRouter()
  const { trilha, loading, error, notFound, reload } = useTrilha(id)

  const backBar = (
    <HeroIconButton aria-label="Voltar" href="/trilhas">
      <ArrowLeftIcon />
    </HeroIconButton>
  )

  if (loading) return <DetailSkeleton backBar={backBar} />

  if (notFound) {
    return (
      <DetailMessage
        backBar={backBar}
        title="Trilha não encontrada"
        description="Esta trilha não está mais disponível."
        action={
          <ESButton variant="secondary" onPress={() => router.push('/trilhas')}>
            Ver trilhas
          </ESButton>
        }
      />
    )
  }

  if (error || !trilha) {
    return (
      <DetailMessage
        backBar={backBar}
        title="Algo deu errado"
        description={error ?? 'Não foi possível carregar a trilha.'}
        action={<ESButton onPress={reload}>Tentar novamente</ESButton>}
      />
    )
  }

  const proximo = trilha.itens.find((i) => !i.consumido)
  const label = `${trilha.consumidos} de ${trilha.total} ${trilha.total === 1 ? 'conteúdo' : 'conteúdos'}`

  return (
    <div className="min-h-dvh">
      <PageHero width="md" topBar={backBar} eyebrow="Trilha" title={trilha.titulo} description={trilha.descricao || undefined}>
        <div className="mt-5 max-w-md">
          <HeroProgress value={trilha.progresso} label={label} />
        </div>
      </PageHero>

      <PageContent width="md" className="space-y-6 pb-10 pt-6">
        {proximo && (
          <section>
            <p className="text-eyebrow mb-3 text-mauve">Continue por aqui</p>
            <ContentCard variant="compact" item={itemToVM(proximo)} />
          </section>
        )}

        <section>
          <p className="text-eyebrow mb-3 text-mauve">Conteúdos da trilha</p>
          {trilha.itens.length === 0 ? (
            <EmptyState
              title="Trilha sem conteúdos"
              description="Esta trilha ainda não tem conteúdos publicados."
            />
          ) : (
            <ol className="space-y-2">
              {trilha.itens.map((item) => (
                <li key={item.conteudoId} className="flex items-center gap-3">
                  <OrderBadge ordem={item.ordem} consumido={item.consumido} />
                  <div className="min-w-0 flex-1">
                    <ContentCard variant="compact" item={itemToVM(item)} />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </PageContent>
    </div>
  )
}

function OrderBadge({ ordem, consumido }: { ordem: number; consumido: boolean }) {
  return (
    <span
      className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
        consumido ? 'bg-mauve text-white' : 'bg-plum-soft text-plum/50',
      )}
      aria-hidden
    >
      {consumido ? <CheckIcon size={13} /> : ordem}
    </span>
  )
}

function DetailMessage({
  backBar,
  title,
  description,
  action,
}: {
  backBar: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="min-h-dvh">
      <PageHero width="md" topBar={backBar} />
      <PageContent width="md" className="pt-2">
        <EmptyState title={title} description={description} action={action} />
      </PageContent>
    </div>
  )
}

function DetailSkeleton({ backBar }: { backBar: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <PageHero width="md" topBar={backBar}>
        <div className="mt-2 space-y-3">
          <div className="h-3.5 w-1/3 animate-pulse rounded bg-white/20" />
          <div className="h-7 w-3/5 animate-pulse rounded bg-white/20" />
          <div className="mt-4 h-1.5 w-full max-w-md animate-pulse rounded-full bg-white/15" />
        </div>
      </PageHero>
      <PageContent width="md" className="space-y-2 pb-10 pt-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[74px] animate-pulse rounded-2xl bg-white/50" />
        ))}
      </PageContent>
    </div>
  )
}
