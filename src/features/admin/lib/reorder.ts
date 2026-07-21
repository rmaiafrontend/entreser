/**
 * Utilitários de reordenação para as listas ordenadas por `ordem` do backoffice.
 *
 * Os endpoints de reorder transacional do backend (`PUT .../ordem`) recebem a
 * lista COMPLETA de ids na ordem final e reatribuem `ordem` numa única transação
 * — o que evita a colisão de `UNIQUE(ordem)` do antigo swap de 2 PATCH.
 */

interface Ordenavel {
  id: string
  ordem: number
}

/**
 * Dada a lista atual e um movimento `(id, direção)`, devolve a lista COMPLETA de
 * ids na ordem final desejada (o formato que os endpoints `PUT .../ordem`
 * esperam). Retorna `null` se o movimento sai dos limites (nada a fazer).
 */
export function reorderIdsBySwap(items: Ordenavel[], id: string, dir: -1 | 1): string[] | null {
  const sorted = [...items].sort((a, b) => a.ordem - b.ordem)
  const i = sorted.findIndex((x) => x.id === id)
  const j = i + dir
  if (i < 0 || j < 0 || j >= sorted.length) return null
  const tmp = sorted[i]
  sorted[i] = sorted[j]
  sorted[j] = tmp
  return sorted.map((x) => x.id)
}

/**
 * Reatribui `ordem` localmente a partir de uma lista de ids na ordem final
 * (índice → ordem), espelhando o que o backend faz ao receber `PUT .../ordem`.
 * O backend grava `índice + 1` (1-based) — o render otimista precisa usar o MESMO
 * valor, senão o card exibe a `ordem` deslocada em −1 até o próximo carregamento
 * reconciliar. Itens fora de `orderedIds` ficam intactos.
 */
export function applyOrder<T extends Ordenavel>(items: T[], orderedIds: string[]): T[] {
  const pos = new Map(orderedIds.map((id, idx) => [id, idx + 1]))
  return items.map((x) => {
    const p = pos.get(x.id)
    return p === undefined ? x : { ...x, ordem: p }
  })
}
