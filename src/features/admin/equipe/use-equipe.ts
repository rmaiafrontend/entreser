'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '@/components/ui'
import { EmailJaCadastradoError, equipeService } from '.'
import type { EquipeInput, EquipeMembro } from './types'

/**
 * Acesso a Equipe na UI. Carrega a lista do backend (async) com `loading`/`error`;
 * o cadastro emite toast e recarrega. Toda a persistência fica atrás do
 * `equipeService` (seam em `./index`).
 *
 * `existingEmails` alimenta a checagem de unicidade do formulário só com os
 * e-mails da própria equipe — que já estão em memória. O servidor valida contra
 * todos os usuários da plataforma e responde `409`, que o `add` traduz em toast
 * mantendo o modal aberto; buscar a coleção de profissionais só para adiantar
 * essa checagem custava um `GET /profissional` por load e continuava incompleto
 * (não cobre pacientes).
 */
export function useEquipe() {
  const [items, setItems] = useState<EquipeMembro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await equipeService.getAll())
    } catch {
      setError('Não foi possível carregar a equipe. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ativo = true
    equipeService
      .getAll()
      .then((ms) => {
        if (ativo) setItems(ms)
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar a equipe. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  const existingEmails = useMemo(() => items.map((m) => m.email), [items])

  const add = useCallback(
    async (input: EquipeInput): Promise<EquipeMembro | null> => {
      try {
        const novo = await equipeService.add(input)
        setItems(await equipeService.getAll())
        showToast(`Membro adicionado. Enviamos a senha temporária para ${novo.email}.`, 'success')
        return novo
      } catch (erro) {
        showToast(
          erro instanceof EmailJaCadastradoError ? erro.message : 'Não foi possível adicionar o membro.',
          'error',
        )
        return null
      }
    },
    [showToast],
  )

  return { items, loading, error, existingEmails, add, reload: load }
}
