'use client'

import { useEffect, useState } from 'react'
import { conteudosUsuariaService } from '.'
import type { ConteudoResumo } from './types'

/**
 * useRecentes — conteúdos mais recentes SEM filtro de fase (`GET /conteudos`).
 * Alimenta a home de quem ainda não tem fase inferida (pré-onboarding), para não
 * exibir uma vitrine vazia. Ordena por `publicadoEm` desc (datas ISO comparam
 * lexicograficamente; itens sem data vão para o fim).
 *
 * `enabled` evita a chamada quando ela não é necessária (usuária já tem fase — a
 * home usa o feed por fase). Enquanto `enabled` é `false`, não busca e não fica
 * presa em loading.
 */
export function useRecentes(limite = 6, enabled = true) {
  const [itens, setItens] = useState<ConteudoResumo[]>([])
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let ativo = true
    conteudosUsuariaService
      .listar({})
      .then((lista) => {
        if (!ativo) return
        const ordenada = [...lista].sort(
          (a, b) => (b.publicadoEm ?? '').localeCompare(a.publicadoEm ?? ''),
        )
        setItens(ordenada.slice(0, limite))
      })
      .catch(() => {
        if (ativo) setItens([])
      })
      .finally(() => {
        if (ativo) setCarregado(true)
      })
    return () => {
      ativo = false
    }
  }, [limite, enabled])

  // Loading derivado: só carrega quando habilitado e ainda não concluiu a busca.
  return { itens, loading: enabled && !carregado }
}
