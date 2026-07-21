import { api, isApiError } from '@/lib/http'
import { adminFromApi, equipeToRequest, type AdminApi } from './adapter'
import { EmailJaCadastradoError, type EquipeService } from './service'
import type { EquipeInput, EquipeMembro } from './types'

/**
 * Implementação REAL do `EquipeService` contra o backend (`/admin/admins`).
 *
 * Confirmado no código do backend (`AdminController`): `GET` lista todas as
 * `AdminGeral` (sem paginação e sem filtro de inativas); `POST` cria, gera a
 * senha temporária, marca `exigirTrocaSenha` e dispara o e-mail. Ambos exigem
 * `ROLE_ADMINGERAL`. Não há verbos de edição/desativação/remoção — por isso o
 * contrato só tem `getAll`/`add`.
 */
const BASE = '/admin/admins'

export class ApiEquipeService implements EquipeService {
  async getAll(): Promise<EquipeMembro[]> {
    const data = await api.get<AdminApi[]>(BASE)
    return Array.isArray(data) ? data.map(adminFromApi) : []
  }

  async add(input: EquipeInput): Promise<EquipeMembro> {
    try {
      const a = await api.post<AdminApi>(BASE, equipeToRequest(input))
      return adminFromApi(a)
    } catch (erro) {
      // 409 = e-mail já cadastrado em QUALQUER usuário da plataforma. O corpo
      // vem como texto puro (não segue o `{ message, code }` do
      // GlobalExceptionHandler); o cliente HTTP já o normaliza em `message`.
      if (isApiError(erro, 'conflict')) throw new EmailJaCadastradoError(erro.message)
      throw erro
    }
  }
}
