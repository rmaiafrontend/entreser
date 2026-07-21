'use client'

import { type ReactNode } from 'react'
import {
  CheckIcon,
  ConteudosIcon,
  ESButton,
  ESCard,
  ESSpinner,
  PageHeader,
  ProfissionaisIcon,
  RefreshIcon,
  TrilhasIcon,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { useMetricas } from './use-metricas'
import type { MetricRow } from './types'

export function MetricsPanelView() {
  const { metricas, resumo, loading, error, reload } = useMetricas()

  const header = (
    <PageHeader
      title="Métricas"
      description="Visão agregada do consumo da plataforma. Nenhum dado individual de usuária é exibido."
      action={
        <ESButton variant="ghost" size="sm" startContent={<RefreshIcon size={15} />} onPress={reload}>
          Atualizar
        </ESButton>
      }
    />
  )

  if (loading) {
    return (
      <div>
        {header}
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex justify-center py-16">
            <ESSpinner size="md" label="Carregando métricas…" />
          </div>
        </ESCard>
      </div>
    )
  }

  if (error || !metricas || !resumo) {
    return (
      <div>
        {header}
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-plum/60">Não foi possível carregar as métricas. Tente novamente.</p>
            <ESButton variant="primary" onPress={reload}>
              Tentar novamente
            </ESButton>
          </div>
        </ESCard>
      </div>
    )
  }

  const totalUsuarias = metricas.usuariasPorFase.reduce((s, r) => s + (r.total ?? 0), 0)
  const maxFase = Math.max(1, ...metricas.usuariasPorFase.map((r) => r.total ?? 0))
  const maxConsumo = Math.max(1, ...metricas.conteudosMaisConsumidos.map((r) => r.total ?? 0))
  const maxTrilha = Math.max(1, ...metricas.trilhasMaisPercorridas.map((r) => r.total ?? 0))

  return (
    <div>
      {header}

      <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
        <Kpi icon={<ProfissionaisIcon size={20} />} label="Usuárias ativas" value={resumo.usuariasAtivas} />
        <Kpi icon={<ConteudosIcon size={20} />} label="Conteúdos publicados" value={resumo.conteudosPublicados} />
        <Kpi icon={<TrilhasIcon size={20} />} label="Trilhas criadas" value={resumo.trilhasCriadas} />
        <Kpi icon={<CheckIcon size={20} />} label="Taxa de conclusão" value={`${metricas.taxaConclusao}%`} accent />
      </div>

      <div className="grid grid-cols-1 items-start gap-[18px] md:grid-cols-2">
        <Bloco titulo="Usuárias por fase" hint="Distribuição da fase atual">
          {metricas.usuariasPorFase.length === 0 ? (
            <Vazio />
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {metricas.usuariasPorFase.map((r) => (
                  <div key={r.id}>
                    <div className="mb-1.5 flex justify-between text-[13.5px]">
                      <span className="font-medium text-plum">{r.label}</span>
                      <span className="text-plum/55">
                        {r.suprimido ? 'suprimido' : `${r.total} · ${pct(r.total, totalUsuarias)}%`}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-pill bg-cream-mid">
                      {!r.suprimido && (
                        <div
                          className="h-full rounded-pill bg-mauve"
                          style={{ width: `${((r.total ?? 0) / maxFase) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3.5 flex justify-between border-t border-plum/6 pt-3 text-[13.5px]">
                <span className="text-plum/55">Total (recorte visível)</span>
                <span className="font-semibold text-plum">{totalUsuarias} usuárias</span>
              </div>
            </>
          )}
        </Bloco>

        <Bloco titulo="Taxa de conclusão" hint="Conclusões sobre o disponível">
          <div className="py-1.5">
            <Gauge label="Conteúdos concluídos" sub="conclusões ÷ conteúdos publicados" value={metricas.taxaConclusao} />
          </div>
        </Bloco>

        <Bloco titulo="Conteúdos mais consumidos" hint="Por número de conclusões">
          <Ranking rows={metricas.conteudosMaisConsumidos} max={maxConsumo} />
        </Bloco>

        <Bloco titulo="Trilhas mais percorridas" hint="Por usuárias que percorreram">
          <Ranking rows={metricas.trilhasMaisPercorridas} max={maxTrilha} />
        </Bloco>
      </div>

      <p className="mt-[18px] text-[12.5px] leading-relaxed text-plum/45">
        Dados exclusivamente agregados. Recortes muito pequenos são suprimidos no servidor para preservar a
        privacidade das usuárias (k-anonimato).
      </p>
    </div>
  )
}

function pct(total: number | null, base: number): number {
  if (!total || base <= 0) return 0
  return Math.round((total / base) * 100)
}

function Ranking({ rows, max }: { rows: MetricRow[]; max: number }) {
  if (rows.length === 0) return <Vazio />
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <div key={r.id} className="flex items-center gap-3">
          <span className="w-[22px] text-center font-display text-base text-plum/35">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13.5px] font-medium text-plum">{r.label}</div>
            <div className="mt-1 h-[5px] overflow-hidden rounded-pill bg-cream-mid">
              {!r.suprimido && (
                <div className="h-full rounded-pill bg-mauve" style={{ width: `${((r.total ?? 0) / max) * 100}%` }} />
              )}
            </div>
          </div>
          <span className="min-w-[48px] text-right text-[13.5px] font-semibold text-plum">
            {r.suprimido ? '—' : r.total}
          </span>
        </div>
      ))}
    </div>
  )
}

function Kpi({ icon, label, value, accent }: { icon: ReactNode; label: string; value: ReactNode; accent?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-[18px] border p-5 shadow-[0_2px_10px_rgba(45,24,64,0.05)]',
        accent ? 'border-transparent bg-plum' : 'border-plum/7 bg-white',
      )}
    >
      <div className={cn('mb-3 flex items-center gap-2.5', accent ? 'text-cream/70' : 'text-mauve')}>
        {icon}
        <span className={cn('text-[12.5px] font-medium', accent ? 'text-cream/80' : 'text-plum/55')}>{label}</span>
      </div>
      <div className={cn('font-display text-[38px] font-normal leading-none', accent ? 'text-cream' : 'text-plum')}>
        {value}
      </div>
    </div>
  )
}

function Bloco({ titulo, hint, children }: { titulo: string; hint?: string; children: ReactNode }) {
  return (
    <ESCard variant="solid" isHoverable={false}>
      <div className="p-[22px]">
        <div className="mb-4">
          <h3 className="font-display text-[19px] text-plum">{titulo}</h3>
          {hint && <p className="mt-0.5 text-[12.5px] text-plum/45">{hint}</p>}
        </div>
        {children}
      </div>
    </ESCard>
  )
}

function Gauge({ label, sub, value }: { label: string; sub: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium text-plum">{label}</span>
        <span className="font-display text-2xl text-mauve-dark">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-pill bg-cream-mid">
        <div className="h-full rounded-pill bg-gradient-to-r from-mauve to-mauve-dark" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-1.5 text-[11.5px] text-plum/40">{sub}</p>
    </div>
  )
}

function Vazio() {
  return <div className="px-7 py-7 text-center text-[13.5px] text-plum/45">Sem dados para exibir.</div>
}
