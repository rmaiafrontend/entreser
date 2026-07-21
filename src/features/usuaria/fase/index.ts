/**
 * Seam do serviço de fase da Usuária. A UI importa `faseUsuariaService` daqui.
 *
 * ATIVO: `ApiFaseUsuariaService`. `GET /usuaria/fase` devolve a fase atual + as
 * fases ativas (`fasesDisponiveis`), resolvendo a lacuna de "listar fases ativas";
 * `PATCH /usuaria/fase { faseId }` troca a fase (UF7). Volte para
 * `mockFaseUsuariaService` para rodar sem backend.
 */
import { ApiFaseUsuariaService } from './api-fase.service'
import type { FaseUsuariaService } from './service'
// import { mockFaseUsuariaService } from './service' // ← usar sem backend

export const faseUsuariaService: FaseUsuariaService = new ApiFaseUsuariaService()
// export const faseUsuariaService: FaseUsuariaService = mockFaseUsuariaService

export type { FaseUsuariaService } from './service'
