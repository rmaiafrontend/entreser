import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  /** Identificador único da coluna. */
  key: string
  /** Rótulo do cabeçalho. */
  header: ReactNode
  align?: 'start' | 'center' | 'end'
  /** Largura opcional (ex.: '30%', '44px'). Respeitada sob `table-fixed`. */
  width?: string
  /** Classes extra na célula do corpo (ex.: reduzir padding numa coluna estreita). */
  cellClassName?: string
  /** Classes extra na célula de cabeçalho. */
  headerClassName?: string
  /** Renderiza a célula a partir da linha (tipado). */
  cell: (row: T) => ReactNode
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  /** Chave estável por linha (para o React). */
  getRowKey: (row: T) => string | number
  /** Torna as linhas clicáveis (hover + cursor). */
  onRowClick?: (row: T) => void
  /** Classe extra por linha (ex.: esmaecer anonimizadas). */
  rowClassName?: (row: T) => string | undefined
  emptyMessage?: ReactNode
  /**
   * Largura mínima da tabela. Abaixo dela, o contêiner rola horizontalmente em vez
   * de comprimir/esconder colunas (a coluna de ações some, do contrário). Default
   * conservador que só ativa o scroll em viewports estreitos.
   */
  minWidth?: string
  className?: string
}

const ALIGN: Record<NonNullable<DataTableColumn<unknown>['align']>, string> = {
  start: 'text-left',
  center: 'text-center',
  end: 'text-right',
}

/**
 * DataTable — tabela do backoffice: cabeçalho eyebrow (11px caixa-alta),
 * linhas com borda leve e clique opcional. API baseada em `cell(row)` tipada,
 * escalável para qualquer entidade. É o primitivo de tabela de todas as
 * listagens do painel.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  rowClassName,
  emptyMessage = 'Nenhum item encontrado',
  minWidth = '640px',
  className,
}: DataTableProps<T>) {
  return (
    // Rede de segurança: em viewport estreito a tabela rola horizontalmente aqui,
    // dentro do card. O `overflow-hidden` do ESCard (que arredonda os cantos) fica
    // intacto — o scroll é responsabilidade deste wrapper, não do card.
    <div className="overflow-x-auto">
      <table
        style={{ minWidth }}
        // `table-fixed` faz o navegador RESPEITAR as larguras declaradas por coluna
        // em vez de dimensionar pelo conteúdo. Sem isso, um título longo estica a
        // tabela além de 100% e o card recorta a coluna de ações à direita.
        className={cn('w-full table-fixed border-collapse', className)}
      >
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={c.width ? { width: c.width } : undefined}
                className={cn(
                  'truncate border-b border-plum/6 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-plum/40',
                  ALIGN[c.align ?? 'start'],
                  c.headerClassName,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center text-sm text-plum/40">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-b border-plum/5 last:border-0',
                  onRowClick && 'cursor-pointer transition-colors hover:bg-mauve/[0.04]',
                  rowClassName?.(row),
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      'px-5 py-3.5 align-middle text-sm text-plum',
                      ALIGN[c.align ?? 'start'],
                      c.cellClassName,
                    )}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
