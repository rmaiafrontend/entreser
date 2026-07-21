import type { Metricas, MetricRow, Resumo } from './types'

/** Item de métrica do backend — ids/labels variam por bloco; suprimido vem sem `total`. */
interface MetricItemApi {
  faseId?: string
  faseNome?: string
  conteudoId?: string
  trilhaId?: string
  titulo?: string
  total?: number
  suprimido?: boolean
}

export interface MetricasApi {
  usuariasPorFase?: MetricItemApi[]
  conteudosMaisConsumidos?: MetricItemApi[]
  trilhasMaisPercorridas?: MetricItemApi[]
  /** Fração 0–1 (ex.: 0.62). */
  taxaConclusao?: number
}

export interface ResumoApi {
  usuariasAtivas?: number
  conteudosPublicados?: number
  trilhasCriadas?: number
}

function rowFromApi(it: MetricItemApi): MetricRow {
  const suprimido = it.suprimido === true
  return {
    id: it.faseId ?? it.conteudoId ?? it.trilhaId ?? '',
    label: it.faseNome ?? it.titulo ?? '—',
    total: suprimido ? null : (it.total ?? 0),
    suprimido,
  }
}

export function metricasFromApi(d: MetricasApi): Metricas {
  return {
    usuariasPorFase: (d.usuariasPorFase ?? []).map(rowFromApi),
    conteudosMaisConsumidos: (d.conteudosMaisConsumidos ?? []).map(rowFromApi),
    trilhasMaisPercorridas: (d.trilhasMaisPercorridas ?? []).map(rowFromApi),
    taxaConclusao: Math.round((d.taxaConclusao ?? 0) * 100),
  }
}

export function resumoFromApi(d: ResumoApi): Resumo {
  return {
    usuariasAtivas: d.usuariasAtivas ?? 0,
    conteudosPublicados: d.conteudosPublicados ?? 0,
    trilhasCriadas: d.trilhasCriadas ?? 0,
  }
}
