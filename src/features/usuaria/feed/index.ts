/**
 * Seam do feed da Usuária. ATIVO: `ApiFeedService` (`GET /feed` = `Page<Conteudo>`;
 * a fase do hero vem de `GET /usuaria/fase`). Volte para `mockFeedService` para
 * rodar sem backend.
 */
import { ApiFeedService } from './api-feed.service'
import type { FeedService } from './service'
// import { mockFeedService } from './service' // ← usar sem backend

export const feedService: FeedService = new ApiFeedService()
// export const feedService: FeedService = mockFeedService

export type { FeedService } from './service'
