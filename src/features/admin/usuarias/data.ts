/**
 * Usuárias — projeção somente-leitura exibida no backoffice. No MVP não há
 * criação/edição/exclusão pelo painel (a gestão é da própria usuária/LGPD),
 * então basta a semente estática.
 */

export type UsuariaStatus =
  | 'ativa'
  | 'aguardando'
  | 'inativa'
  | 'aguardando-delecao'
  | 'anonimizada'

export type Plano = 'Gratuito' | 'Premium'

export interface UsuariaRow {
  id: string
  nome: string
  email: string
  /** Só dígitos (ou '—' quando anonimizada). */
  telefone: string
  status: UsuariaStatus
  plano: Plano
  fase: string | null
  /** ISO (YYYY-MM-DD). */
  criadaEm: string
}

export const USER_STATUS: Record<UsuariaStatus, { label: string; variant: 'primary' | 'muted' }> = {
  ativa: { label: 'Ativa', variant: 'primary' },
  aguardando: { label: 'Aguardando confirmação', variant: 'muted' },
  inativa: { label: 'Inativa', variant: 'muted' },
  'aguardando-delecao': { label: 'Aguardando deleção', variant: 'muted' },
  anonimizada: { label: 'Anonimizada', variant: 'muted' },
}

/** Fases do ciclo (M05) — usadas no filtro. */
export const FASES = [
  'Preparação',
  'Estimulação',
  'Coleta / Transferência',
  'Beta',
  'Pós-resultado',
  'Aguardando próximo ciclo',
]

export const SEED_USUARIAS: UsuariaRow[] = [
  { id: 'u-1', nome: 'Ana Carolina Silva', email: 'ana.silva@email.com', telefone: '11987654321', status: 'ativa', plano: 'Premium', fase: 'Estimulação', criadaEm: '2025-02-12' },
  { id: 'u-2', nome: 'Beatriz Nunes', email: 'bia.nunes@email.com', telefone: '21998877665', status: 'ativa', plano: 'Gratuito', fase: 'Beta', criadaEm: '2025-02-20' },
  { id: 'u-3', nome: 'Eduarda Mendes', email: 'edu.mendes@email.com', telefone: '31991234567', status: 'ativa', plano: 'Gratuito', fase: 'Pós-resultado', criadaEm: '2025-03-03' },
  { id: 'u-4', nome: 'Fernanda Rocha', email: 'fe.rocha@email.com', telefone: '11976543210', status: 'aguardando', plano: 'Gratuito', fase: null, criadaEm: '2025-03-15' },
  { id: 'u-5', nome: 'Juliana Castro', email: 'ju.castro@email.com', telefone: '41992345678', status: 'ativa', plano: 'Premium', fase: 'Preparação', criadaEm: '2025-03-22' },
  { id: 'u-6', nome: 'Patrícia Lima', email: 'pat.lima@email.com', telefone: '51993456789', status: 'inativa', plano: 'Gratuito', fase: 'Aguardando próximo ciclo', criadaEm: '2025-03-28' },
  { id: 'u-7', nome: 'Usuária removida', email: 'anonimizado@entreser', telefone: '—', status: 'anonimizada', plano: 'Gratuito', fase: null, criadaEm: '2025-03-30' },
]
