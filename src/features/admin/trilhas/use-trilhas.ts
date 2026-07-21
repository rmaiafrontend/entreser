'use client'

import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/components/ui'
import { isApiError } from '@/lib/http'
import { trilhasService } from '.'
import type { Trilha, TrilhaInput } from './types'

/** Mensagem de erro de salvamento: usa o texto do backend em 400 (ex.: validação
 *  anti-base64 do `thumbUrl`), senão uma genérica. Espelha `useConteudos`. */
function mensagemSalvar(erro: unknown): string {
  if (isApiError(erro, 'bad_request') && erro.message) return erro.message
  return 'Não foi possível salvar a trilha.'
}

/**
 * Hook da LISTAGEM de trilhas. Carrega a lista no mount (com o N+1 de hidratação
 * do serviço). As mutações vivem em `useTrilhaMutations` — o formulário NÃO deve
 * usar este hook só para pegar `add`/`update`, senão pagaria o custo da listagem
 * inteira a cada abertura (ES-019).
 */
export function useTrilhas() {
  const [items, setItems] = useState<Trilha[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await trilhasService.getAll())
    } catch {
      setError('Não foi possível carregar as trilhas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ativo = true
    trilhasService
      .getAll()
      .then((ts) => {
        if (ativo) setItems(ts)
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
  }, [])

  return { items, loading, error, reload: load }
}

/**
 * Mutações de trilha (criar/atualizar) SEM carregar a listagem. É o que o
 * formulário precisa — evita o `getAll()` (e o N+1 embutido) que `useTrilhas`
 * dispara no mount. Cada operação devolve `boolean` para o chamador decidir se
 * navega (ES-015: só sair da tela em caso de sucesso).
 */
export function useTrilhaMutations() {
  const { showToast } = useToast()

  const add = useCallback(
    async (input: TrilhaInput): Promise<boolean> => {
      try {
        await trilhasService.add(input)
        showToast(input.publicada ? 'Trilha publicada.' : 'Rascunho salvo.', 'success')
        return true
      } catch (erro) {
        showToast(mensagemSalvar(erro), 'error')
        return false
      }
    },
    [showToast],
  )

  const update = useCallback(
    async (id: string, input: TrilhaInput): Promise<boolean> => {
      try {
        await trilhasService.update(id, input)
        showToast(input.publicada ? 'Trilha publicada.' : 'Alterações salvas.', 'success')
        return true
      } catch (erro) {
        showToast(mensagemSalvar(erro), 'error')
        return false
      }
    },
    [showToast],
  )

  return { add, update }
}

/**
 * Hook read-only da LISTA de trilhas como dado de referência (ex.: painel de
 * métricas). Carrega uma vez; lista vazia em falha.
 */
export function useTrilhaOptions(): Trilha[] {
  const [trilhas, setTrilhas] = useState<Trilha[]>([])
  useEffect(() => {
    let ativo = true
    trilhasService
      .getAll()
      .then((ts) => {
        if (ativo) setTrilhas(ts)
      })
      .catch(() => {
        /* options vazias em falha */
      })
    return () => {
      ativo = false
    }
  }, [])
  return trilhas
}
