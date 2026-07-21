import { api } from '@/lib/http'
import { feedFromApi, type FeedResponseApi } from './adapter'
import type { FeedService } from './service'
import type { FeedPage, FeedParams } from './types'

/** `GET /usuaria/fase` — só o campo `faseAtual` interessa ao hero do feed. */
interface MinhaFaseApi {
  faseAtual?: { id: string; nome: string } | null
}

/**
 * Implementação REAL do feed (`GET /feed?page=&size=`). O backend devolve um
 * Spring `Page<Conteudo>` SEM `fase` (o adapter só lê `content/number/size/…`).
 * Como o hero exibe a fase da usuária, buscamos a fase atual em paralelo via
 * `GET /usuaria/fase` (rota fora de `/api/v1` → `absolute`) e a injetamos na
 * página. `consumido`/`emTrilha`/`tags` não vêm no `/feed` (ver adapter).
 */
export class ApiFeedService implements FeedService {
  async getFeed(params: FeedParams): Promise<FeedPage> {
    const q = new URLSearchParams()
    q.set('page', String(params.pagina ?? 0))
    q.set('size', String(params.tamanho ?? 20))
    if (params.tag) q.set('tag', params.tag)

    const [raw, minhaFase] = await Promise.all([
      api.get<FeedResponseApi>(`/feed?${q.toString()}`),
      // A fase é apenas decorativa no hero — uma falha aqui não derruba o feed.
      api.get<MinhaFaseApi>('/usuaria/fase', { absolute: true }).catch(() => null),
    ])

    const page = feedFromApi(raw)
    const fa = minhaFase?.faseAtual
    return { ...page, fase: fa ? { id: fa.id, nome: fa.nome } : page.fase }
  }
}
