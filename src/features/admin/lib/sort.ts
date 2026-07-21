/**
 * Ordenação alfabética estável (pt-BR) para listagens do backoffice.
 *
 * A API do backend não garante ordenação determinística (falta `ORDER BY` em
 * várias listagens — ver ES-003/ES-018), então um `UPDATE` pode reordenar a
 * lista de forma imprevisível ("item editado pula para o fim"). Ordenar no
 * cliente torna a tela imune ao que a API devolver: o item editado mantém sua
 * posição alfabética, e um recarregamento sempre produz a mesma sequência.
 *
 * Vale manter mesmo depois de o backend adicionar o `ORDER BY` — ordenar dos
 * dois lados é inofensivo e deixa o frontend robusto a mudanças futuras da API.
 */
export function sortByText<T>(items: readonly T[], key: (item: T) => string): T[] {
  return [...items].sort((a, b) => key(a).localeCompare(key(b), 'pt-BR'))
}
