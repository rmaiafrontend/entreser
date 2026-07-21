'use client'

import { useState } from 'react'
import { EmptyState, ESButton, ConteudosIcon } from '@/components/ui'
import { PageHero, PageContent, HeroBackButton, SegmentedTabs, ContentCard, ErrorRetry } from '../ui'
import { useFeed } from './use-feed'
import { feedItemToVM } from './vm'
import { FeedTrilhasTab } from './feed-trilhas-tab'
import { FeedExplorarTab } from './feed-explorar-tab'

type Tab = 'para-voce' | 'trilhas' | 'explorar'

const TABS: { key: Tab; label: string }[] = [
  { key: 'para-voce', label: 'Para você' },
  { key: 'trilhas', label: 'Trilhas' },
  { key: 'explorar', label: 'Explorar' },
]

/**
 * FeedView — tela /feed com 3 abas: Para você (UF2), Trilhas (UF5) e Explorar
 * (UF3/UF4). O feed é carregado sempre (alimenta o hero com a fase e a aba "Para
 * você"); as outras abas montam seus dados só quando abertas.
 */
export function FeedView() {
  const [tab, setTab] = useState<Tab>('para-voce')
  const feed = useFeed()

  return (
    <div className="min-h-dvh">
      <PageHero
        topBar={<HeroBackButton />}
        topBarClassName="lg:hidden"
        eyebrow={feed.fase ? `Para a fase ${feed.fase.nome}` : 'Aprender e crescer'}
        title="Feed"
      >
        <div className="mt-5 max-w-md">
          <SegmentedTabs variant="inline" tabs={TABS} value={tab} onChange={setTab} />
        </div>
      </PageHero>

      <PageContent className="pb-10 pt-6">
        {tab === 'para-voce' && <ParaVoce {...feed} />}
        {tab === 'trilhas' && <FeedTrilhasTab />}
        {tab === 'explorar' && <FeedExplorarTab />}
      </PageContent>
    </div>
  )
}

function ParaVoce({
  itens,
  loading,
  loadingMore,
  error,
  temMais,
  loadMore,
  reload,
}: ReturnType<typeof useFeed>) {
  if (loading) return <FeedSkeleton />
  if (error) return <ErrorRetry message={error} onRetry={reload} />
  if (itens.length === 0) {
    return (
      <EmptyState
        icon={<ConteudosIcon />}
        title="Nada por aqui ainda"
        description="Conteúdos personalizados para a sua fase aparecem aqui em breve."
      />
    )
  }

  // Tratamento editorial: o primeiro conteúdo vira um card de destaque (herói
  // horizontal no desktop) e o restante segue numa grade "Mais para você".
  const [destaque, ...resto] = itens

  return (
    <div className="space-y-8">
      <ContentCard item={feedItemToVM(destaque)} variant="featured" />

      {resto.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[.14em] text-plum/45">Mais para você</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resto.map((item) => (
              <ContentCard key={item.id} item={feedItemToVM(item)} />
            ))}
          </div>
        </section>
      )}

      {temMais && (
        <div className="flex justify-center pt-2">
          <ESButton variant="secondary" isLoading={loadingMore} onPress={loadMore}>
            Carregar mais
          </ESButton>
        </div>
      )}
    </div>
  )
}

function FeedSkeleton() {
  return (
    <div className="space-y-8">
      <div className="aspect-[2/1] w-full animate-pulse rounded-card bg-white/60 sm:aspect-[3/1] lg:aspect-[3.4/1]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="aspect-[4/3] w-full animate-pulse rounded-card bg-white/60" />
        ))}
      </div>
    </div>
  )
}
