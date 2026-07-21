/**
 * Formatação de telefone brasileiro.
 *
 * Aplica a máscara progressivamente conforme a usuária digita, suportando
 * fixo (10 dígitos) e celular (11 dígitos):
 *   "83999999999" → "(83) 99999-9999"
 *   "8333334444"  → "(83) 3333-4444"
 *
 * Sempre limita a 11 dígitos. A validação e a normalização para apenas
 * dígitos continuam no schema Zod / serviço.
 */
export function formatarTelefoneBR(input: string): string {
  const d = input.replace(/\D/g, '').slice(0, 11)

  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
