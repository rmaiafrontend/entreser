'use client'

import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/components/ui'
import { isApiError } from '@/lib/http'
import { conteudosService } from '.'
import type { Conteudo, ConteudoInput } from './types'

/** Mensagem de erro de salvamento: usa o texto do backend em 400 (ex.: validação
 *  de `corpoArtigo`), senão uma genérica. */
function mensagemSalvar(erro: unknown): string {
  if (isApiError(erro, 'bad_request') && erro.message) return erro.message
  return 'Não foi possível salvar o conteúdo.'
}

export function useConteudos() {
  const [items, setItems] = useState<Conteudo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await conteudosService.getAll())
    } catch {
      setError('Não foi possível carregar os conteúdos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ativo = true
    conteudosService
      .getAll()
      .then((cs) => {
        if (ativo) setItems(cs)
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar os conteúdos. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  const add = useCallback(
    async (input: ConteudoInput): Promise<Conteudo | null> => {
      try {
        const novo = await conteudosService.add(input)
        setItems(await conteudosService.getAll())
        showToast(input.publicado ? 'Conteúdo publicado.' : 'Rascunho salvo.', 'success')
        return novo
      } catch (erro) {
        showToast(mensagemSalvar(erro), 'error')
        return null
      }
    },
    [showToast],
  )

  const update = useCallback(
    async (id: string, input: ConteudoInput): Promise<boolean> => {
      try {
        await conteudosService.update(id, input)
        setItems(await conteudosService.getAll())
        showToast(input.publicado ? 'Conteúdo publicado.' : 'Alterações salvas.', 'success')
        return true
      } catch (erro) {
        showToast(mensagemSalvar(erro), 'error')
        return false
      }
    },
    [showToast],
  )

  const togglePublish = useCallback(
    async (c: Conteudo) => {
      try {
        await conteudosService.togglePublish(c)
        setItems(await conteudosService.getAll())
        showToast(c.publicado ? 'Conteúdo despublicado.' : 'Conteúdo publicado.', 'success')
      } catch {
        showToast('Não foi possível alterar a publicação.', 'error')
      }
    },
    [showToast],
  )

  const remove = useCallback(
    async (c: Conteudo) => {
      try {
        await conteudosService.remove(c.id)
        // Backend faz soft delete (despublica); some da lista admin de forma
        // otimista — o registro permanece como rascunho recuperável no banco.
        setItems((prev) => prev.filter((x) => x.id !== c.id))
        showToast('Conteúdo removido da biblioteca.', 'success')
      } catch {
        showToast('Não foi possível remover o conteúdo.', 'error')
      }
    },
    [showToast],
  )

  return { items, loading, error, add, update, togglePublish, remove, reload: load }
}

/**
 * Mutações de conteúdo (criar/atualizar) SEM carregar a biblioteca. É o que o
 * formulário precisa — evita o `getAll()` que `useConteudos` dispara no mount e o
 * refetch pós-save, ambos descartados pela navegação de volta à listagem, que
 * refetcha ao remontar (mesmo motivo de `useTrilhaMutations`, anti-padrão ES-019).
 * Mantém o contrato de retorno de `useConteudos` (`add`→`Conteudo | null`,
 * `update`→`boolean`) para o ContentForm decidir se navega (ES-015).
 */
export function useConteudoMutations() {
  const { showToast } = useToast()

  const add = useCallback(
    async (input: ConteudoInput): Promise<Conteudo | null> => {
      try {
        const novo = await conteudosService.add(input)
        showToast(input.publicado ? 'Conteúdo publicado.' : 'Rascunho salvo.', 'success')
        return novo
      } catch (erro) {
        showToast(mensagemSalvar(erro), 'error')
        return null
      }
    },
    [showToast],
  )

  const update = useCallback(
    async (id: string, input: ConteudoInput): Promise<boolean> => {
      try {
        await conteudosService.update(id, input)
        showToast(input.publicado ? 'Conteúdo publicado.' : 'Alterações salvas.', 'success')
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

export interface ConteudoOptions {
  conteudos: Conteudo[]
  /** true enquanto a primeira carga não terminou. */
  loading: boolean
  /** true se a carga falhou — distingue "biblioteca não carregou" de "vazia". */
  error: boolean
}

/**
 * Hook read-only da LISTA de conteúdos como dado de referência (ex.: picker da
 * trilha, painel de métricas). Carrega uma vez. Expõe `loading` e `error` para
 * que o consumidor NÃO confunda "carregando" com "vazio" (ES-016): resolver ids
 * contra uma lista ainda vazia faria uma curadoria sumir da tela em silêncio.
 */
export function useConteudoOptions(): ConteudoOptions {
  const [conteudos, setConteudos] = useState<Conteudo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  useEffect(() => {
    let ativo = true
    conteudosService
      .getAll()
      .then((cs) => {
        if (ativo) setConteudos(cs)
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
  }, [])
  return { conteudos, loading, error }
}
