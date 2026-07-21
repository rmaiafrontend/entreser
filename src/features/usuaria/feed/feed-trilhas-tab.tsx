'use client'

import Link from 'next/link'
import { useTrilhas } from '../trilhas/use-trilhas'
import { TrilhasList } from '../trilhas/trilhas-list'

/** Aba "Trilhas" do feed — reusa a listagem de trilhas (UF5). */
export function FeedTrilhasTab() {
  const { trilhas, loading, error, reload } = useTrilhas()
  return (
    <div className="space-y-5">
      <TrilhasList trilhas={trilhas} loading={loading} error={error} onRetry={reload} />
      {!loading && !error && trilhas.length > 0 && (
        <div className="text-center">
          <Link href="/trilhas" className="text-sm text-mauve transition-es hover:text-mauve-dark">
            Ver todas as trilhas →
          </Link>
        </div>
      )}
    </div>
  )
}
