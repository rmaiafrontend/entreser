'use client'

import { cn } from '@/lib/utils'
import { SearchIcon, CloseIcon } from '@/components/ui'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onClear?: () => void
  className?: string
  'aria-label'?: string
}

/**
 * SearchField — campo de busca em vidro claro sobre o creme (aba Explorar, UF3).
 * Ícone de lupa à esquerda e botão de limpar quando há texto.
 */
export function SearchField({
  value,
  onChange,
  placeholder = 'Buscar conteúdos…',
  onClear,
  className,
  'aria-label': ariaLabel = 'Buscar conteúdos',
}: SearchFieldProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-[11px] rounded-2xl border border-plum/[0.07] bg-white px-[15px] py-[13px] shadow-[0_4px_16px_rgba(45,24,64,0.06)] transition-es focus-within:border-mauve/40',
        className,
      )}
    >
      <span className="text-plum/40">
        <SearchIcon size={18} />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="min-w-0 flex-1 bg-transparent text-sm text-plum placeholder:text-plum/35 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => (onClear ? onClear() : onChange(''))}
          aria-label="Limpar busca"
          className="text-plum/40 transition-es hover:text-plum/70"
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  )
}
