import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Compõe classes Tailwind de forma condicional, resolvendo conflitos
 * (a última classe vence). Usado em todos os componentes do design system.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
