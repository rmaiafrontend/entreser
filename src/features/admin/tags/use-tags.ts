'use client'

import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/components/ui'
import { sortByText } from '@/features/admin/lib/sort'
import { TagEmUsoError, tagsService } from '.'
import type { TagItem } from './types'

/** Resultado da remoção — distingue sucesso, "tag em uso" e falha genérica. */
export type RemoveResult = { ok: true } | { ok: false; emUso: boolean }

/**
 * Ordenação estável por nome (ES-003). As contagens `usoConteudos`/`usoFases`
 * agora vêm do próprio `GET /admin/tags` (14/jul) — não é mais preciso baixar a
 * biblioteca de conteúdos para contá-las no cliente.
 */
function sortTags(tags: TagItem[]): TagItem[] {
  return sortByText(tags, (t) => t.nome)
}

export function useTags() {
  const [items, setItems] = useState<TagItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(sortTags(await tagsService.getAll()))
    } catch {
      setError('Não foi possível carregar as tags. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ativo = true
    tagsService
      .getAll()
      .then((t) => {
        if (ativo) setItems(sortTags(t))
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar as tags. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  const add = useCallback(
    async (nome: string): Promise<TagItem | null> => {
      try {
        const novo = await tagsService.add(nome)
        setItems(sortTags(await tagsService.getAll()))
        showToast(`Tag "${novo.nome}" criada.`, 'success')
        return novo
      } catch {
        showToast('Não foi possível criar a tag.', 'error')
        return null
      }
    },
    [showToast],
  )

  const rename = useCallback(
    async (id: string, nome: string): Promise<boolean> => {
      try {
        await tagsService.rename(id, nome)
        setItems(sortTags(await tagsService.getAll()))
        showToast('Tag renomeada.', 'success')
        return true
      } catch {
        showToast('Não foi possível renomear a tag.', 'error')
        return false
      }
    },
    [showToast],
  )

  const remove = useCallback(
    async (t: TagItem): Promise<RemoveResult> => {
      try {
        await tagsService.remove(t.id)
        setItems(sortTags(await tagsService.getAll()))
        showToast('Tag removida.', 'success')
        return { ok: true }
      } catch (erro) {
        if (erro instanceof TagEmUsoError) return { ok: false, emUso: true }
        showToast('Não foi possível remover a tag.', 'error')
        return { ok: false, emUso: false }
      }
    },
    [showToast],
  )

  return { items, loading, error, add, rename, remove, reload: load }
}

/**
 * Hook read-only para consumidores que só precisam da LISTA de tags como dado
 * de referência (pickers, filtros) — ex.: Conteúdos e Fases. Carrega uma vez;
 * em falha, devolve lista vazia silenciosamente.
 */
export function useTagOptions(): TagItem[] {
  const [tags, setTags] = useState<TagItem[]>([])
  useEffect(() => {
    let ativo = true
    tagsService
      .getAll()
      .then((t) => {
        if (ativo) setTags(t)
      })
      .catch(() => {
        /* options vazias em falha */
      })
    return () => {
      ativo = false
    }
  }, [])
  return tags
}
