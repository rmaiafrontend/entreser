'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EmptyState, ESButton, ConteudosIcon } from '@/components/ui'
import { PageHero, PageContent, HeroBackButton, SegmentedTabs, ContentCard, ErrorRetry, GlassCard, ChevronRightIcon, PosterCard, StartCard, ReadingRow } from '../ui'
import { useFeed } from './use-feed'
import { feedItemToVM } from './vm'
import type { FeedItem } from './types'
import { useMinhaFase } from '../fase/use-minha-fase'
import { useRecentes } from '../conteudos/use-recentes'
import { conteudoResumoToVM } from '../conteudos/vm'
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
  const { data: minhaFase, loading: faseLoading } = useMinhaFase()
  const fase = minhaFase?.atual
  const temFase = Boolean(fase)
  // "Para você" é personalizado por fase. Sem fase (ex.: onboarding não cadastrado)
  // não buscamos `/feed` — a aba cai em "recentes", como a home, e nunca quebra.
  const feed = useFeed({ enabled: temFase })

  return (
    <div className="min-h-dvh">
      <PageHero
        topBar={<HeroBackButton />}
        topBarClassName="lg:hidden"
        eyebrow={fase ? `Para a fase · ${fase.nome}` : 'Aprender e crescer'}
        title="Feed"
        description={temFase ? 'Selecionado para o seu momento' : undefined}
      >
        <div className="mt-5 max-w-md">
          <SegmentedTabs variant="inline" tabs={TABS} value={tab} onChange={setTab} />
        </div>
      </PageHero>

      <PageContent className="pb-10 pt-6">
        {tab === 'para-voce' &&
          (faseLoading ? <FeedSkeleton /> : temFase ? <ParaVoce {...feed} /> : <ParaVoceSemFase />)}
        {tab === 'trilhas' && <FeedTrilhasTab />}
        {tab === 'explorar' && <FeedExplorarTab />}
      </PageContent>
    </div>
  )
}

/**
 * "Para você" quando a usuária ainda NÃO tem fase — feed personalizado é
 * impossível sem fase. Em vez de erro/tela vazia, mostra um convite para
 * descobrir a fase + os conteúdos mais recentes (mesmo tratamento da home via
 * `useRecentes`). Blinda o feed para o caso em que ele é alcançado sem fase.
 */
function ParaVoceSemFase() {
  const { itens, loading } = useRecentes(9)
  if (loading) return <FeedSkeleton />

  return (
    <div className="space-y-6">
      <Link href="/fase" className="block">
        <GlassCard className="flex items-center justify-between gap-3 p-5 transition-es hover:shadow-card-hover">
          <div className="min-w-0">
            <p className="text-eyebrow text-mauve">Personalize seu espaço</p>
            <p className="mt-1 font-display text-lg text-plum">Descubra a sua fase</p>
            <p className="mt-1 text-sm leading-relaxed text-plum/55">
              Enquanto isso, veja os conteúdos mais recentes.
            </p>
          </div>
          <ChevronRightIcon size={20} className="shrink-0 text-plum/30" />
        </GlassCard>
      </Link>

      {itens.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itens.map((c) => (
            <ContentCard key={c.id} item={conteudoResumoToVM(c)} />
          ))}
        </div>
      )}
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

  // Estrutura editorial do handoff: carrossel "Para assistir" (vídeos), destaque
  // "Comece por aqui" e "Leituras rápidas" (artigos). O destaque prioriza um
  // vídeo (o botão play do card faz sentido); áudios ficam na aba Explorar.
  const destaque = itens.find((i) => i.formato === 'video') ?? itens[0]
  const resto = itens.filter((i) => i.id !== destaque.id)
  const videos = resto.filter((i) => i.formato === 'video')
  const artigos = resto.filter((i) => i.formato === 'artigo')

  return (
    <div className="space-y-6">
      {videos.length > 0 && (
        <section>
          <SectionTitle title="Para assistir" subtitle="Vídeos para o seu momento" />
          <PosterCarousel itens={videos} />
        </section>
      )}

      <StartCard item={feedItemToVM(destaque)} />

      {artigos.length > 0 && (
        <section>
          <SectionTitle title="Leituras rápidas" subtitle="Para ler em poucos minutos" />
          <div className="mt-3.5 flex flex-col gap-[11px]">
            {artigos.map((item) => (
              <ReadingRow key={item.id} item={feedItemToVM(item)} trailing="save" />
            ))}
          </div>
        </section>
      )}

      {temMais && (
        <div className="flex justify-center pt-1">
          <ESButton variant="secondary" isLoading={loadingMore} onPress={loadMore}>
            Carregar mais
          </ESButton>
        </div>
      )}
    </div>
  )
}

/** Cabeçalho de seção editorial do handoff: título serifado 23px + subtítulo. */
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h3 className="font-display text-[23px] font-medium leading-none text-plum">{title}</h3>
      {subtitle && <p className="mt-1 text-[13px] text-plum/50">{subtitle}</p>}
    </div>
  )
}

/** Carrossel horizontal de PosterCards (208px), sangrando até as bordas no mobile. */
function PosterCarousel({ itens }: { itens: FeedItem[] }) {
  return (
    <div
      className="-mx-5 mt-3.5 flex snap-x snap-mandatory scroll-px-5 gap-3.5 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6"
      style={{ scrollbarWidth: 'none' }}
    >
      {itens.map((item) => (
        <div key={item.id} className="w-[208px] shrink-0 snap-start">
          <PosterCard item={feedItemToVM(item)} />
        </div>
      ))}
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
