'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useHydrated } from '@/lib/use-hydrated'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

const VARIANTS: Record<ToastVariant, string> = {
  info: 'bg-plum/90 text-cream',
  success: 'bg-success-dark/90 text-white',
  warning: 'bg-[#7A5C00] text-white',
  error: 'bg-red-alert/90 text-white',
}

interface ToastState {
  message: string
  variant: ToastVariant
  visible: boolean
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

/**
 * Toast — notificação flutuante na base da tela (portal no <body>).
 */
function Toast({
  message,
  variant,
  isVisible,
  onClose,
}: {
  message: string
  variant: ToastVariant
  isVisible: boolean
  onClose: () => void
}) {
  const hydrated = useHydrated()
  if (!isVisible || !hydrated) return null

  return createPortal(
    <div
      className={cn(
        'fixed bottom-8 left-1/2 z-9999 flex -translate-x-1/2 items-center gap-3 rounded-pill px-5 py-3 font-body text-sm shadow-modal backdrop-blur-md',
        VARIANTS[variant],
      )}
      style={{ animation: 'es-toast-in 0.35s cubic-bezier(0,0,0.2,1)' }}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="text-lg leading-none opacity-70 transition-opacity hover:opacity-100"
      >
        ×
      </button>
    </div>,
    document.body,
  )
}

/**
 * ToastProvider — gerencia a fila (1 por vez) com auto-dismiss em 4s.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: '', variant: 'info', visible: false })
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    if (timer.current) clearTimeout(timer.current)
    setToast({ message, variant, visible: true })
    timer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000)
  }, [])

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  // `showToast` é estável (useCallback), mas sem memoizar o objeto o value muda
  // de identidade a cada render do provider — cada toast (show + auto-dismiss)
  // re-renderizaria todos os consumidores de useToast (a view ativa inteira).
  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast
        message={toast.message}
        variant={toast.variant}
        isVisible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </ToastContext.Provider>
  )
}

/**
 * useToast — retorna { showToast(message, variant?) }.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de um ToastProvider')
  return ctx
}
