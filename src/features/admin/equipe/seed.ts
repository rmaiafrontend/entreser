import type { EquipeMembro } from './types'

/** Semente do mock. O primeiro casa com o admin de demonstração (→ "· você"). */
export const SEED_EQUIPE: EquipeMembro[] = [
  { id: 'seed-eq-1', nome: 'Equipe', email: 'admin@entreser.com.br', ativa: true, criadaEm: '2025-01-10' },
  { id: 'seed-eq-2', nome: 'Marina Prado', email: 'marina.prado@entreser.com.br', ativa: true, criadaEm: '2025-02-02' },
  { id: 'seed-eq-3', nome: 'Larissa Campos', email: 'larissa.campos@entreser.com.br', ativa: true, criadaEm: '2025-03-18' },
]
