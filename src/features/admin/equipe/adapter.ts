import type { EquipeInput, EquipeMembro } from './types'

/**
 * Admin como o backend serializa. `GET /admin/admins` devolve a entidade
 * `AdminGeral` crua (sem DTO), que estende `Usuario` — declaramos só o que a
 * tela usa. O corpo real também traz `roles[]` (com `permissions[]` aninhadas),
 * `authorities[]`, `enderecos[]`, `planPermissions[]`, `statusAtivo` e
 * `atualizadaEm`, que ignoramos. A `senhaHash` não vem: é `WRITE_ONLY` no
 * `Usuario`.
 */
export interface AdminApi {
  id: string
  nome: string
  email: string
  telefone?: string | null
  ativa: boolean
  status: 'ATIVO' | 'INATIVO' | 'AGUARDANDO_CONFIRMACAO' | 'AGUARDANDO_DELECAO' | 'ANONIMIZADA'
  /** `true` enquanto a senha temporária não foi trocada (primeiro acesso pendente). */
  exigirTrocaSenha?: boolean
  criadaEm: string
}

/** LocalDateTime ISO → data (YYYY-MM-DD). */
const soData = (iso: string | null | undefined): string | null => (iso ? iso.slice(0, 10) : null)

export function adminFromApi(a: AdminApi): EquipeMembro {
  return {
    id: a.id,
    nome: a.nome,
    email: a.email,
    // Conta ligada/desligada. O `status` é a máquina de estados do usuário
    // (confirmação, deleção) e não tem verbo no painel — fora do MVP.
    ativa: a.ativa,
    criadaEm: soData(a.criadaEm) ?? a.criadaEm,
  }
}

/**
 * Domínio → corpo do `POST /admin/admins` (`{ nome, email }`).
 *
 * O e-mail vai normalizado porque o backend NÃO normaliza neste endpoint (o
 * `existsByEmail` do `AdminController` é sensível a caixa, diferente do
 * `/auth/cadastro`). Mesma proteção que o `api-auth.service` já aplica.
 */
export function equipeToRequest(input: EquipeInput) {
  return {
    nome: input.nome.trim(),
    email: input.email.trim().toLowerCase(),
  }
}
