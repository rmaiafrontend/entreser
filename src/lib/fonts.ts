import { Cormorant_Garamond, Onest } from 'next/font/google'

/**
 * Cormorant Garamond — tipografia editorial (display/headings).
 * Apenas os pesos/estilos usados (300/400/500 + itálico) para acelerar o build.
 * Exposta via a CSS var `--font-display`.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

/**
 * Onest — fonte de corpo (body) do projeto.
 * Exposta via a CSS var `--font-onest`.
 */
export const onest = Onest({
  subsets: ['latin'],
  variable: '--font-onest',
  display: 'swap',
})
