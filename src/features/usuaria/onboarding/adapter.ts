import type { OnbPergunta, OnbResultado } from './types'

interface OpcaoApi {
  id: string
  texto: string
  ordem: number
}

/** Pergunta do backend para a usuária (opções SEM mapeamentos — não expostos). */
interface PerguntaApi {
  id: string
  texto: string
  ordem: number
  opcoes?: OpcaoApi[] | null
  opcoesResposta?: OpcaoApi[] | null
}

export function perguntaFromApi(p: PerguntaApi): OnbPergunta {
  const ops = (p.opcoesResposta ?? p.opcoes ?? []).slice().sort((a, b) => a.ordem - b.ordem)
  return {
    id: p.id,
    texto: p.texto,
    ordem: p.ordem,
    opcoes: ops.map((o) => ({ id: o.id, texto: o.texto, ordem: o.ordem })),
  }
}

/** Resposta do `finalizar` — tolera `{ fase }` ou `{ faseId, faseNome }`. */
interface ResultadoApi {
  fase?: { id: string; nome?: string } | null
  faseId?: string
  faseNome?: string
}

export function resultadoFromApi(raw: ResultadoApi): OnbResultado {
  const f = raw.fase ?? (raw.faseId ? { id: raw.faseId, nome: raw.faseNome } : null)
  return { fase: f ? { id: f.id, nome: f.nome ?? '' } : null }
}
