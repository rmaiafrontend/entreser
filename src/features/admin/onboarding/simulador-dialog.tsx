'use client'

import { useEffect, useMemo, useState } from 'react'
import { Dialog, ESButton, ESSpinner, InfoNote, SelectInput } from '@/components/ui'
import type { Fase } from '@/features/admin/fases/types'
import { onboardingService } from '.'
import { analisarCobertura, inferirFase, type FaseLite } from './inferencia'
import type { Pergunta } from './types'

interface SimuladorDialogProps {
  fases: Fase[]
  onClose: () => void
}

/**
 * Wrapper do Simulador: a lista de onboarding não hidrata mais as opções (N+1
 * eliminado), então carregamos as perguntas COMPLETAS (`getAllFull`) só ao abrir
 * o simulador — que precisa das opções + mapa de todas as perguntas.
 */
export function SimuladorDialog({ fases, onClose }: SimuladorDialogProps) {
  const [perguntas, setPerguntas] = useState<Pergunta[] | null>(null)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    let ativo = true
    onboardingService
      .getAllFull()
      .then((ps) => {
        if (ativo) setPerguntas(ps)
      })
      .catch(() => {
        if (ativo) setErro(true)
      })
    return () => {
      ativo = false
    }
  }, [])

  if (perguntas === null) {
    return (
      <Dialog
        isOpen
        onClose={onClose}
        width={560}
        title="Simulador de inferência"
        footer={
          <ESButton variant="primary" onPress={onClose}>
            Fechar
          </ESButton>
        }
      >
        <div className="flex justify-center py-12">
          {erro ? (
            <p className="text-sm text-plum/60">Não foi possível carregar as perguntas. Tente novamente.</p>
          ) : (
            <ESSpinner size="md" label="Carregando perguntas…" />
          )}
        </div>
      </Dialog>
    )
  }

  return <SimuladorContent perguntas={perguntas} fases={fases} onClose={onClose} />
}

interface SimuladorContentProps {
  perguntas: Pergunta[]
  fases: Fase[]
  onClose: () => void
}

/**
 * Simulador de inferência de fase (ES-020). Deixa a equipe escolher respostas e
 * ver qual fase resultaria, e analisa TODAS as combinações para flagrar fases
 * inalcançáveis e empates — antes de o onboarding ir ao ar.
 */
