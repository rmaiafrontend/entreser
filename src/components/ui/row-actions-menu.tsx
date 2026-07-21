'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useHydrated } from '@/lib/use-hydrated'
import { cn } from '@/lib/utils'
import { MoreVerticalIcon } from './icons'

/**
 * Menu de ações "três pontinhos" para linhas de tabela. O painel é renderizado
 * em portal no <body> e posicionado por `position: fixed` a partir do botão —
 * assim NÃO é cortado por ancestrais com `overflow-hidden` (o card da tabela) e
 * é imune a `transform`/`backdrop-filter` no caminho. Fecha no clique fora, no
 * Escape e vira para cima quando não há espaço abaixo (últimas linhas).
 */
interface Placement {
  right: number
  maxH: number
  top?: number
  bottom?: number
}

const CloseContext = createContext<() => void>(() => {})

export interface RowActionsMenuProps {
  /** Largura do painel em px. @default 190 */
  width?: number
  ariaLabel?: string
  children: ReactNode
}

export function RowActionsMenu({ width = 190, ariaLabel = 'Ações', children }: RowActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<Placement | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const hydrated = useHydrated()

  const close = useCallback(() => setOpen(false), [])

  const place = useCallback(() => {
    const b = btnRef.current
    if (!b) return
    const r = b.getBoundingClientRect()
    const right = window.innerWidth - r.right
    const spaceBelow = window.innerHeight - r.bottom
    const spaceAbove = r.top
    // Abre para baixo se couber (ou se houver mais espaço abaixo); senão, para cima.
    if (spaceBelow >= 220 || spaceBelow >= spaceAbove) {
      setPos({ right, top: r.bottom + 4, maxH: spaceBelow - 12 })
    } else {
      setPos({ right, bottom: window.innerHeight - r.top + 4, maxH: spaceAbove - 12 })
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', place)
    // capture: reposiciona também em scroll de qualquer container rolável
    window.addEventListener('scroll', place, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, place])

  const toggle = () => {
    if (open) {
      setOpen(false)
      return
    }
    place() // calcula a posição antes de abrir, para o painel já surgir no lugar certo
    setOpen(true)
  }

  return (
    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-[9px] text-plum/55 transition-colors',
          open ? 'bg-plum/6' : 'hover:bg-plum/5',
        )}
      >
        <MoreVerticalIcon size={18} />
      </button>
      {open &&
        hydrated &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              right: pos.right,
              width,
              maxHeight: pos.maxH,
              ...(pos.top != null ? { top: pos.top } : { bottom: pos.bottom }),
            }}
            className="z-[1000] overflow-y-auto rounded-xl border border-plum/6 bg-white p-1.5 shadow-modal"
          >
            <CloseContext.Provider value={close}>{children}</CloseContext.Provider>
          </div>,
          document.body,
        )}
    </div>
  )
}

export interface RowActionsItemProps {
  icon?: ReactNode
  danger?: boolean
  onSelect: () => void
  children: ReactNode
}

/** Item do RowActionsMenu — fecha o menu automaticamente ao ser acionado. */
export function RowActionsItem({ icon, danger, onSelect, children }: RowActionsItemProps) {
  const close = useContext(CloseContext)
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        close()
        onSelect()
      }}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left text-[13.5px] font-medium transition-colors',
        danger ? 'text-red-alert hover:bg-red-alert/8' : 'text-plum/[0.78] hover:bg-plum/[0.04]',
      )}
    >
      {icon && (
        <span className={cn('inline-flex', danger ? 'text-red-alert' : 'text-plum/45')}>{icon}</span>
      )}
      {children}
    </button>
  )
}
