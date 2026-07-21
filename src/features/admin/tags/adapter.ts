import type { TagItem } from './types'

/**
 * Tag como o backend devolve (`GET /api/v1/admin/tags`). Desde 14/jul traz as
 * contagens de uso (`usoConteudos`/`usoFases`) resolvidas em lote no servidor.
 */
export interface TagApi {
  id: string
  nome: string
  criadaEm?: string
  usoConteudos?: number
  usoFases?: number
}

/** Backend → domínio, propagando as contagens de uso (0 quando ausentes). */
export function tagFromApi(tag: TagApi): TagItem {
  return {
    id: tag.id,
    nome: tag.nome,
    usoConteudos: tag.usoConteudos ?? 0,
    usoFases: tag.usoFases ?? 0,
  }
}
