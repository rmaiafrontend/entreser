'use client'

import { useCallback, useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

/**
 * Flag booleana persistida em localStorage, SSR-safe (via useSyncExternalStore,
 * sem `setState` em efeito). No servidor e na hidratação vale `initial`; após a
 * hidratação lê o valor salvo. Escrever notifica esta e outras abas.
 */
export function useLocalStorageBoolean(
  key: string,
  initial = false,
): [boolean, (value: boolean) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      try {
        const raw = localStorage.getItem(key)
        return raw === null ? initial : raw === '1'
      } catch {
        return initial
      }
    },
    () => initial,
  )

  const setValue = useCallback(
    (next: boolean) => {
      try {
        localStorage.setItem(key, next ? '1' : '0')
        // 'storage' não dispara na própria aba — notificamos manualmente.
        window.dispatchEvent(new StorageEvent('storage', { key }))
      } catch {
        /* localStorage indisponível — ignora a persistência */
      }
    },
    [key],
  )

  return [value, setValue]
}
