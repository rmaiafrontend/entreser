import type { Pergunta } from './types'

export const SEED_PERGUNTAS: Pergunta[] = [
  {
    id: 'q-1',
    texto: 'Em que momento do tratamento você está?',
    ordem: 1,
    ativa: true,
    opcoes: [
      { id: 'o-101', texto: 'Ainda me preparando / decidindo', ordem: 1, mapa: { 'f-1': 10, 'f-2': 2 } },
      { id: 'o-102', texto: 'Fazendo estimulação ovariana', ordem: 2, mapa: { 'f-2': 10, 'f-1': 2 } },
      { id: 'o-103', texto: 'Aguardando o resultado do beta', ordem: 3, mapa: { 'f-4': 10 } },
    ],
  },
  {
    id: 'q-2',
    texto: 'Como você tem se sentido emocionalmente?',
    ordem: 2,
    ativa: true,
    opcoes: [
      { id: 'o-201', texto: 'Ansiosa e sobrecarregada', ordem: 1, mapa: { 'f-4': 5, 'f-2': 3 } },
      { id: 'o-202', texto: 'Esperançosa', ordem: 2, mapa: {} },
    ],
  },
  {
    id: 'q-3',
    texto: 'Você já passou por algum ciclo antes?',
    ordem: 3,
    ativa: false,
    opcoes: [{ id: 'o-301', texto: 'Sim, este não é o primeiro', ordem: 1, mapa: { 'f-6': 6 } }],
  },
]
