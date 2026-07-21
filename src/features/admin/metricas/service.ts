import { delay } from '@/features/admin/lib/mock'
import type { Metricas, Resumo } from './types'

/**
 * Contrato do serviço de Métricas. Implementado pelo mock (números fictícios,
 * fallback offline) e pelo `ApiMetricasService` (`GET /admin/metricas` +
 * `GET /admin/resumo`, agregados reais desde 14/jul).
 */
export interface MetricasService {
  getMetricas(): Promise<Metricas>
  getResumo(): Promise<Resumo>
}

/** Implementação mock (agregados fictícios determinísticos). Fallback offline — ver `index.ts`. */
export const mockMetricasService: MetricasService = {
  async getMetricas() {
    await delay(200)
    return {
      usuariasPorFase: [
        { id: 'f-1', label: 'Preparação', total: 34, suprimido: false },
        { id: 'f-2', label: 'Estimulação', total: 52, suprimido: false },
        { id: 'f-3', label: 'Coleta / Transferência', total: 18, suprimido: false },
        { id: 'f-4', label: 'Beta', total: 41, suprimido: false },
        { id: 'f-5', label: 'Pós-resultado', total: 23, suprimido: false },
        { id: 'f-6', label: 'Aguardando próximo ciclo', total: null, suprimido: true },
      ],
      conteudosMaisConsumidos: [
        { id: 'c-1', label: 'Respiração para a espera', total: 128, suprimido: false },
        { id: 'c-2', label: 'Entendendo a estimulação', total: 96, suprimido: false },
        { id: 'c-3', label: 'O que esperar do beta', total: 74, suprimido: false },
        { id: 'c-5', label: 'Cuidando do sono', total: 61, suprimido: false },
      ],
      trilhasMaisPercorridas: [
        { id: 'tr-1', label: 'Primeiros passos na FIV', total: 88, suprimido: false },
        { id: 'tr-2', label: 'Cuidando da mente na espera', total: 63, suprimido: false },
        { id: 'tr-3', label: 'Retomando após um ciclo', total: null, suprimido: true },
      ],
      taxaConclusao: 58,
    }
  },
  async getResumo() {
    await delay(150)
    return { usuariasAtivas: 168, conteudosPublicados: 12, trilhasCriadas: 3 }
  },
}
