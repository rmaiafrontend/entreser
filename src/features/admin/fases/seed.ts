import type { Fase } from './types'

export const SEED_FASES: Fase[] = [
  { id: 'f-1', nome: 'Preparação', descricao: 'Início da jornada: exames, decisões e organização emocional antes do tratamento.', ordem: 1, ativa: true, tags: ['t-2', 't-4', 't-8'] },
  { id: 'f-2', nome: 'Estimulação', descricao: 'Acompanhamento das medicações e do desenvolvimento folicular.', ordem: 2, ativa: true, tags: ['t-1', 't-3', 't-8'] },
  { id: 'f-3', nome: 'Coleta / Transferência', descricao: 'Procedimentos de coleta e transferência embrionária.', ordem: 3, ativa: true, tags: ['t-1', 't-3'] },
  { id: 'f-4', nome: 'Beta', descricao: 'A espera pelo resultado do exame beta-hCG.', ordem: 4, ativa: true, tags: ['t-1', 't-2'] },
  { id: 'f-5', nome: 'Pós-resultado', descricao: 'Acolhimento após o resultado, positivo ou negativo.', ordem: 5, ativa: true, tags: ['t-1', 't-5'] },
  { id: 'f-6', nome: 'Aguardando próximo ciclo', descricao: 'Intervalo entre ciclos: descanso e preparo para uma nova tentativa.', ordem: 6, ativa: false, tags: ['t-2', 't-5'] },
]
