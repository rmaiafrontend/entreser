'use client'

import { useEffect, useState } from 'react'
import { metricasService } from '.'
import type { Metricas, Resumo } from './types'

/** Carrega os agregados (`/admin/metricas` + `/admin/resumo`) em paralelo. */
export function useMetricas() {
  const [metricas, setMetricas] = useState<Metricas | null>(null)
  const [resumo, setResumo] = useState<Resumo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [nonce, setNonce] = useState(0)

  const reload = () => {
    setLoading(true)
    setNonce((n) => n + 1)
  }

  useEffect(() => {
    let ativo = true
    Promise.all([metricasService.getMetricas(), metricasService.getResumo()])
      .then(([m, r]) => {
        if (!ativo) return
        setMetricas(m)
        setResumo(r)
        setError(false)
      })
      .catch(() => {
        if (ativo) setError(true)
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [nonce])

  return { metricas, resumo, loading, error, reload }
}
