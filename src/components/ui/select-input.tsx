'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useHydrated } from '@/lib/use-hydrated'
import { CheckIcon, ChevronDownIcon } from './icons'

export interface SelectOption {
  key: string
  label: string
}

export interface SelectInputProps {
  label?: string
  placeholder?: string
  options?: SelectOption[]
  selectedKey?: string
  onChange?: (key: string) => void
  errorMessage?: string
  isRequired?: boolean
  isDisabled?: boolean
  name?: string
  id?: string
  className?: string
}

interface Placement {
  left: number
  width: number
  maxH: number
  top?: number
  bottom?: number
}

/**
 * SelectInput — dropdown custom, on-brand e consistente em todo o app. Ao contrário
 * do `<select>` nativo (cuja lista é desenhada pelo SO), o painel de opções é
 * renderizado em portal no <body>, imune a `overflow-hidden`/`transform` de
 * ancestrais, com posicionamento fixo, flip quando não há espaço abaixo, teclado
 * (setas/Enter/Esc/Home/End) e clique-fora. Mantém a mesma API do antigo select.
 */
export function SelectInput({
  label,
  placeholder,
  options = [],
  selectedKey,
  onChange,
  errorMessage,
  isRequired,
  isDisabled,
  name,
  id,
  className,
}: SelectInputProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const hydrated = useHydrated()

  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<Placement | null>(null)
  const [activeIdx, setActiveIdx] = useState(-1)

  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLDivElement | null)[]>([])

  const selectedIdx = options.findIndex((o) => o.key === (selectedKey ?? ''))
  const selected = selectedIdx >= 0 ? options[selectedIdx] : undefined
  const empty = !selectedKey
  const displayText = selected?.label ?? placeholder ?? ''

  const place = useCallback(() => {
    const b = btnRef.current
    if (!b) return
    const r = b.getBoundingClientRect()
    const spaceBelow = window.innerHeight - r.bottom
    const spaceAbove = r.top
    const base = { left: r.left, width: r.width }
    if (spaceBelow >= 260 || spaceBelow >= spaceAbove) {
      setPos({ ...base, top: r.bottom + 6, maxH: spaceBelow - 16 })
    } else {
      setPos({ ...base, bottom: window.innerHeight - r.top + 6, maxH: spaceAbove - 16 })
    }
  }, [])

  const openMenu = useCallback(() => {
    if (isDisabled) return
    place()
    setActiveIdx(selectedIdx >= 0 ? selectedIdx : 0)
    setOpen(true)
  }, [isDisabled, place, selectedIdx])

  const closeMenu = useCallback(() => {
    setOpen(false)
    setActiveIdx(-1)
  }, [])

  const commit = useCallback(
    (key: string) => {
      onChange?.(key)
      closeMenu()
      btnRef.current?.focus()
    },
    [onChange, closeMenu],
  )

  // Fecha no clique fora, no Escape e reposiciona em scroll/resize.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return
      closeMenu()
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, place, closeMenu])

  // Mantém a opção ativa visível ao navegar pelo teclado.
  useEffect(() => {
    if (open && activeIdx >= 0) optionRefs.current[activeIdx]?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIdx])

  const onButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) openMenu()
      else if (e.key === 'ArrowDown') setActiveIdx((i) => Math.min(options.length - 1, i + 1))
      else if (e.key === 'ArrowUp') setActiveIdx((i) => Math.max(0, i - 1))
      else if (activeIdx >= 0) commit(options[activeIdx].key)
    } else if (e.key === 'Escape' && open) {
      e.preventDefault()
      closeMenu()
    } else if (e.key === 'Home' && open) {
      e.preventDefault()
      setActiveIdx(0)
    } else if (e.key === 'End' && open) {
      e.preventDefault()
      setActiveIdx(options.length - 1)
    }
  }

  const listboxId = `${fieldId}-listbox`

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-plum/70">
          {label}
          {isRequired && <span className="text-red-alert"> *</span>}
        </label>
      )}

      <button
        ref={btnRef}
        id={fieldId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-required={isRequired}
        disabled={isDisabled}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onButtonKeyDown}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-[10px] border bg-white/60 px-3 py-2 text-left font-body text-sm backdrop-blur-sm outline-none transition-[border-color,box-shadow] duration-200',
          'focus-visible:border-mauve focus-visible:shadow-[0_0_0_1px_var(--color-mauve)] disabled:cursor-not-allowed',
          open && 'border-mauve shadow-[0_0_0_1px_var(--color-mauve)]',
          empty ? 'text-plum/30' : 'text-plum',
          errorMessage ? 'border-red-alert' : 'border-cream-dark',
          isDisabled && 'opacity-50',
        )}
      >
        <span className="truncate">{displayText}</span>
        <ChevronDownIcon
          size={16}
          className={cn('shrink-0 text-plum/40 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {/* Espelha o valor para formulários/testes sem depender do render nativo. */}
      {name && <input type="hidden" name={name} value={selectedKey ?? ''} />}

      {errorMessage && <span className="text-xs text-red-alert">{errorMessage}</span>}

      {open &&
        hydrated &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            role="listbox"
            id={listboxId}
            aria-activedescendant={activeIdx >= 0 ? `${fieldId}-opt-${activeIdx}` : undefined}
            style={{
              position: 'fixed',
              left: pos.left,
              width: pos.width,
              maxHeight: pos.maxH,
              ...(pos.top != null ? { top: pos.top } : { bottom: pos.bottom }),
            }}
            className="z-1000 overflow-y-auto rounded-xl border border-plum/8 bg-white p-1.5 shadow-modal"
          >
            {options.map((o, i) => {
              const isSelected = o.key === (selectedKey ?? '')
              const isActive = i === activeIdx
              return (
                <div
                  key={o.key}
                  id={`${fieldId}-opt-${i}`}
                  ref={(el) => {
                    optionRefs.current[i] = el
                  }}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => commit(o.key)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-2 rounded-[9px] px-2.5 py-2 text-[13.5px] font-medium transition-colors',
                    isActive ? 'bg-plum/5' : 'hover:bg-plum/4',
                    isSelected ? 'text-plum' : 'text-plum/70',
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {isSelected && <CheckIcon size={16} className="shrink-0 text-mauve" />}
                </div>
              )
            })}
          </div>,
          document.body,
        )}
    </div>
  )
}
