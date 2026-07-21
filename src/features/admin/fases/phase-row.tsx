import { ChevronDownIcon, ChevronUpIcon, EditIcon, Tag } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Fase } from './types'

interface PhaseRowProps {
  fase: Fase
  index: number
  total: number
  /** Rótulos das tags já resolvidos (ids → nomes válidos). */
  tagLabels: string[]
  onMove: (dir: -1 | 1) => void
  onEdit: () => void
}

/**
 * Card de fase — acento lateral (gradiente quando ativa), controle de ordem
 * (setas + número), título/descrição, ação de editar e chips de tags atreladas.
 * Hover via CSS (grupo), sem estado JS.
 */
export function PhaseRow({ fase, index, total, tagLabels, onMove, onEdit }: PhaseRowProps) {
  const inativa = !fase.ativa
  return (
    <div
      className={cn(
        'group flex items-stretch overflow-hidden rounded-[20px] border border-plum/7 bg-white shadow-[0_2px_10px_rgba(45,24,64,0.05)] transition-all duration-200',
        'hover:-translate-y-0.5 hover:border-mauve/20 hover:shadow-[0_12px_32px_rgba(45,24,64,0.10)]',
        inativa && 'opacity-[0.72]',
      )}
    >
      {/* Acento lateral */}
      <span
        className={cn('w-1 shrink-0', inativa ? 'bg-plum/12' : 'bg-gradient-to-b from-mauve to-mauve-dark')}
      />

      {/* Controle de ordem */}
      <div className="flex shrink-0 flex-col items-center justify-center gap-1.5 py-[18px] pl-[18px] pr-3.5">
        <OrderArrow dir="up" disabled={index === 0} onClick={() => onMove(-1)} />
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-pill font-display text-[19px] font-medium leading-none lining-nums shadow-[inset_0_0_0_1px_rgba(122,74,92,0.15)]',
            inativa ? 'bg-cream-mid text-plum/40' : 'text-mauve-dark',
          )}
          style={
            inativa
              ? undefined
              : { background: 'radial-gradient(120% 120% at 30% 20%, #E8D5DA, #EDE6F4)' }
          }
        >
          <span className="inline-block translate-y-[0.5px]">{fase.ordem}</span>
        </div>
        <OrderArrow dir="down" disabled={index === total - 1} onClick={() => onMove(1)} />
      </div>

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 py-[18px] pl-1.5 pr-[22px]">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-display text-[21px] leading-tight text-plum">{fase.nome}</h3>
              <Tag label={fase.ativa ? 'Ativa' : 'Inativa'} variant={fase.ativa ? 'primary' : 'muted'} size="sm" />
            </div>
            <p className="mt-[7px] text-sm leading-[1.55] text-plum/60">{fase.descricao}</p>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-mauve/28 px-4 py-2 text-[13.5px] font-medium text-mauve transition-all hover:border-transparent hover:bg-mauve hover:text-white"
          >
            <EditIcon size={15} />
            Editar
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 border-t border-plum/5 pt-2">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-plum/35">Tags</span>
          <div className="flex flex-wrap gap-1.5">
            {tagLabels.length === 0 ? (
              <span className="text-[12.5px] text-plum/40">Nenhuma atrelada</span>
            ) : (
              tagLabels.map((label) => <Tag key={label} label={label} variant="plum" size="sm" />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: 'up' | 'down'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={dir === 'up' ? 'Subir' : 'Descer'}
      className={cn(
        'flex h-[22px] w-[26px] items-center justify-center rounded-[7px] transition-colors',
        disabled ? 'cursor-default text-plum/20' : 'text-mauve hover:bg-mauve/12',
      )}
    >
      {dir === 'up' ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
    </button>
  )
}
