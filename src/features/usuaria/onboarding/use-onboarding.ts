'use client'

import { useCallback, useEffect, useState } from 'react'
import { onboardingUsuariaService } from '.'
import type { OnbPergunta, OnbResultado, RespostaEscolhida } from './types'

/**
 * useOnboarding — máquina de passos do questionário (UF1): carrega as perguntas,
 * registra cada resposta e, na última, chama `finalizar` para obter a fase.
 */
export function useOnboarding() {
  const [perguntas, setPerguntas] = useState<OnbPergunta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [indice, setIndice] = useState(0)
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)
  const [resultado, setResultado] = useState<OnbResultado | null>(null)
  const [nonce, setNonce] = useState(0)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setNonce((n) => n + 1)
  }, [])

  useEffect(() => {
    let ativo = true
    onboardingUsuariaService
      .getPerguntas()
      .then((ps) => {
        if (!ativo) return
        setPerguntas(ps)
        setError(null)
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar o onboarding. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [nonce])

  const atual = perguntas[indice]
  const selecionada = atual ? respostas[atual.id] : undefined
  const ehUltima = perguntas.length > 0 && indice === perguntas.length - 1
  const progresso = perguntas.length ? Math.round((indice / perguntas.length) * 100) : 0

  function selecionar(opcaoId: string) {
    if (!atual) return
    setRespostas((prev) => ({ ...prev, [atual.id]: opcaoId }))
  }

  function voltar() {
    setErroEnvio(null)
    setIndice((i) => Math.max(0, i - 1))
  }

  async function avancar() {
    if (!atual || !selecionada || enviando) return
    setEnviando(true)
    setErroEnvio(null)
    try {
      await onboardingUsuariaService.responder(atual.id, selecionada)
      if (ehUltima) {
        const lista: RespostaEscolhida[] = perguntas
          .map((p) => ({ perguntaId: p.id, opcaoId: respostas[p.id] }))
          .filter((r) => Boolean(r.opcaoId))
        const res = await onboardingUsuariaService.finalizar(lista)
        setResultado(res)
      } else {
        setIndice((i) => i + 1)
      }
    } catch {
      setErroEnvio('Não foi possível salvar sua resposta. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return {
    perguntas,
    loading,
    error,
    reload,
    atual,
    indice,
    total: perguntas.length,
    selecionada,
    ehUltima,
    progresso,
    enviando,
    erroEnvio,
    resultado,
    selecionar,
    avancar,
    voltar,
  }
}
