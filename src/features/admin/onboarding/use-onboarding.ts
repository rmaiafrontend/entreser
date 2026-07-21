'use client'

import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/components/ui'
import { applyOrder, reorderIdsBySwap } from '@/features/admin/lib/reorder'
import { onboardingService } from '.'
import { OnboardingEmUsoError } from './service'
import type { OpcaoInput, Pergunta, PerguntaInput } from './types'

/** Hook da LISTA de perguntas (tela principal do onboarding). */
export function useOnboarding() {
  const [items, setItems] = useState<Pergunta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await onboardingService.getAll())
    } catch {
      setError('Não foi possível carregar as perguntas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ativo = true
    onboardingService
      .getAll()
      .then((ps) => {
        if (ativo) setItems(ps)
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar as perguntas. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  // As mutações abaixo aplicam o resultado ao estado local em vez de refazer
  // `getAll()` — que re-executaria o N+1 de hidratação (1 by-id por pergunta) a
  // cada clique. A view ordena por `ordem` (não dependemos da ordem do array), e
  // preservamos `opcoes` em cada update (os cards contam opções e checam mapa).
  const addPergunta = useCallback(
    async (input: PerguntaInput) => {
      try {
        const nova = await onboardingService.addPergunta(input)
        setItems((prev) => [...prev, nova])
        showToast('Pergunta criada. Adicione opções e mapeamentos para ativá-la.', 'success')
      } catch {
        showToast('Não foi possível criar a pergunta.', 'error')
      }
    },
    [showToast],
  )

  const updatePergunta = useCallback(
    async (id: string, input: PerguntaInput, toastMsg?: string) => {
      try {
        await onboardingService.updatePergunta(id, input)
        // Editar/ativar/reordem-por-input mexe só nos escalares; `opcoes` permanece.
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...input } : p)))
        if (toastMsg) showToast(toastMsg, 'success')
      } catch {
        showToast('Não foi possível atualizar a pergunta.', 'error')
      }
    },
    [showToast],
  )

  const movePergunta = useCallback(
    async (id: string, dir: -1 | 1) => {
      // Deriva a lista completa de ids na ordem final (o hook tem `items` em
      // memória) e chama o reorder transacional — substitui o swap de 2 PATCH
      // que colidia no UNIQUE(ordem) e corrompia a ordem em silêncio.
      const orderedIds = reorderIdsBySwap(items, id, dir)
      if (!orderedIds) return
      try {
        await onboardingService.reorderPerguntas(orderedIds)
        setItems((prev) => applyOrder(prev, orderedIds))
      } catch {
        showToast('Não foi possível reordenar as perguntas.', 'error')
      }
    },
    [items, showToast],
  )

  const deletePergunta = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await onboardingService.deletePergunta(id)
        setItems((prev) => prev.filter((p) => p.id !== id))
        showToast('Pergunta excluída.', 'success')
        return true
      } catch (erro) {
        showToast(
          erro instanceof OnboardingEmUsoError ? erro.message : 'Não foi possível excluir a pergunta.',
          'error',
        )
        return false
      }
    },
    [showToast],
  )

  return { items, loading, error, addPergunta, updatePergunta, deletePergunta, movePergunta, reload: load }
}

/** Hook de UMA pergunta com opções + mapeamentos (tela de opções). */
export function usePergunta(perguntaId: string) {
  const [pergunta, setPergunta] = useState<Pergunta | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const load = useCallback(async () => {
    try {
      setPergunta(await onboardingService.getById(perguntaId))
    } catch {
      setError('Não foi possível carregar a pergunta.')
      setPergunta(null)
    }
  }, [perguntaId])

  useEffect(() => {
    let ativo = true
    onboardingService
      .getById(perguntaId)
      .then((p) => {
        if (ativo) setPergunta(p)
      })
      .catch(() => {
        if (ativo) {
          setError('Não foi possível carregar a pergunta.')
          setPergunta(null)
        }
      })
    return () => {
      ativo = false
    }
  }, [perguntaId])

  const addOpcao = useCallback(
    async (pid: string, input: OpcaoInput) => {
      try {
        await onboardingService.addOpcao(pid, input)
        await load()
        showToast('Opção adicionada.', 'success')
      } catch {
        showToast('Não foi possível adicionar a opção.', 'error')
      }
    },
    [load, showToast],
  )

  const updateOpcao = useCallback(
    async (pid: string, opcaoId: string, input: OpcaoInput) => {
      try {
        await onboardingService.updateOpcao(pid, opcaoId, input)
        await load()
        showToast('Opção atualizada.', 'success')
      } catch {
        showToast('Não foi possível atualizar a opção.', 'error')
      }
    },
    [load, showToast],
  )

  const moveOpcao = useCallback(
    async (pid: string, opcaoId: string, dir: -1 | 1) => {
      if (!pergunta) return
      const orderedIds = reorderIdsBySwap(pergunta.opcoes, opcaoId, dir)
      if (!orderedIds) return
      try {
        await onboardingService.reorderOpcoes(pid, orderedIds)
        await load()
      } catch {
        showToast('Não foi possível reordenar as opções.', 'error')
      }
    },
    [pergunta, load, showToast],
  )

  const deleteOpcao = useCallback(
    async (pid: string, opcaoId: string): Promise<boolean> => {
      try {
        await onboardingService.deleteOpcao(pid, opcaoId)
        await load()
        showToast('Opção excluída.', 'success')
        return true
      } catch (erro) {
        showToast(
          erro instanceof OnboardingEmUsoError ? erro.message : 'Não foi possível excluir a opção.',
          'error',
        )
        return false
      }
    },
    [load, showToast],
  )

  const setMapa = useCallback(
    async (pid: string, opcaoId: string, mapa: Record<string, number>) => {
      try {
        await onboardingService.setMapa(pid, opcaoId, mapa)
        await load()
        showToast('Mapeamento salvo. Vale para as próximas usuárias.', 'success')
      } catch {
        showToast('Não foi possível salvar o mapeamento.', 'error')
      }
    },
    [load, showToast],
  )

  return { pergunta, error, addOpcao, updateOpcao, deleteOpcao, moveOpcao, setMapa, reload: load }
}
