'use client'

import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/components/ui'
import { EmailJaCadastradoError, profissionaisService } from '.'
import type { Profissional, ProfissionalInput } from './types'

/**
 * Acesso a Profissionais na UI. Carrega a lista do backend (async) com
 * `loading`/`error`; as mutações emitem toasts e recarregam a lista. Toda a
 * persistência fica atrás do `profissionaisService` (seam em `./index`).
 */
export function useProfissionais() {
  const [items, setItems] = useState<Profissional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await profissionaisService.getAll())
    } catch {
      setError('Não foi possível carregar as profissionais. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ativo = true
    profissionaisService
      .getAll()
      .then((ps) => {
        if (ativo) setItems(ps)
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar as profissionais. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  const add = useCallback(
    async (input: ProfissionalInput, criadaPor: string): Promise<Profissional | null> => {
      try {
        const novo = await profissionaisService.add(input, criadaPor)
        setItems(await profissionaisService.getAll())
        showToast('Profissional cadastrada — convite enviado por e-mail.', 'success')
        return novo
      } catch (erro) {
        showToast(
          erro instanceof EmailJaCadastradoError ? erro.message : 'Não foi possível cadastrar a profissional.',
          'error',
        )
        return null
      }
    },
    [showToast],
  )

  const update = useCallback(
    async (id: string, input: ProfissionalInput): Promise<Profissional | null> => {
      try {
        const upd = await profissionaisService.update(id, input)
        setItems(await profissionaisService.getAll())
        showToast('Dados atualizados com sucesso.', 'success')
        return upd
      } catch {
        showToast('Não foi possível atualizar os dados.', 'error')
        return null
      }
    },
    [showToast],
  )

  const deactivate = useCallback(
    async (p: Profissional) => {
      try {
        await profissionaisService.deactivate(p.id)
        setItems(await profissionaisService.getAll())
        showToast(`${p.nome} foi desativada.`, 'info')
      } catch {
        showToast('Não foi possível desativar a profissional.', 'error')
      }
    },
    [showToast],
  )

  const reactivate = useCallback(
    async (p: Profissional) => {
      try {
        await profissionaisService.reactivate(p.id)
        setItems(await profissionaisService.getAll())
        showToast(`${p.nome} foi reativada.`, 'success')
      } catch {
        showToast('Não foi possível reativar a profissional.', 'error')
      }
    },
    [showToast],
  )

  const resendInvite = useCallback(
    async (p: Profissional) => {
      try {
        await profissionaisService.resendInvite(p.id)
        setItems(await profissionaisService.getAll())
        showToast(`Convite reenviado para ${p.nome}.`, 'success')
      } catch {
        showToast('Não foi possível reenviar o convite.', 'error')
      }
    },
    [showToast],
  )

  return { items, loading, error, add, update, deactivate, reactivate, resendInvite, reload: load }
}
