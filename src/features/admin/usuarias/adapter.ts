import { planoFromApi } from '@/lib/api/enums'
import type { PlanApi } from '@/lib/api/types'
import type { Plano, UsuariaRow, UsuariaStatus } from './data'

/** Paciente como o backend devolve (`GET /pacientes`) — só os campos usados aqui. */
export interface PacienteApi {
  id: string
  nome: string
  email: string
  telefone?: string | null
  status: string
  criadaEm?: string | null
  plan?: PlanApi | null
  /** Fase atual da usuária (desde 14/jul, resolvida em lote no backend). */
  faseAtualId?: string | null
  faseAtualNome?: string | null
}

/**
 * Envelope paginado de `GET /pacientes` (desde 14/jul). Tolerante ao campo de
 * página: a devolutiva do backend usa `page`, o padrão Spring Data usa `number`.
 */
export interface PacientePageApi {
  content?: PacienteApi[]
  totalElements?: number
  totalPages?: number
  page?: number
  number?: number
  size?: number
}

// StatusUsuario (UPPER_SNAKE) → status da projeção de usuárias (minúsculo/kebab).
const STATUS_MAP: Record<string, UsuariaStatus> = {
  ATIVO: 'ativa',
  INATIVO: 'inativa',
  AGUARDANDO_CONFIRMACAO: 'aguardando',
  AGUARDANDO_DELECAO: 'aguardando-delecao',
  ANONIMIZADA: 'anonimizada',
}

/** Backend → linha da tabela de usuárias. `fase` agora vem de `faseAtualNome` (14/jul). */
export function pacienteToRow(p: PacienteApi): UsuariaRow {
  return {
    id: p.id,
    nome: p.nome,
    email: p.email,
    telefone: p.telefone || '—',
    status: STATUS_MAP[p.status] ?? 'inativa',
    plano: planoFromApi(p.plan),
    fase: p.faseAtualNome ?? null,
    criadaEm: (p.criadaEm ?? '').slice(0, 10),
  }
}

// Status da tabela (kebab) → enum do backend, para `GET /pacientes?status=` (inverso do STATUS_MAP).
const STATUS_TO_BACKEND: Record<UsuariaStatus, string> = {
  ativa: 'ATIVO',
  inativa: 'INATIVO',
  aguardando: 'AGUARDANDO_CONFIRMACAO',
  'aguardando-delecao': 'AGUARDANDO_DELECAO',
  anonimizada: 'ANONIMIZADA',
}

/** Converte o status do filtro (domínio) para o valor do query param `status`. */
export function statusFilterToApi(status: UsuariaStatus): string {
  return STATUS_TO_BACKEND[status]
}

/**
 * Converte o plano do filtro para o query param `plano`. O backend compara o
 * valor com o NOME real do plano via `equalsIgnoreCase(plan.getNome())`
 * (`PacienteController.listarTodos`), e os planos semeados (V16) são
 * `PACIENTE_FREE`/`PACIENTE_PREMIUM` — NÃO `GRATUITO`/`PREMIUM`. Enviar o rótulo
 * curto não casava com nada (filtro sempre vazio). O cadastro atribui
 * `PACIENTE_FREE` por padrão (AuthController), então gratuitas têm plano.
 */
export function planoFilterToApi(plano: Plano): string {
  return plano === 'Premium' ? 'PACIENTE_PREMIUM' : 'PACIENTE_FREE'
}

/** Normaliza o envelope (ou array cru, como fallback) numa página de linhas. */
export function pacientePageToRows(
  data: PacientePageApi | PacienteApi[],
  reqPage: number,
  reqSize: number,
): { rows: UsuariaRow[]; totalElements: number; totalPages: number; page: number; size: number } {
  if (Array.isArray(data)) {
    // Fallback: endpoint ainda não paginado (uma página só).
    const rows = data.map(pacienteToRow)
    return { rows, totalElements: rows.length, totalPages: 1, page: 0, size: rows.length || reqSize }
  }
  const rows = Array.isArray(data.content) ? data.content.map(pacienteToRow) : []
  return {
    rows,
    totalElements: data.totalElements ?? rows.length,
    totalPages: data.totalPages ?? 1,
    page: data.page ?? data.number ?? reqPage,
    size: data.size ?? reqSize,
  }
}
