'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DataTable,
  ESAvatar,
  ESButton,
  ESCard,
  ESSpinner,
  EmptyState,
  PageHeader,
  Pagination,
  PlusIcon,
  ProfissionaisIcon,
  SearchIcon,
  SelectInput,
  TextInput,
  type DataTableColumn,
} from '@/components/ui'
import { useAdminAuth } from '@/features/admin/context/admin-auth-context'
import { formatPhone } from '@/features/admin/lib/format'
import { StatusTags } from './meta'
import { ProfissionalAddDialog } from './profissional-add-dialog'
import { ProfissionalDeactivateDialog } from './profissional-deactivate-dialog'
import { ProfissionalRowMenu } from './profissional-row-menu'
import { useProfissionais } from './use-profissionais'
import type { Profissional } from './types'

const PER_PAGE = 8

export function ProfissionaisListView() {
  const router = useRouter()
  const { admin } = useAdminAuth()
  const { items, loading, error, add, deactivate, reactivate, resendInvite, reload } = useProfissionais()

  const [busca, setBusca] = useState('')
  const [fStatus, setFStatus] = useState('')
  const [fConvite, setFConvite] = useState('')
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const [deactivateTarget, setDeactivateTarget] = useState<Profissional | null>(null)

  const filtered = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return items.filter((p) => {
      const okQ =
        !q ||
        p.nome.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.crp.toLowerCase().includes(q)
      const okS = !fStatus || (fStatus === 'ativa' ? p.ativa : !p.ativa)
      const okC = !fConvite || p.convite === fConvite
      return okQ && okS && okC
    })
  }, [items, busca, fStatus, fConvite])

  const hasFilters = Boolean(busca || fStatus || fConvite)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const clearFilters = () => {
    setBusca('')
    setFStatus('')
    setFConvite('')
    setPage(1)
  }

  const columns: DataTableColumn<Profissional>[] = [
    {
      key: 'prof',
      header: 'Profissional',
      width: '30%',
      cell: (p) => (
        <div className="flex min-w-0 items-center gap-3">
          <ESAvatar name={p.nome} size="sm" isBordered />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-plum">{p.nome}</div>
            <div className="text-[12.5px] text-plum/50">{p.abordagem}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contato',
      header: 'Contato',
      width: '22%',
      cell: (p) => (
        <div className="min-w-0">
          <div className="truncate text-[13px] text-plum/75">{p.email}</div>
          <div className="text-[12.5px] text-plum/50">{formatPhone(p.telefone)}</div>
        </div>
      ),
    },
    {
      key: 'crp',
      header: 'CRP',
      width: '14%',
      cell: (p) => <span className="text-[13px] text-plum/75">{p.crp}</span>,
    },
    { key: 'status', header: 'Status', cell: (p) => <StatusTags p={p} /> },
    {
      key: 'acoes',
      header: '',
      width: '52px',
      align: 'end',
      // Coluna estreita: sob table-fixed, reduz o padding para o botão de menu (32px) caber.
      cellClassName: 'px-2',
      headerClassName: 'px-2',
      cell: (p) => (
        <ProfissionalRowMenu
          p={p}
          onView={() => router.push(`/admin/profissionais/${p.id}`)}
          onEdit={() => router.push(`/admin/profissionais/${p.id}/editar`)}
          onResend={() => resendInvite(p)}
          onDeactivate={() => setDeactivateTarget(p)}
          onReactivate={() => reactivate(p)}
        />
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Profissionais"
        description="Cadastre e gerencie as psicólogas que atendem na plataforma."
        action={
          <ESButton variant="primary" startContent={<PlusIcon size={16} />} onPress={() => setAddOpen(true)}>
            Adicionar profissional
          </ESButton>
        }
      />

      <div className="mb-[18px] flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-[1_1_280px]">
          <TextInput
            placeholder="Buscar por nome, e-mail ou CRP"
            value={busca}
            onChange={(v) => { setBusca(v); setPage(1) }}
            startContent={<SearchIcon size={16} />}
          />
        </div>
        <div className="w-[170px]">
          <SelectInput
            placeholder="Todos os status"
            selectedKey={fStatus}
            onChange={(v) => { setFStatus(v); setPage(1) }}
            options={[
              { key: '', label: 'Todos os status' },
              { key: 'ativa', label: 'Ativa' },
              { key: 'inativa', label: 'Inativa' },
            ]}
          />
        </div>
        <div className="w-[190px]">
          <SelectInput
            placeholder="Todos os convites"
            selectedKey={fConvite}
            onChange={(v) => { setFConvite(v); setPage(1) }}
            options={[
              { key: '', label: 'Todos os convites' },
              { key: 'ativo', label: 'Acesso ativo' },
              { key: 'pendente', label: 'Convite pendente' },
              { key: 'expirado', label: 'Convite expirado' },
            ]}
          />
        </div>
      </div>

      {loading ? (
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex justify-center py-16">
            <ESSpinner size="md" label="Carregando profissionais…" />
          </div>
        </ESCard>
      ) : error ? (
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-plum/60">{error}</p>
            <ESButton variant="primary" onPress={() => void reload()}>
              Tentar novamente
            </ESButton>
          </div>
        </ESCard>
      ) : (
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex items-center justify-between border-b border-plum/6 px-5 py-4">
            <span className="text-[13.5px] text-plum/60">
              {filtered.length} {filtered.length === 1 ? 'profissional' : 'profissionais'}
              {hasFilters ? ' (filtrado)' : ''}
            </span>
          </div>

          {pageItems.length === 0 ? (
            <EmptyState
              icon={<ProfissionaisIcon size={24} />}
              title={hasFilters ? 'Nenhuma profissional encontrada' : 'Nenhuma profissional cadastrada'}
              description={
                hasFilters
                  ? 'Nenhum resultado corresponde aos filtros aplicados.'
                  : 'Cadastre a primeira profissional para enviar o convite de acesso.'
              }
              action={
                hasFilters ? (
                  <ESButton variant="secondary" onPress={clearFilters}>
                    Limpar filtros
                  </ESButton>
                ) : (
                  <ESButton variant="primary" startContent={<PlusIcon size={16} />} onPress={() => setAddOpen(true)}>
                    Adicionar profissional
                  </ESButton>
                )
              }
            />
          ) : (
            <DataTable
              columns={columns}
              rows={pageItems}
              getRowKey={(p) => p.id}
              onRowClick={(p) => router.push(`/admin/profissionais/${p.id}`)}
            />
          )}
        </ESCard>
      )}

      {totalPages > 1 && (
        <div className="mt-[18px] flex justify-end">
          <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
        </div>
      )}

      {addOpen && (
        <ProfissionalAddDialog
          existing={items}
          onClose={() => setAddOpen(false)}
          onSubmit={async (input) => {
            const novo = await add(input, admin?.nome ?? 'Equipe Entre Ser')
            if (novo) {
              // Invalida o Router Cache antes de sair para o detalhe: sem isso, ao
              // voltar para cá a listagem é servida do cache (o efeito de
              // `useProfissionais` não re-roda) e a recém-cadastrada não aparece,
              // exigindo recarregar a página. Mesmo motivo do `trail-form-view`.
              router.refresh()
              router.push(`/admin/profissionais/${novo.id}`)
            }
          }}
        />
      )}

      <ProfissionalDeactivateDialog
        target={deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={deactivate}
      />
    </div>
  )
}
