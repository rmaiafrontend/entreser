'use client'

import { useCallback, useEffect, useState } from 'react'
import { trilhasUsuariaService } from '.'
import type { TrilhaDetalhe, TrilhaResumo } from './types'

/** useTrilhas — lista de trilhas publicadas com progresso (UF5). */
export function useTrilhas() {
  const [trilhas, setTrilhas] = useState<TrilhaResumo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setNonce((n) => n + 1)
  }, [])

  useEffect(() => {
    let ativo = true
    trilhasUsuariaService
      .getAll()
      .then((ts) => {
        if (!ativo) return
        setTrilhas(ts)
        setError(null)
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar as trilhas. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [nonce])

  return { trilhas, loading, error, reload }
}

/** useTrilha — detalhe de uma trilha por id (UF5). A rota usa `key={id}`. */
export function useTrilha(id: string) {
  const [trilha, setTrilha] = useState<TrilhaDetalhe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [nonce, setNonce] = useState(0)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    setNonce((n) => n + 1)
  }, [])

  useEffect(() => {
    let ativo = true
    trilhasUsuariaService
      .getById(id)
      .then((t) => {
        if (!ativo) return
        if (t) {
          setTrilha(t)
          setNotFound(false)
        } else {
          setNotFound(true)
        }
        setError(null)
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar a trilha. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [id, nonce])

  return { trilha, loading, error, notFound, reload }
}
