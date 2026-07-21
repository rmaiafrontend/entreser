/**
 * Seam dos conteúdos da Usuária. ATIVO: `ApiConteudosUsuariaService`
 * (`/conteudos/*`: leitor by-id com envelope `{ conteudo, progresso }`, busca,
 * navegação por tag e progresso binário). Volte para `mockConteudosUsuariaService`
 * para rodar sem backend.
 */
import { ApiConteudosUsuariaService } from './api-conteudos.service'
import type { ConteudosUsuariaService } from './service'
// import { mockConteudosUsuariaService } from './service' // ← usar sem backend

export const conteudosUsuariaService: ConteudosUsuariaService = new ApiConteudosUsuariaService()
// export const conteudosUsuariaService: ConteudosUsuariaService = mockConteudosUsuariaService

export type { ConteudosUsuariaService } from './service'
