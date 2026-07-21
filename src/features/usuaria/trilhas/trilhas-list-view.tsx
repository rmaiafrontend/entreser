'use client'

import { PageHero, PageContent, HeroBackButton } from '../ui'
import { useTrilhas } from './use-trilhas'
import { TrilhasList } from './trilhas-list'

/** TrilhasListView (UF5) — tela /trilhas: hero + lista de trilhas com progresso. */
export function TrilhasListView() {
  const { trilhas, loading, error, reload } = useTrilhas()

  return (
    <div className="min-h-dvh">
      <PageHero
        topBar={<HeroBackButton />}
        topBarClassName="lg:hidden"
        eyebrow="Aprender e crescer"
        title="Trilhas"
        description="Curadorias para percorrer no seu tempo — pule, volte, retome quando quiser."
      />
      <PageContent className="pb-10 pt-6">
        <TrilhasList trilhas={trilhas} loading={loading} error={error} onRetry={reload} />
      </PageContent>
    </div>
  )
}
