'use client'

import { useTrilhas } from '../trilhas/use-trilhas'
import { TrilhasList } from '../trilhas/trilhas-list'

/**
 * Aba "Trilhas" do feed (handoff 03) — reusa a listagem completa de trilhas
 * (UF5): destaque "Continue de onde parou" + "Todas as trilhas".
 */
export function FeedTrilhasTab() {
  const { trilhas, loading, error, reload } = useTrilhas()
  return <TrilhasList trilhas={trilhas} loading={loading} error={error} onRetry={reload} />
}
