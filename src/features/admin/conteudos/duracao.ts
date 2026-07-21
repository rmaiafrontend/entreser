/**
 * Estimativa de tempo de leitura para artigos (ES-006).
 *
 * A spec M05 define `duracaoMinutos` com semântica por formato — para artigo é o
 * tempo estimado de LEITURA, derivável do corpo. Em vez de um chute manual que
 * desatualiza a cada edição do texto, calculamos a partir da contagem de palavras.
 */

// Velocidade conservadora: conteúdo de saúde emocional é lido com atenção, não
// escaneado. Superestimar levemente é preferível a prometer 3 min e levar 6.
// O número exato é escolha de produto — alinhar com a equipe Entre Ser.
const PALAVRAS_POR_MINUTO = 180

/**
 * Remove a sintaxe Markdown antes de contar, para a estimativa não inflar com
 * marcadores (`##`, `-`, `**`, urls de link) que não são lidos como palavras.
 */
function textoLimpo(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ') // blocos de código
    .replace(/`[^`]*`/g, ' ') // código inline
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // imagens (não são texto lido)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → mantém só o texto visível
    .replace(/^\s*\d+\.\s+/gm, ' ') // numeração de listas ordenadas
    .replace(/[#>*_~`-]/g, ' ') // marcadores de bloco/ênfase
}

/**
 * Estima o tempo de leitura de um texto (Markdown) em minutos inteiros.
 * Retorna sempre ≥ 1 para texto não-vazio — um artigo curto nunca vale 0 min.
 * Texto vazio retorna 0 (o chamador decide deixar o campo em branco).
 */
export function estimarLeitura(texto: string): number {
  const palavras = textoLimpo(texto).trim().match(/\S+/g)?.length ?? 0
  if (palavras === 0) return 0
  return Math.max(1, Math.round(palavras / PALAVRAS_POR_MINUTO))
}
