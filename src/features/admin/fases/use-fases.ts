'use client'

import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/components/ui'
import { applyOrder, reorderIdsBySwap } from '@/features/admin/lib/reorder'
import { fasesService } from '.'
import type { Fase, FaseInput } from './types'

export function useFases() {
  const [items, setItems] = useState<Fase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await fasesService.getAll())
    } catch {
      setError('Não foi possível carregar as fases. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ativo = true
    fasesService
      .getAll()
      .then((fs) => {
        if (ativo) setItems(fs)
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar as fases. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  const add = useCallback(
    async (input: FaseInput): Promise<boolean> => {
      try {
        // Idem `update`: a fase devolvida já traz as tags recém-persistidas;
        // um GET imediato poderia não enxergar o PUT de tags ainda.
        const nova = await fasesService.add(input)
        setItems((prev) => [...prev, nova])
        showToast(`Fase "${nova.nome}" criada.`, 'success')
        return true
      } catch {
        showToast('Não foi possível criar a fase.', 'error')
        return false
      }
    },
    [showToast],
  )

  const update = useCallback(
    async (id: string, input: FaseInput): Promise<boolean> => {
      try {
        // Usa a fase autoritativa devolvida pelo serviço (já traz as tags que
        // acabamos de persistir). Um GET aqui pode não enxergar o PUT de tags
        // ainda — o card mostraria as tags antigas até dar refresh.
        const atualizada = await fasesService.update(id, input)
        setItems((prev) => prev.map((f) => (f.id === id ? atualizada : f)))
        showToast('Fase atualizada.', 'success')
        return true
      } catch {
        showToast('Não foi possível atualizar a fase.', 'error')
        return false
      }
    },
    [showToast],
  )

  const move = useCallback(
    async (id: string, dir: -1 | 1) => {
      const orderedIds = reorderIdsBySwap(items, id, dir)
      if (!orderedIds) return
      try {
        await fasesService.reorder(orderedIds)
        setItems((prev) => applyOrder(prev, orderedIds))
      } catch {
        showToast('Não foi possível reordenar as fases.', 'error')
      }
    },
    [items, showToast],
  )

  return { items, loading, error, add, update, move, reload: load }
}

/**
 * Hook read-only da LISTA de fases como dado de referência (ex.: painel de
 * métricas, mapeamento do onboarding). Carrega uma vez; lista vazia em falha.
 */
export function useFaseOptions(): Fase[] {
  const [fases, setFases] = useState<Fase[]>([])
  useEffect(() => {
    let ativo = true
    fasesService
      .getAll()
      .then((fs) => {
        if (ativo) setFases(fs)
      })
      .catch(() => {
        /* options vazias em falha */
      })
    return () => {
      ativo = false
    }
  }, [])
  return fases
}
