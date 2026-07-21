'use client'

import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

/**
 * Retorna `false` no servidor e na primeira renderização do cliente (durante a
 * hidratação) e `true` logo após — sem `setState` em efeito, evitando o aviso
 * de hidratação. Ideal para guardar portais (Dialog, Toast) que dependem de
 * `document`.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}
