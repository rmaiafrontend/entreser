import { api } from '@/lib/http'
import { metricasFromApi, resumoFromApi, type MetricasApi, type ResumoApi } from './adapter'
import type { MetricasService } from './service'
import type { Metricas, Resumo } from './types'

/**
 * Implementação REAL do `MetricasService`. Substitui os números fabricados no
 * cliente por agregados do servidor (com k-anonimato garantido no backend).
 */
export class ApiMetricasService implements MetricasService {
  async getMetricas(): Promise<Metricas> {
    return metricasFromApi(await api.get<MetricasApi>('/admin/metricas'))
  }

  async getResumo(): Promise<Resumo> {
    return resumoFromApi(await api.get<ResumoApi>('/admin/resumo'))
  }
}
