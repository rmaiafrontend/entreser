import type { Trilha } from './types'

export const SEED_TRILHAS: Trilha[] = [
  { id: 'tr-1', titulo: 'Primeiros passos na FIV', descricao: 'Uma introdução acolhedora para quem está começando o tratamento.', publicada: true, thumb: null, conteudos: ['c-5', 'c-1', 'c-3'], criadaEm: '2025-03-05', publicadaEm: '2025-03-06' },
  { id: 'tr-2', titulo: 'Cuidando da mente na espera', descricao: 'Práticas de regulação emocional para o período beta.', publicada: true, thumb: null, conteudos: ['c-1', 'c-2'], criadaEm: '2025-03-01', publicadaEm: '2025-03-02' },
  { id: 'tr-3', titulo: 'Retomando após um ciclo', descricao: '', publicada: false, thumb: null, conteudos: ['c-4'], criadaEm: '2025-03-16', publicadaEm: null },
]
