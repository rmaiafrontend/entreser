'use client'

import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/components/ui'
import { faseUsuariaService } from '.'
import type { MinhaFase } from './types'

/**
 * useMinhaFase — carrega a fase atual + fases disponíveis (UF7) e troca a fase
 * manualmente. Após a troca, a fase atual é atualizada localmente; o feed reflete
 * na próxima visita (recarrega ao montar).
 */
export function useMinhaFase() {
  const [data, setData] = useState<MinhaFase | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [nonce, setNonce] = useState(0)
  const { showToast } = useToast()

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setNonce((n) => n + 1)
  }, [])

  useEffect(() => {
    let ativo = true
    faseUsuariaService
      .getMinhaFase()
      .then((mf) => {
        if (!ativo) return
        setData(mf)
        setError(null)
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar sua fase. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [nonce])

  const trocar = useCallback(
    async (faseId: string): Promise<boolean> => {
      setSalvando(true)
      try {
        const nova = await faseUsuariaService.trocarFase(faseId)
        setData((prev) => (prev ? { ...prev, atual: nova } : prev))
        showToast('Fase atualizada.', 'success')
        return true
      } catch {
        showToast('Não foi possível atualizar a fase.', 'error')
        return false
      } finally {
        setSalvando(false)
      }
    },
    [showToast],
  )

  return { data, loading, error, salvando, trocar, reload }
}