function SimuladorContent({ perguntas, fases, onClose }: SimuladorContentProps) {
  const ativas = useMemo(
    () => perguntas.filter((p) => p.ativa).sort((a, b) => a.ordem - b.ordem),
    [perguntas],
  )
  // ALGO-FASE: a inferência do backend considera SOMENTE fases ativas — tanto na
  // soma de pontos quanto no desempate por ordem (corrigido no backend em 16/jul).
  // O simulador espelha isso; incluir inativas prometeria uma fase que o backend
  // nunca atribuiria.
  const fasesAtivas = useMemo(() => fases.filter((f) => f.ativa), [fases])
  const inativas = fases.length - fasesAtivas.length
  const semFasesAtivas = fases.length > 0 && fasesAtivas.length === 0
  const fasesLite = useMemo<FaseLite[]>(
    () => fasesAtivas.map((f) => ({ id: f.id, nome: f.nome, ordem: f.ordem })),
    [fasesAtivas],
  )

  // Uma opção escolhida por pergunta ativa (default: a primeira, por ordem).
  const [escolhas, setEscolhas] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const p of ativas) {
      const primeira = [...p.opcoes].sort((a, b) => a.ordem - b.ordem)[0]
      if (primeira) init[p.id] = primeira.id
    }
    return init
  })

  const escolhidas = useMemo(
    () =>
      ativas
        .map((p) => p.opcoes.find((o) => o.id === escolhas[p.id]))
        .filter((o): o is NonNullable<typeof o> => Boolean(o)),
    [ativas, escolhas],
  )

  const resultado = useMemo(() => inferirFase(fasesLite, escolhidas), [fasesLite, escolhidas])
  const analise = useMemo(() => analisarCobertura(ativas, fasesLite), [ativas, fasesLite])
  const maxPontos = Math.max(1, ...resultado.pontosPorFase.map((p) => p.pontos))

  return (
    <Dialog
      isOpen
      onClose={onClose}
      width={560}
      title="Simulador de inferência"
      description="Escolha uma resposta para cada pergunta ativa e veja qual fase resultaria — sem cadastrar uma usuária de teste."
      footer={
        <ESButton variant="primary" onPress={onClose}>
          Fechar
        </ESButton>
      }
    >
      <div className="max-h-[62vh] overflow-y-auto pr-1">
        {ativas.length === 0 ? (
          <InfoNote>
            Nenhuma pergunta ativa — o onboarding está desligado. Novas usuárias não recebem fase.
          </InfoNote>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {ativas.map((p) => {
                const ops = [...p.opcoes].sort((a, b) => a.ordem - b.ordem)
                return (
                  <SelectInput
                    key={p.id}
                    label={p.texto}
                    selectedKey={escolhas[p.id] ?? ''}
                    onChange={(v) => setEscolhas((e) => ({ ...e, [p.id]: v }))}
                    options={ops.map((o) => ({ key: o.id, label: o.texto }))}
                  />
                )
              })}
            </div>

            {/* Resultado da combinação escolhida */}
            <div className="rounded-[14px] border border-plum/8 bg-mauve-ghost/60 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-mauve">
                Fase resultante
              </div>
              <div className={`mt-1 font-display text-2xl ${resultado.semFase ? 'text-red-alert' : 'text-plum'}`}>
                {resultado.semFase
                  ? 'Nenhuma fase determinada'
                  : (resultado.faseNome ??
                    (semFasesAtivas ? 'Nenhuma fase ativa' : 'Nenhuma fase cadastrada'))}
              </div>
              {semFasesAtivas && (
                <p className="mt-1 text-[13px] text-red-alert">
                  ⚠ Todas as fases estão inativas — a inferência as ignora, então nenhuma usuária
                  receberia fase. Ative ao menos uma.
                </p>
              )}
              {resultado.semFase && (
                <p className="mt-1 text-[13px] text-red-alert">
                  ⚠ Nenhuma opção escolhida mapeia para fase — o backend recusaria o envio (erro na
                  finalização), não &ldquo;cai na fase 1&rdquo;. Mapeie as opções.
                </p>
              )}
              {resultado.empate && !resultado.semFase && (
                <p className="mt-1 text-[13px] text-[#7A5C00]">
                  ⚠ Empate no topo — o desempate caiu na fase de menor ordem.
                </p>
              )}
              {resultado.pontosPorFase.length > 0 && (
                <div className="mt-3 flex flex-col gap-1.5">
                  {resultado.pontosPorFase.map((pf) => (
                    <div key={pf.faseId} className="flex items-center gap-2">
                      <span className="w-28 shrink-0 truncate text-xs text-plum/60">{pf.nome}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-pill bg-plum/8">
                        <div
                          className="h-full rounded-pill bg-mauve transition-all"
                          style={{ width: `${(pf.pontos / maxPontos) * 100}%` }}
                        />
                      </div>
                      <span className="w-6 shrink-0 text-right text-xs font-medium text-plum">{pf.pontos}</span>
                    </div>
                  ))}
                </div>
              )}
              {inativas > 0 && (
                <p className="mt-2.5 text-[12.5px] text-plum/45">
                  {inativas === 1 ? '1 fase inativa está' : `${inativas} fases inativas estão`} fora da
                  conta — a inferência do backend ignora fases inativas.
                </p>
              )}
            </div>

            {/* Análise de cobertura (todas as combinações) */}
            <div className="flex flex-col gap-2">
              {!analise.analisado ? (
                <p className="text-[12.5px] text-plum/45">
                  {analise.combinacoes > 0
                    ? `${analise.combinacoes.toLocaleString('pt-BR')} combinações — muitas para a análise completa de cobertura.`
                    : 'Análise de cobertura indisponível.'}
                </p>
              ) : (
                <>
                  {analise.fasesInalcancaveis.length > 0 && (
                    <div className="rounded-[14px] border border-[#B8860B]/25 bg-[#B8860B]/10 px-3.5 py-2.5 text-[13px] text-[#7A5C00]">
                      <strong>Fases inalcançáveis:</strong>{' '}
                      {analise.fasesInalcancaveis.map((f) => f.nome).join(', ')}. Nenhuma combinação de
                      respostas leva a elas — revise os pesos.
                    </div>
                  )}
                  {analise.temEmpate && (
                    <div className="rounded-[14px] border border-[#B8860B]/25 bg-[#B8860B]/10 px-3.5 py-2.5 text-[13px] text-[#7A5C00]">
                      <strong>Há combinações que empatam.</strong> O desempate sempre cai na fase de menor
                      ordem{analise.exemploEmpate ? ` (ex.: ${analise.exemploEmpate.join(' + ')})` : ''}.
                    </div>
                  )}
                  {analise.temSemFase && (
                    <div className="rounded-[14px] border border-red-muted bg-red-alert/[0.05] px-3.5 py-2.5 text-[13px] text-red-alert">
                      <strong>Há combinações sem fase.</strong> Alguma combinação de respostas não pontua
                      nenhuma fase e <strong>quebraria o onboarding</strong> (o backend recusa o envio)
                      {analise.exemploSemFase ? ` — ex.: ${analise.exemploSemFase.join(' + ')}` : ''}.
                    </div>
                  )}
                  {analise.fasesInalcancaveis.length === 0 && !analise.temEmpate && !analise.temSemFase && (
                    <div className="rounded-[14px] border border-success-dark/25 bg-success-dark/[0.06] px-3.5 py-2.5 text-[13px] text-success-dark">
                      Todas as fases são alcançáveis e nenhuma combinação empata. Mapeamento saudável.
                    </div>
                  )}
                  <p className="text-[12px] text-plum/40">
                    Análise sobre {analise.combinacoes.toLocaleString('pt-BR')} combinações de resposta.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}
