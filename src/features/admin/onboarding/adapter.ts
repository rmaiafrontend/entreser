import type { Opcao, Pergunta } from './types'

/** Mapeamento opção→fase no backend (um por fase; `pontos=0` = não mapeada). */
interface MapeamentoApi {
  id: string | null
  opcaoRespostaId?: string
  faseId: string
  faseNome?: string
  pontos: number
}

/** Opção como o backend devolve (`opcoes` na lista / `opcoesResposta` no by-id). */
export interface OpcaoApi {
  id: string
  perguntaId?: string
  texto: string
  ordem: number
  valor?: number
  mapeamentos?: MapeamentoApi[] | null
}

/** Pergunta do backend. Lista traz `opcoes: null` + contagens; by-id traz `opcoesResposta[]`. */
export interface PerguntaApi {
  id: string
  texto: string
  ordem: number
  ativa: boolean
  opcoes?: OpcaoApi[] | null
  opcoesResposta?: OpcaoApi[] | null
  /** Só no DTO da lista (14/jul): contagem de opções e flag "todas mapeadas". */
  totalOpcoes?: number
  temMapeamento?: boolean
}

/** `mapeamentos[]` (pontos por fase) → domínio `mapa: Record<faseId, peso>` (só > 0). */
function mapaFromMapeamentos(maps: MapeamentoApi[] | null | undefined): Record<string, number> {
  const mapa: Record<string, number> = {}
  for (const m of maps ?? []) {
    if (m.pontos > 0) mapa[m.faseId] = m.pontos
  }
  return mapa
}

export function opcaoFromApi(o: OpcaoApi): Opcao {
  return { id: o.id, texto: o.texto, ordem: o.ordem, mapa: mapaFromMapeamentos(o.mapeamentos) }
}

export function perguntaFromApi(p: PerguntaApi): Pergunta {
  const ops = p.opcoesResposta ?? p.opcoes ?? []
  return {
    id: p.id,
    texto: p.texto,
    ordem: p.ordem,
    ativa: p.ativa,
    opcoes: ops.map(opcaoFromApi),
    totalOpcoes: p.totalOpcoes,
    temMapeamento: p.temMapeamento,
  }
}

/** Corpo de `POST`/`PATCH /perguntas` (`PerguntaOnboardingRequest`). */
export function perguntaToRequest(input: { texto: string; ordem: number; ativa: boolean }) {
  return { texto: input.texto.trim(), ordem: input.ordem, ativa: input.ativa }
}

/** Corpo de `POST`/`PATCH` de opção (`OpcaoRespostaRequest`). `valor` não é usado pela UI (ver B-4.1). */
export function opcaoToRequest(perguntaId: string, input: { texto: string; ordem: number }) {
  return { perguntaId, texto: input.texto.trim(), ordem: input.ordem, valor: 0 }
}

/** Domínio `mapa` → corpo de `PUT /opcoes/{id}/mapeamentos` (`[{faseId, pontos}]`, só > 0). */
export function mapaToMapeamentos(mapa: Record<string, number>) {
  return Object.entries(mapa)
    .filter(([, pontos]) => pontos > 0)
    .map(([faseId, pontos]) => ({ faseId, pontos }))
}
