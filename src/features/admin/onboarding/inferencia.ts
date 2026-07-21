import type { Opcao, Pergunta } from './types'

/**
 * Simulador da inferência de fase (ES-020) — função pura sobre os dados já
 * carregados (perguntas ativas + opções + mapeamentos + fases). Reproduz o
 * ALGO-FASE do M05: soma os pesos que cada opção respondida dá a cada fase e, em
 * caso de empate, vence a fase de menor `ordem`.
 *
 * É a única forma de a equipe confiar no mapeamento sem cadastrar uma usuária de
 * teste a cada mudança — e de flagrar empates e fases inalcançáveis ANTES do ar.
 */

export interface FaseLite {
  id: string
  nome: string
  ordem: number
}

export interface ResultadoInferencia {
  faseId: string | null
  faseNome: string | null
  /** true quando há mais de uma fase no topo (o desempate por ordem decidiu). */
  empate: boolean
  /**
   * true quando NENHUMA fase recebeu peso das opções escolhidas. Fiel ao backend:
   * `finalizeOnboarding` LANÇA "Nenhuma fase pôde ser determinada" nesse caso e o
   * `POST /respostas` falha — NÃO "cai na primeira fase". O simulador sinaliza como
   * erro, não como empate.
   */
  semFase: boolean
  pontosPorFase: Array<{ faseId: string; nome: string; pontos: number }>
}

/** Soma os pesos das opções escolhidas por fase e aplica o desempate por ordem. */
export function inferirFase(fases: FaseLite[], escolhidas: Opcao[]): ResultadoInferencia {
  const pontos = new Map<string, number>()
  for (const op of escolhidas) {
    for (const [faseId, peso] of Object.entries(op.mapa || {})) {
      if (!peso) continue
      pontos.set(faseId, (pontos.get(faseId) ?? 0) + peso)
    }
  }
  const ranked = [...fases]
    .sort((a, b) => a.ordem - b.ordem)
    .map((f) => ({ f, pontos: pontos.get(f.id) ?? 0 }))
  const pontosPorFase = ranked.map((r) => ({ faseId: r.f.id, nome: r.f.nome, pontos: r.pontos }))
  if (ranked.length === 0) {
    return { faseId: null, faseNome: null, empate: false, semFase: false, pontosPorFase }
  }
  const max = Math.max(...ranked.map((r) => r.pontos))
  if (max === 0) {
    // Nenhuma fase pontuou → o backend não determina fase (lança erro). Não é empate.
    return { faseId: null, faseNome: null, empate: false, semFase: true, pontosPorFase }
  }
  const topo = ranked.filter((r) => r.pontos === max)
  // `ranked` já está em ordem crescente de `ordem`, então topo[0] é o desempate.
  const vencedora = topo[0]
  return {
    faseId: vencedora.f.id,
    faseNome: vencedora.f.nome,
    empate: topo.length > 1,
    semFase: false,
    pontosPorFase,
  }
}

export interface AnaliseCobertura {
  /** Nº de combinações de resposta (produto das opções por pergunta ativa). */
  combinacoes: number
  /** false quando não há perguntas ativas ou o nº de combinações estourou o teto. */
  analisado: boolean
  /** Fases que NENHUMA combinação de respostas alcança (nunca seriam atribuídas). */
  fasesInalcancaveis: FaseLite[]
  /** true se existe ao menos uma combinação que resulta em empate. */
  temEmpate: boolean
  /** Textos das opções de um exemplo de combinação que empata (ou null). */
  exemploEmpate: string[] | null
  /** true se existe combinação em que NENHUMA fase pontua (quebraria o onboarding). */
  temSemFase: boolean
  /** Textos das opções de um exemplo de combinação sem fase (ou null). */
  exemploSemFase: string[] | null
}

// Teto de segurança: acima disso a enumeração exaustiva fica cara demais e a
// análise é omitida (a simulação interativa continua funcionando).
const MAX_COMBINACOES = 20000

/**
 * Enumera todas as combinações de resposta (uma opção por pergunta ativa) e
 * reporta as fases que nenhuma combinação alcança e se alguma resulta em empate.
 */
export function analisarCobertura(perguntasAtivas: Pergunta[], fases: FaseLite[]): AnaliseCobertura {
  const listas = perguntasAtivas.map((p) => [...p.opcoes].sort((a, b) => a.ordem - b.ordem))
  const combinacoes = listas.reduce((acc, l) => acc * l.length, 1)

  if (perguntasAtivas.length === 0 || combinacoes === 0 || combinacoes > MAX_COMBINACOES) {
    return {
      combinacoes,
      analisado: false,
      fasesInalcancaveis: [],
      temEmpate: false,
      exemploEmpate: null,
      temSemFase: false,
      exemploSemFase: null,
    }
  }

  const alcancadas = new Set<string>()
  let temEmpate = false
  let exemploEmpate: string[] | null = null
  let temSemFase = false
  let exemploSemFase: string[] | null = null

  const idxs = new Array<number>(listas.length).fill(0)
  for (;;) {
    const escolhidas = listas.map((l, k) => l[idxs[k]])
    const r = inferirFase(fases, escolhidas)
    if (r.faseId) alcancadas.add(r.faseId)
    if (r.empate && !exemploEmpate) {
      temEmpate = true
      exemploEmpate = escolhidas.map((o) => o.texto)
    }
    if (r.semFase && !exemploSemFase) {
      temSemFase = true
      exemploSemFase = escolhidas.map((o) => o.texto)
    }
    // Incrementa o "odômetro" de índices para a próxima combinação.
    let k = listas.length - 1
    while (k >= 0) {
      idxs[k] += 1
      if (idxs[k] < listas[k].length) break
      idxs[k] = 0
      k -= 1
    }
    if (k < 0) break
  }

  return {
    combinacoes,
    analisado: true,
    fasesInalcancaveis: fases.filter((f) => !alcancadas.has(f.id)),
    temEmpate,
    exemploEmpate,
    temSemFase,
    exemploSemFase,
  }
}
