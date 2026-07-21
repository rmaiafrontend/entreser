'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface TabItem {
  key: string
  label: ReactNode
  /** Conteúdo do painel (opcional — abas podem só controlar navegação externa). */
  content?: ReactNode
}

export interface ESTabsProps {
  items: TabItem[]
  /** Aba ativa (modo controlado). */
  selectedKey?: string
  onSelectionChange?: (key: string) => void
  variant?: 'underlined' | 'solid'
  className?: string
}

/**
 * ESTabs — abas controladas ou não (underlined/solid).
 */
export function ESTabs({
  items,
  selectedKey,
  onSelectionChange,
  variant = 'underlined',
  className,
}: ESTabsProps) {
  const [internal, setInternal] = useState<string | undefined>(items[0]?.key)
  const active = selectedKey ?? internal
  const current = items.find((i) => i.key === active)

  const select = (k: string) => {
    setInternal(k)
    onSelectionChange?.(k)
  }

  return (
    <div className={className}>
      {variant === 'underlined' ? (
        <div role="tablist" className="flex gap-6 border-b border-plum/10">
          {items.map((it) => {
            const on = it.key === active
            return (
              <button
                key={it.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => select(it.key)}
                className={cn(
                  '-mb-px border-b-2 px-1 pb-3 pt-1 font-body text-sm font-medium transition-colors',
                  on ? 'border-mauve text-mauve' : 'border-transparent text-plum/50 hover:text-plum',
                )}
              >
                {it.label}
              </button>
            )
          })}
        </div>
      ) : (
        <div role="tablist" className="inline-flex gap-1 rounded-xl bg-plum/5 p-1">
          {items.map((it) => {
            const on = it.key === active
            return (
              <button
                key={it.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => select(it.key)}
                className={cn(
                  'rounded-lg px-4 py-2 font-body text-sm font-medium transition-es',
                  on ? 'bg-white text-plum shadow-[0_1px_2px_rgba(45,24,64,0.10)]' : 'text-plum/50 hover:text-plum',
                )}
              >
                {it.label}
              </button>
            )
          })}
        </div>
      )}
      {current?.content && (
        <div role="tabpanel" className="pt-4">
          {current.content}
        </div>
      )}
    </div>
  )
}
