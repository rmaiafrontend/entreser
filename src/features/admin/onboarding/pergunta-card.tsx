import { ChevronDownIcon, ChevronUpIcon, EditIcon, ESButton, SlidersIcon, Tag, TrashIcon } from '@/components/ui'
import { cn } from '@/lib/utils'
import { semMapa } from './helpers'
import { WarnPill } from './warn-pill'
import type { Pergunta } from './types'

interface PerguntaCardProps {
  pergunta: Pergunta
  index: number
  total: number
  onMove: (dir: -1 | 1) => void
  onEdit: () => void
  onToggle: () => void
  onDelete: () => void
  onOpcoes: () => void
}

export function PerguntaCard({ pergunta, index, total, onMove, onEdit, onToggle, onDelete, onOpcoes }: PerguntaCardProps) {
  const inativa = !pergunta.ativa
  // Lista traz `totalOpcoes`/`temMapeamento` (14/jul); fallback para `opcoes` no by-id.
  const totalOpcoes = pergunta.totalOpcoes ?? pergunta.opcoes.length
  const poucasOpcoes = pergunta.ativa && totalOpcoes < 2
  // Sem nenhuma opção, "sem mapeamento" não descreve nada — o aviso pertinente é
  // o de "Menos de 2 opções". O backend manda `temMapeamento: false` para pergunta
  // vazia, o que acendia os dois pills ao mesmo tempo.
  const temOpcoesSemMapa =
    totalOpcoes > 0 && !(pergunta.temMapeamento ?? pergunta.opcoes.every((o) => !semMapa(o)))

  return (
    <div
      className={cn(
        'group flex items-stretch overflow-hidden rounded-[20px] border border-plum/7 bg-white shadow-[0_2px_10px_rgba(45,24,64,0.05)] transition-all duration-200',
        'hover:-translate-y-0.5 hover:border-mauve/20 hover:shadow-[0_12px_32px_rgba(45,24,64,0.10)]',
        inativa && 'opacity-75',
      )}
    >
      <span className={cn('w-1 shrink-0', inativa ? 'bg-plum/12' : 'bg-gradient-to-b from-mauve to-mauve-dark')} />

      <div className="flex shrink-0 flex-col items-center justify-center gap-1.5 py-[18px] pl-[18px] pr-3.5">
        <OrderArrow dir="up" disabled={index === 0} onClick={() => onMove(-1)} />
        <div
          className={cn(
            'flex h-[38px] w-[38px] items-center justify-center rounded-pill font-display text-lg shadow-[inset_0_0_0_1px_rgba(122,74,92,0.15)]',
            inativa ? 'bg-cream-mid text-plum/40' : 'text-mauve-dark',
          )}
          style={inativa ? undefined : { background: 'radial-gradient(120% 120% at 30% 20%, #E8D5DA, #EDE6F4)' }}
        >
          {pergunta.ordem}
        </div>
        <OrderArrow dir="down" disabled={index === total - 1} onClick={() => onMove(1)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 py-4 pl-1.5 pr-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-plum/35">
                Pergunta {pergunta.ordem}
              </span>
              <Tag label={pergunta.ativa ? 'Ativa' : 'Inativa'} variant={pergunta.ativa ? 'primary' : 'muted'} size="sm" />
            </div>
            <p className="font-display text-xl leading-[1.25] text-plum">{pergunta.texto}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <ESButton variant="secondary" size="sm" startContent={<EditIcon size={15} />} onPress={onEdit}>
              Editar
            </ESButton>
            <button
              type="button"
              onClick={onToggle}
              className="rounded-pill border border-plum/15 px-3.5 py-[7px] text-[13px] font-medium text-plum/65 transition-colors hover:bg-plum/[0.04]"
            >
              {pergunta.ativa ? 'Desativar' : 'Ativar'}
            </button>
            <button
              type="button"
              onClick={onDelete}
              title="Excluir pergunta"
              aria-label="Excluir pergunta"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] text-plum/40 transition-colors hover:bg-red-alert/10 hover:text-red-alert"
            >
              <TrashIcon size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 border-t border-plum/5 pt-2.5">
          <button type="button" onClick={onOpcoes} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-mauve">
            <SlidersIcon size={15} />
            {totalOpcoes} {totalOpcoes === 1 ? 'opção' : 'opções'} · gerenciar →
          </button>
          {poucasOpcoes && <WarnPill>Menos de 2 opções</WarnPill>}
          {temOpcoesSemMapa && <WarnPill>Opções sem mapeamento</WarnPill>}
        </div>
      </div>
    </div>
  )
}

function OrderArrow({ dir, disabled, onClick }: { dir: 'up' | 'down'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={dir === 'up' ? 'Subir' : 'Descer'}
      className={cn(
        'flex h-5 w-6 items-center justify-center rounded-md transition-colors',
        disabled ? 'cursor-default text-plum/20' : 'text-mauve hover:bg-mauve/12',
      )}
    >
      {dir === 'up' ? <ChevronUpIcon size={15} /> : <ChevronDownIcon size={15} />}
    </button>
  )
}
