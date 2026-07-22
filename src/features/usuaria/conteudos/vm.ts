import { conteudoHref, formatDuracao, type ContentItemVM } from '../lib/content'
import type { ConteudoResumo } from './types'

/**
 * ConteudoResumo (lista/recentes) → view-model do ContentCard. Espelha
 * `feed/vm.ts`, mas parte do resumo de `GET /conteudos` (sem fase). `meta` usa a
 * primeira tag do conteúdo; o resumo não traz progresso (`consumido` vem `false`).
 */
export function conteudoResumoToVM(c: ConteudoResumo): ContentItemVM {
  return {
    id: c.id,
    title: c.titulo,
    formato: c.formato,
    duration: formatDuracao(c.formato, c.duracao),
    meta: c.tags[0]?.nome,
    thumbUrl: c.thumb,
    consumido: c.consumido,
    href: conteudoHref(c.id),
  }
}
