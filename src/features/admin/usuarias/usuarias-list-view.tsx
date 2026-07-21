'use client'

import {
  DataTable,
  ESAvatar,
  ESButton,
  ESCard,
  ESSpinner,
  EmptyState,
  PageHeader,
  Pagination,
  SearchIcon,
  SelectInput,
  Tag,
  TextInput,
  UsuariasIcon,
  type DataTableColumn,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { formatDateBR, formatPhone } from '@/features/admin/lib/format'
import { USER_STATUS, type Plano, type UsuariaRow, type UsuariaStatus } from './data'
import { useUsuarias } from './use-usuarias'

export function UsuariasListView() {
  const {
    rows,
    loading,
    error,
    reload,
    page,
    totalPages,
    totalElements,
    busca,
    setBusca,
    status,
    setStatus,
    plano,
    setPlano,
    hasFilters,
    clear,
    setPage,
  } = useUsuarias()

  const columns: DataTableColumn<UsuariaRow>[] = [
    {
      key: 'usuaria',
      header: 'Usuária',
      width: '22%',
      cell: (u) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <ESAvatar name={u.status === 'anonimizada' ? '?' : u.nome} size="sm" />
          <span className="truncate text-sm font-medium text-plum">{u.nome}</span>
        </div>
      ),
    },
    {
      key: 'contato',
      header: 'Contato',
      width: '20%',
      cell: (u) => (
        <div className="min-w-0">
          <div className="truncate text-[13.5px] text-plum/70">{u.email}</div>
          <div className="text-[12.5px] text-plum/45">{formatPhone(u.telefone)}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (u) => (
        <Tag label={USER_STATUS[u.status].label} variant={USER_STATUS[u.status].variant} size="sm" />
      ),
    },
    { key: 'plano', header: 'Plano', cell: (u) => <span className="text-[13.5px] text-plum/65">{u.plano}</span> },
    {
      key: 'fase',
      header: 'Fase',
      cell: (u) => (
        <span className={cn('text-[13px]', u.fase ? 'text-plum/65' : 'text-plum/35')}>
          {u.fase ?? 'sem fase'}
        </span>
      ),
    },
    {
      key: 'cadastro',
      header: 'Cadastro',
      cell: (u) => <span className="text-[13.5px] text-plum/55">{formatDateBR(u.criadaEm)}</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Usuárias"
        description="Consulte as usuárias cadastradas na plataforma. Esta área é somente-leitura."
      />

      <div className="mb-[18px] flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-[1_1_260px]">
          <TextInput
            placeholder="Buscar por nome ou e-mail"
            value={busca}
            onChange={setBusca}
            startContent={<SearchIcon size={16} />}
          />
        </div>
        <div className="w-[190px]">
          <SelectInput
            placeholder="Todos os status"
            selectedKey={status}
            onChange={(v) => setStatus(v as UsuariaStatus | '')}
            options={[
              { key: '', label: 'Todos os status' },
              ...Object.entries(USER_STATUS).map(([key, v]) => ({ key, label: v.label })),
            ]}
          />
        </div>
        <div className="w-[150px]">
          <SelectInput
            placeholder="Todos os planos"
            selectedKey={plano}
            onChange={(v) => setPlano(v as Plano | '')}
            options={[
              { key: '', label: 'Todos os planos' },
              { key: 'Gratuito', label: 'Gratuito' },
              { key: 'Premium', label: 'Premium' },
            ]}
          />
        </div>
      </div>

      {loading ? (
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex justify-center py-16">
            <ESSpinner size="md" label="Carregando usuárias…" />
          </div>
        </ESCard>
      ) : error ? (
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-plum/60">{error}</p>
            <ESButton variant="primary" onPress={() => reload()}>
              Tentar novamente
            </ESButton>
          </div>
        </ESCard>
      ) : (
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex items-center justify-between border-b border-plum/6 px-[22px] py-3.5">
            <span className="text-[13px] text-plum/50">
              {totalElements} {totalElements === 1 ? 'usuária' : 'usuárias'}
              {hasFilters ? ' encontradas' : ''}
            </span>
            {hasFilters && (
              <button
                type="button"
                onClick={clear}
                className="text-[13px] font-medium text-mauve transition-colors hover:text-mauve-dark"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {rows.length === 0 ? (
            <EmptyState
              icon={<UsuariasIcon size={22} />}
              title="Nenhuma usuária encontrada"
              description="Nenhum resultado corresponde aos filtros aplicados."
              action={
                hasFilters ? (
                  <ESButton variant="ghost" size="sm" onPress={clear}>
                    Limpar filtros
                  </ESButton>
                ) : undefined
              }
            />
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              getRowKey={(u) => u.id}
              rowClassName={(u) => (u.status === 'anonimizada' ? 'opacity-60' : undefined)}
            />
          )}
        </ESCard>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination page={page + 1} totalPages={totalPages} onChange={(p) => setPage(p - 1)} />
        </div>
      )}

      <p className="mt-3.5 text-[12.5px] leading-relaxed text-plum/45">
        Somente-leitura no MVP: não há criação, edição ou exclusão de usuárias pelo painel. A gestão
        de dados é feita pela própria usuária (perfil e LGPD).
      </p>
    </div>
  )
}
