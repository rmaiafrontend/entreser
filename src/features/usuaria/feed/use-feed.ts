'use client'

import { useCallback, useEffect, useState } from 'react'
import { feedService } from '.'
import type { FeedFase, FeedItem } from './types'

interface UseFeedOptions {
  /** Filtro por tag (id). Recarrega quando muda. */
  tag?: string
  tamanho?: number
}

/**
 * useFeed — carrega o feed personalizado com paginação incremental ("Carregar
 * mais"). `reload` revalida após troca de fase (UF7). O efeito só faz setState em
 * callbacks assíncronos; `reload` marca o loading no contexto de evento.
 */
export function useFeed({ tag, tamanho = 20 }: UseFeedOptions = {}) {
  const [itens, setItens] = useState<FeedItem[]>([])
  const [fase, setFase] = useState<FeedFase | null>(null)
  const [pagina, setPagina] = useState(0)
  const [temMais, setTemMais] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setNonce((n) => n + 1)
  }, [])

  useEffect(() => {
    let ativo = true
    feedService
      .getFeed({ pagina: 0, tamanho, tag })
      .then((r) => {
        if (!ativo) return
        setItens(r.itens)
        setFase(r.fase)
        setPagina(r.pagina)
        setTemMais(r.temMais)
        setError(null)
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar o feed. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [tag, tamanho, nonce])

  const loadMore = useCallback(async () => {
    if (loadingMore || !temMais) return
    setLoadingMore(true)
    try {
      const r = await feedService.getFeed({ pagina: pagina + 1, tamanho, tag })
      setItens((prev) => [...prev, ...r.itens])
      setPagina(r.pagina)
      setTemMais(r.temMais)
      setFase(r.fase)
    } catch {
      /* silencioso — o botão "Carregar mais" continua disponível para nova tentativa */
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, temMais, pagina, tamanho, tag])

  return { itens, fase, loading, loadingMore, error, temMais, loadMore, reload }
}
