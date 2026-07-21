/**
 * Utilitários de formatação do backoffice (telefone, datas).
 */

/** Só os dígitos de uma string. */
export function onlyDigits(value: string): string {
  return (value || '').replace(/\D/g, '')
}

/** Formata um telefone brasileiro a partir dos dígitos: (11) 98765-4321. */
export function formatPhone(value: string): string {
  const d = onlyDigits(value)
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return value
}

/**
 * Formata uma data ISO para pt-BR; vazio → travessão. Aceita data pura
 * (`YYYY-MM-DD`) ou LocalDateTime (`YYYY-MM-DDTHH:mm:ss`).
 *
 * Lê os componentes da string em vez de passar por `new Date()`: pela spec do
 * ECMAScript, a forma **date-only** é parseada como meia-noite **UTC**, e o
 * `toLocaleDateString('pt-BR')` renderizava em America/Sao_Paulo (UTC−3) como o
 * dia ANTERIOR. O backend manda hora de parede sem fuso, então o dia correto é
 * literalmente o que está escrito na string.
 */
export function formatDateBR(iso: string | null | undefined): string {
  if (!iso) return '—'
  const [data] = iso.split('T')
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data)
  if (!m) return iso
  const [, ano, mes, dia] = m
  return `${dia}/${mes}/${ano}`
}

/** Data de hoje em ISO (YYYY-MM-DD). */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Data em ISO daqui a N dias (aceita negativo). */
export function addDaysISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
