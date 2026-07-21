'use client'

import { ESButton } from '@/components/ui'

interface ErrorRetryProps {
  message: string
  onRetry: () => void
  className?: string
}

/**
 * ErrorRetry — estado de erro recarregável, no tema claro sobre o creme. Padrão
 * único das telas da Usuária (feed, trilhas, fase).
 */
export function ErrorRetry({ message, onRetry, className }: ErrorRetryProps) {
  return (
    <div
      className={
        'rounded-card border border-white/40 bg-white/60 px-6 py-12 text-center backdrop-blur-sm ' +
        (className ?? '')
      }
    >
      <p className="text-sm text-plum/60">{message}</p>
      <div className="mt-4 flex justify-center">
        <ESButton variant="secondary" onPress={onRetry}>
          Tentar novamente
        </ESButton>
      </div>
    </div>
  )
}
