'use client'

import { useCallback, useEffect, useState } from 'react'
import { conteudosUsuariaService } from '.'
import type { ConteudoResumo, Formato } from './types'

/**
 * useExplorar — estado da aba Explorar: busca por palavra-chave (UF3, debounced)
 * e navegação por tag/formato (UF4). Com termo (≥2 chars) busca; sem termo lista
 * por tag/formato. O filtro de formato também recorta os resultados da busca.
 */
export function useExplorar() {
  const [query, setQuery] = useState('')
  const [formato, setFormato] = useState<Formato | null>(null)
  const [tag, setTag] = useState<string | null>(null)
  const [resultados, setResultados] = useState<ConteudoResumo[]>([])
  const [allTags, setAllTags] = useState<{ id: string; nome: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  // Debounce do termo digitado.
  const [debounced, setDebounced] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  const buscando = debounced.length >= 2

  useEffect(() => {
    let ativo = true
    ;(async () => {
      try {
        const base = buscando
          ? await conteudosUsuariaService.buscar(debounced)
          : await conteudosUsuariaService.listar({ tag: tag ?? undefined, formato: formato ?? undefined })
        if (!ativo) return
        setResultados(formato ? base.filter((c) => c.formato === formato) : base)
        // Vocabulário dos chips: derivado das tags reais do conteúdo, só numa carga
        // COMPLETA (sem busca/tag/formato), para os chips ficarem estáveis ao filtrar.
        if (!buscando && tag === null && !formato) {
          const map = new Map<string, string>()
          base.forEach((c) => c.tags.forEach((t) => t.nome && map.set(t.id, t.nome)))
          setAllTags([...map].map(([id, nome]) => ({ id, nome })).sort((a, b) => a.nome.localeCompare(b.nome)))
        }
        setError(null)
      } catch {
        if (ativo) setError('Não foi possível carregar os conteúdos. Tente novamente.')
      } finally {
        if (ativo) setLoading(false)
      }
    })()
    return () => {
      ativo = false
    }
  }, [debounced, buscando, tag, formato, nonce])

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setNonce((n) => n + 1)
  }, [])

  return { query, setQuery, formato, setFormato, tag, setTag, allTags, resultados, loading, error, buscando, reload }
}
