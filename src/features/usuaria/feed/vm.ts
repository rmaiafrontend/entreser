import { conteudoHref, formatDuracao, type ContentItemVM } from '../lib/content'
import type { FeedItem } from './types'

/** FeedItem (DTO do feed) → view-model do ContentCard. Compartilhado feed/home. */
export function feedItemToVM(i: FeedItem): ContentItemVM {
  return {
    id: i.id,
    title: i.titulo,
    formato: i.formato,
    duration: formatDuracao(i.formato, i.duracaoMinutos),
    meta: i.emTrilha?.titulo ?? i.tags[0],
    thumbUrl: i.thumbUrl,
    consumido: i.consumido,
    href: conteudoHref(i.id),
  }
}
