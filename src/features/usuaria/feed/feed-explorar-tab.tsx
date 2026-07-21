'use client'

import { ESSpinner, EmptyState, SearchIcon } from '@/components/ui'
import { ContentList, FilterChip, SearchField, ErrorRetry } from '../ui'
import { conteudoHref, formatDuracao, type ContentItemVM } from '../lib/content'
import { useExplorar } from '../conteudos/use-explorar'
import type { ConteudoResumo, Formato } from '../conteudos/types'

const TIPOS: { label: string; value: Formato | null }[] = [
  { label: 'Todos', value: null },
  { label: 'Artigos', value: 'artigo' },
  { label: 'Vídeos', value: 'video' },
  { label: 'Áudios', value: 'audio' },
]

function resumoToVM(c: ConteudoResumo): ContentItemVM {
  return {
    id: c.id,
    title: c.titulo,
    formato: c.formato,
    duration: formatDuracao(c.formato, c.duracao),
    meta: c.tags[0]?.nome,
    thumbUrl: c.thumb,
    consumido: c.consumido,
    href: conteudoHref(c.id),
  }
}

/** Aba "Explorar" do feed — busca (UF3) + navegação por tag/formato (UF4). */
export function FeedExplorarTab() {
  const { query, setQuery, formato, setFormato, tag, setTag, allTags, resultados, loading, error, buscando, reload } =
    useExplorar()

  // Chips de tag (UF4): derivados das tags reais que o backend passou a expor no
  // conteúdo (id + nome). Só aparecem fora da busca. Clicar filtra via `?tag=<id>`.
  return (
    <div className="space-y-4">
      <SearchField value={query} onChange={setQuery} />

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" style={{ scrollbarWidth: 'none' }}>
        {TIPOS.map((t) => (
          <FilterChip key={t.label} label={t.label} active={formato === t.value} onClick={() => setFormato(t.value)} />
        ))}
      </div>

      {!buscando && allTags.length > 0 && (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" style={{ scrollbarWidth: 'none' }}>
          <FilterChip label="Todas" active={tag === null} onClick={() => setTag(null)} />
          {allTags.map((t) => (
            <FilterChip
              key={t.id}
              label={t.nome}
              active={tag === t.id}
              onClick={() => setTag(tag === t.id ? null : t.id)}
            />
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <ESSpinner label="Carregando…" />
        </div>
      ) : error ? (
        <ErrorRetry message={error} onRetry={reload} />
      ) : resultados.length === 0 ? (
        <EmptyState
          icon={<SearchIcon />}
          title="Nenhum conteúdo"
          description={buscando ? `Nada encontrado para “${query.trim()}”.` : 'Nenhum conteúdo com esses filtros.'}
        />
      ) : (
        <ContentList items={resultados.map(resumoToVM)} variant="compact" grid />
      )}
    </div>
  )
}
