/**
 * Seam do serviço de Métricas (Fase 2). A UI importa `metricasService` daqui.
 * Ativo: `ApiMetricasService` (backend real). Fallback offline: `mockMetricasService`.
 */
import { ApiMetricasService } from './api-metricas.service'
import type { MetricasService } from './service'
// import { mockMetricasService } from './service' // ← fallback offline

export const metricasService: MetricasService = new ApiMetricasService()

export type { MetricasService } from './service'
