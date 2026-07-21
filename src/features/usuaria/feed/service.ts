import { delay } from '@/features/admin/lib/mock'
import { SEED_CONTEUDOS, TRILHA_POR_CONTEUDO } from '../lib/seed'
import { readConcluidos } from '../lib/progresso-store'
import { readFaseAtualId } from '../lib/fase-store'
import { fasesAtivas } from '../fase/service'
import { tagNomes } from '../lib/tags'
import type { FeedFase, FeedItem, FeedPage, FeedParams } from './types'

/** Contrato do feed personalizado (UF2). */
export interface FeedService {
  getFeed(params: FeedParams): Promise<FeedPage>
}

function faseAtual(): FeedFase | null {
  const ativas = fasesAtivas()
  const id = readFaseAtualId()
  const f = (id ? ativas.find((x) => x.id === id) : null) ?? ativas[0] ?? null
  return f ? { id: f.id, nome: f.nome } : null
}

/**
 * Mock do feed — reproduz o ALGO-FEED do M05 de forma simplificada: conteúdos
 * publicados, com selo de consumido e de trilha, ordenados por (a) não consumidos
 * em trilha, (b) não consumidos avulsos, (c) consumidos por último. O seed já vem
 * em `publicadoEm DESC`, e o sort é estável — a ordem se preserva dentro do grupo.
 */
export const mockFeedService: FeedService = {
  async getFeed(params) {
    await delay(200)
    const pagina = params.pagina ?? 0
    const tamanho = params.tamanho ?? 20
    const concluidos = readConcluidos()

    let base = SEED_CONTEUDOS.filter((c) => c.publicado)
    if (params.tag) base = base.filter((c) => c.tags.includes(params.tag!))

    const itens: FeedItem[] = base.map((c) => {
      const trilha = TRILHA_POR_CONTEUDO.get(c.id)
      return {
        id: c.id,
        titulo: c.titulo,
        formato: c.formato,
        duracaoMinutos: c.duracao,
        thumbUrl: c.thumb,
        tags: tagNomes(c.tags),
        consumido: concluidos.has(c.id),
        emTrilha: trilha ? { id: trilha.id, titulo: trilha.titulo } : null,
      }
    })

    const rank = (i: FeedItem) => (i.consumido ? 2 : i.emTrilha ? 0 : 1)
    itens.sort((a, b) => rank(a) - rank(b))

    const total = itens.length
    const inicio = pagina * tamanho
    return {
      fase: faseAtual(),
      itens: itens.slice(inicio, inicio + tamanho),
      pagina,
      tamanho,
      total,
      temMais: inicio + tamanho < total,
    }
  },
}
