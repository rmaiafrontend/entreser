'use client'

import { ESSkeleton, EmptyState, TrilhasIcon } from '@/components/ui'
import { TrilhaCard, TrilhaProgressCard, ErrorRetry } from '../ui'
import type { TrilhaResumo } from './types'

interface TrilhasListProps {
  trilhas: TrilhaResumo[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

function conteudosLabel(consumidos: number, total: number): string {
  const plural = total === 1 ? 'conteúdo' : 'conteúdos'
  return `${consumidos} de ${total} ${plural}`
}

/**
 * TrilhasList — corpo reutilizável da listagem de trilhas (estados + destaque da
 * trilha em andamento + todas). Usado na tela /trilhas e na aba Trilhas do feed.
 */
export function TrilhasList({ trilhas, loading, error, onRetry }: TrilhasListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <ESSkeleton key={i} variant="rectangular" height={94} className="rounded-[20px]" />
        ))}
      </div>
    )
  }

  if (error) return <ErrorRetry message={error} onRetry={onRetry} />

  if (trilhas.length === 0) {
    return (
      <EmptyState
        icon={<TrilhasIcon />}
        title="Nenhuma trilha ainda"
        description="Novas trilhas aparecem aqui assim que forem publicadas."
      />
    )
  }

  const emAndamento = trilhas.find((t) => t.progresso > 0 && t.progresso < 100)

  return (
    <div className="space-y-6">
      {emAndamento && (
        <section>
          <p className="text-eyebrow mb-3 px-0.5 text-mauve">Continue de onde parou</p>
          <TrilhaProgressCard
            title={emAndamento.titulo}
            meta={conteudosLabel(emAndamento.consumidos, emAndamento.total)}
            progress={emAndamento.progresso}
            href={`/trilhas/${emAndamento.id}`}
          />
        </section>
      )}
      <section>
        <p className="text-eyebrow mb-[13px] px-0.5 text-mauve">Todas as trilhas</p>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {trilhas.map((t) => (
            <TrilhaCard
              key={t.id}
              title={t.titulo}
              description={t.descricao}
              progress={t.progresso}
              href={`/trilhas/${t.id}`}
              thumbUrl={t.thumb}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
