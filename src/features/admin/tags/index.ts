/**
 * Seam do serviço de Tags (Fase 2 da integração backend).
 *
 * A UI (`use-tags`) importa `tagsService` daqui e não sabe se fala com a API ou
 * com o mock. Ativo: `ApiTagsService` (backend real). Para trabalhar offline,
 * troque pela linha do `mockTagsService`.
 */
import { ApiTagsService } from './api-tags.service'
import type { TagsService } from './service'
// import { mockTagsService } from './service' // ← fallback offline (sem backend)

export const tagsService: TagsService = new ApiTagsService()
// export const tagsService: TagsService = mockTagsService

export { TagEmUsoError } from './service'
export type { TagsService } from './service'
