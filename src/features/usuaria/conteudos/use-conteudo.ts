'use client'

import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/components/ui'
import { conteudosUsuariaService } from '.'
import type { ConteudoDetalhe } from './types'

/**
 * useConteudo — carrega o conteúdo por id para o leitor (UF6) e gerencia a
 * marcação de progresso com atualização OTIMISTA + rollback e toast em caso de
 * falha. Distingue "erro" (recarregável) de "não encontrado" (guard). A rota usa
 * `key={id}`, então o hook remonta ao trocar de conteúdo.
 */
export function useConteudo(id: string) {
  const [conteudo, setConteudo] = useState<ConteudoDetalhe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [nonce, setNonce] = useState(0)
  const { showToast } = useToast()

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    setNonce((n) => n + 1)
  }, [])

  useEffect(() => {
    let ativo = true
    conteudosUsuariaService
      .getById(id)
      .then((c) => {
        if (!ativo) return
        if (c) {
          setConteudo(c)
          setNotFound(false)
        } else {
          setNotFound(true)
        }
        setError(null)
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar o conteúdo. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [id, nonce])

  const toggleConcluido = useCallback(async () => {
    if (!conteudo || salvando) return
    const novo = !conteudo.consumido
    setConteudo({ ...conteudo, consumido: novo }) // otimista
    setSalvando(true)
    try {
      await conteudosUsuariaService.setProgresso(conteudo.id, novo)
      showToast(novo ? 'Marcado como concluído.' : 'Marcação desfeita.', 'success')
    } catch {
      setConteudo((c) => (c ? { ...c, consumido: !novo } : c)) // rollback
      showToast('Não foi possível salvar. Tente novamente.', 'error')
    } finally {
      setSalvando(false)
    }
  }, [conteudo, salvando, showToast])

  return { conteudo, loading, error, notFound, salvando, toggleConcluido, reload }
}
