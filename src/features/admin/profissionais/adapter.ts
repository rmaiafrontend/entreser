import type { ConviteStatus, Profissional, ProfissionalInput } from './types'

/**
 * Profissional como o backend serializa — `Usuario` (base) achatado + os campos
 * de `Profissional`. `POST`/`PUT` recebem a própria entidade; o backend lê
 * nome/email/telefone/crp/abordagem dela.
 */
export interface ProfissionalApi {
  id: string
  nome: string
  email: string
  telefone: string | null
  crp: string
  abordagem: string | null
  bio?: string | null
  fotoUrl?: string | null
  ativa: boolean
  status: 'ATIVO' | 'INATIVO' | 'AGUARDANDO_CONFIRMACAO' | 'AGUARDANDO_DELECAO' | 'ANONIMIZADA'
  conviteExpiraEm?: string | null
  criadaEm: string
}

/** LocalDateTime ISO → data (YYYY-MM-DD). */
const soData = (iso: string | null | undefined): string | null => (iso ? iso.slice(0, 10) : null)

/**
 * Situação do convite derivada de `status` + expiração. Enquanto o convite não é
 * aceito, o backend mantém `status = AGUARDANDO_CONFIRMACAO`; após o primeiro
 * acesso vira `ATIVO`. O toggle liga/desliga a conta pelo campo `ativa`, separado.
 */
function conviteFromApi(
  status: ProfissionalApi['status'],
  conviteExpiraEm: string | null | undefined,
): ConviteStatus {
  if (status === 'AGUARDANDO_CONFIRMACAO') {
    if (conviteExpiraEm && new Date(conviteExpiraEm).getTime() < Date.now()) return 'expirado'
    return 'pendente'
  }
  return 'ativo'
}

export function profissionalFromApi(p: ProfissionalApi): Profissional {
  const convite = conviteFromApi(p.status, p.conviteExpiraEm)
  return {
    id: p.id,
    nome: p.nome,
    email: p.email,
    telefone: p.telefone ?? '',
    crp: p.crp,
    abordagem: p.abordagem ?? '',
    ativa: p.ativa,
    convite,
    // Só faz sentido enquanto o convite está pendente/expirado.
    conviteExpiraEm: convite === 'ativo' ? null : soData(p.conviteExpiraEm),
    criadaEm: soData(p.criadaEm) ?? p.criadaEm,
    // O backend não rastreia quem cadastrou — o campo fica vazio (a UI mostra "—").
    criadaPor: '',
    bio: p.bio ?? '',
  }
}

/** Domínio → corpo de `POST`/`PUT`. */
export function profissionalToRequest(input: ProfissionalInput) {
  return {
    nome: input.nome.trim(),
    email: input.email.trim(),
    telefone: input.telefone,
    crp: input.crp.trim(),
    abordagem: input.abordagem.trim(),
  }
}
