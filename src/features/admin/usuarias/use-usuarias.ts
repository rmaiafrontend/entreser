'use client'

import { useEffect, useState } from 'react'
import { usuariasService } from '.'
import type { Plano, UsuariaRow, UsuariaStatus } from './data'

const PAGE_SIZE = 20

/** Valor debounced — evita refetch a cada tecla na busca. */
function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

export function useUsuarias() {
  const [rows, setRows] = useState<UsuariaRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [busca, setBuscaValue] = useState('')
  const [status, setStatusValue] = useState<UsuariaStatus | ''>('')
  const [plano, setPlanoValue] = useState<Plano | ''>('')
  const [nonce, setNonce] = useState(0)

  const buscaDebounced = useDebounced(busca, 350)

  // Handlers (contexto de evento) resetam a página ao trocar um filtro.
  const setBusca = (v: string) => {
    setBuscaValue(v)
    setPage(0)
  }
  const setStatus = (v: UsuariaStatus | '') => {
    setStatusValue(v)
    setPage(0)
  }
  const setPlano = (v: Plano | '') => {
    setPlanoValue(v)
    setPage(0)
  }
  const clear = () => {
    setBuscaValue('')
    setStatusValue('')
    setPlanoValue('')
    setPage(0)
  }
  const reload = () => {
    setLoading(true)
    setNonce((n) => n + 1)
  }

  useEffect(() => {
    let ativo = true
    usuariasService
      .list({ page, size: PAGE_SIZE, busca: buscaDebounced, status, plano })
      .then((res) => {
        if (!ativo) return
        setRows(res.rows)
        setTotalPages(res.totalPages)
        setTotalElements(res.totalElements)
        setError(null)
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar as usuárias. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [page, buscaDebounced, status, plano, nonce])

  const hasFilters = Boolean(busca || status || plano)

  return {
    rows,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    setPage,
    busca,
    setBusca,
    status,
    setStatus,
    plano,
    setPlano,
    hasFilters,
    clear,
    reload,
  }
}
