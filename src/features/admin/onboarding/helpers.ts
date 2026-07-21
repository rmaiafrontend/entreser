import type { Opcao, Pergunta } from './types'

/** Uma opção está "sem mapeamento" se não dá peso positivo a nenhuma fase. */
export function semMapa(op: Opcao): boolean {
  const vals = Object.values(op.mapa || {})
  return vals.length === 0 || vals.every((v) => !v)
}

/**
 * Motivo pelo qual uma pergunta ainda NÃO pode ser ativada — ou `null` se pode
 * (ES-020). É um guarda-corpo, não um aviso decorativo: sem ele, uma pergunta com
 * opções sem mapeamento vai ao ar e degrada a inferência em silêncio (toda usuária
 * que escolher a opção sem peso empata em 0 e cai na primeira fase).
 */
export function motivoNaoAtivavel(p: Pergunta): string | null {
  // Na LISTA usamos `totalOpcoes`/`temMapeamento` do DTO (14/jul); no by-id
  // (opções completas) caímos no cálculo a partir de `opcoes`.
  const total = p.totalOpcoes ?? p.opcoes.length
  if (total < 2) {
    return 'A pergunta precisa de ao menos 2 opções de resposta antes de ser ativada.'
  }
  const todasMapeadas = p.temMapeamento ?? p.opcoes.every((o) => !semMapa(o))
  if (!todasMapeadas) {
    return 'Uma ou mais opções não mapeiam para nenhuma fase. Mapeie todas as opções antes de ativar.'
  }
  return null
}

/** Pares [faseId, peso] com peso > 0, ordenados do maior para o menor. */
export function mapaResumo(op: Opcao): Array<[string, number]> {
  return Object.entries(op.mapa || {})
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
}
