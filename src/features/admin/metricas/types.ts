/**
 * Uma linha de distribuição/ranking de métrica. `total: null` quando o item foi
 * **suprimido** pelo servidor (k-anonimato: recorte pequeno demais).
 */
export interface MetricRow {
  id: string
  label: string
  total: number | null
  suprimido: boolean
}

/** Agregados de `GET /admin/metricas`. */
export interface Metricas {
  usuariasPorFase: MetricRow[]
  conteudosMaisConsumidos: MetricRow[]
  trilhasMaisPercorridas: MetricRow[]
  /** Taxa de conclusão em % (0–100). */
  taxaConclusao: number
}

/** Cartões-resumo de `GET /admin/resumo`. */
export interface Resumo {
  usuariasAtivas: number
  conteudosPublicados: number
  trilhasCriadas: number
}
