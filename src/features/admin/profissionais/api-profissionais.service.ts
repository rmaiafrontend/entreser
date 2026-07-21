import { api, isApiError } from '@/lib/http'
import { profissionalFromApi, profissionalToRequest, type ProfissionalApi } from './adapter'
import { EmailJaCadastradoError, type ProfissionaisService } from './service'
import type { Profissional, ProfissionalInput } from './types'

/**
 * Implementação REAL do `ProfissionaisService` contra o backend
 * (`/api/v1/profissional` — NÃO fica sob `/admin`).
 *
 * Confirmado no código do backend: `POST` cria + gera token + dispara e-mail de
 * convite (7 dias); `PATCH /{id}/ativa {ativa}` liga/desliga; `POST
 * /{id}/reenviar-convite` renova o token. A foto ainda é mock no servidor.
 */
const BASE = '/profissional'

export class ApiProfissionaisService implements ProfissionaisService {
  async getAll(): Promise<Profissional[]> {
    // Backoffice vê todas, inclusive desativadas (para gerir/reativar).
    const data = await api.get<ProfissionalApi[]>(`${BASE}?incluirInativas=true`)
    return Array.isArray(data) ? data.map(profissionalFromApi) : []
  }

  async getById(id: string): Promise<Profissional | null> {
    try {
      const p = await api.get<ProfissionalApi>(`${BASE}/${id}`)
      return p?.id ? profissionalFromApi(p) : null
    } catch (erro) {
      if (isApiError(erro, 'not_found')) return null
      throw erro
    }
  }

  async add(input: ProfissionalInput, _criadaPor: string): Promise<Profissional> {
    // `criadaPor` não é rastreado pelo backend — mantido na assinatura por contrato.
    void _criadaPor
    try {
      const p = await api.post<ProfissionalApi>(BASE, profissionalToRequest(input))
      return profissionalFromApi(p)
    } catch (erro) {
      // 409 = e-mail (ou CRP) já cadastrado — usa a mensagem do servidor.
      if (isApiError(erro, 'conflict')) throw new EmailJaCadastradoError(erro.message)
      throw erro
    }
  }

  async update(id: string, input: ProfissionalInput): Promise<Profissional> {
    const p = await api.put<ProfissionalApi>(`${BASE}/${id}`, profissionalToRequest(input))
    return profissionalFromApi(p)
  }

  async deactivate(id: string): Promise<void> {
    await api.patch<void>(`${BASE}/${id}/ativa`, { ativa: false }, { responseType: 'void' })
  }

  async reactivate(id: string): Promise<void> {
    await api.patch<void>(`${BASE}/${id}/ativa`, { ativa: true }, { responseType: 'void' })
  }

  async resendInvite(id: string): Promise<Profissional> {
    const p = await api.post<ProfissionalApi>(`${BASE}/${id}/reenviar-convite`, {})
    return profissionalFromApi(p)
  }
}
