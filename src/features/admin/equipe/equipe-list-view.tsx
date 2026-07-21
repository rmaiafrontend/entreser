'use client'

import { useState } from 'react'
import {
  DataTable,
  ESAvatar,
  ESButton,
  ESCard,
  ESSpinner,
  EmptyState,
  PageHeader,
  PlusIcon,
  ProfissionaisIcon,
  Tag,
  type DataTableColumn,
} from '@/components/ui'
import { useAdminAuth } from '@/features/admin/context/admin-auth-context'
import { formatDateBR } from '@/features/admin/lib/format'
import { EquipeAddDialog } from './equipe-add-dialog'
import { useEquipe } from './use-equipe'
import type { EquipeMembro } from './types'

export function EquipeListView() {
  const { admin } = useAdminAuth()
  const { items, loading, error, existingEmails, add, reload } = useEquipe()
  const [addOpen, setAddOpen] = useState(false)

  const columns: DataTableColumn<EquipeMembro>[] = [
    {
      key: 'membro',
      header: 'Membro',
      width: '32%',
      cell: (m) => (
        <div className="flex min-w-0 items-center gap-3">
          <ESAvatar name={m.nome} size="sm" isBordered />
          <span className="truncate text-sm font-medium text-plum">
            {m.nome}
            {m.email === admin?.email && <span className="ml-2 text-[11px] text-plum/40">· você</span>}
          </span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'E-mail',
      width: '32%',
      cell: (m) => <span className="block truncate text-sm text-plum/60">{m.email}</span>,
    },
    {
      key: 'situacao',
      header: 'Situação',
      cell: (m) => <Tag label={m.ativa ? 'Ativa' : 'Inativa'} variant={m.ativa ? 'primary' : 'muted'} size="sm" />,
    },
    {
      key: 'entrada',
      header: 'Entrada',
      cell: (m) => <span className="text-sm text-plum/55">{formatDateBR(m.criadaEm)}</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Equipe"
        description="Membros internos da Entre Ser com acesso ao backoffice."
        action={
          <ESButton variant="primary" startContent={<PlusIcon size={16} />} onPress={() => setAddOpen(true)}>
            Adicionar membro
          </ESButton>
        }
      />

      <ESCard variant="solid" isHoverable={false}>
        {loading ? (
          <div className="flex justify-center py-16">
            <ESSpinner size="md" label="Carregando equipe…" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-plum/60">{error}</p>
            <ESButton variant="primary" onPress={() => void reload()}>
              Tentar novamente
            </ESButton>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<ProfissionaisIcon size={24} />}
            title="Nenhum membro ainda"
            description="Adicione o primeiro membro da equipe interna."
            action={
              <ESButton variant="primary" onPress={() => setAddOpen(true)}>
                Adicionar membro
              </ESButton>
            }
          />
        ) : (
          <>
            <div className="border-b border-plum/6 px-[22px] py-3.5 text-[13px] text-plum/50">
              {items.length} {items.length === 1 ? 'membro' : 'membros'}
            </div>
            <DataTable columns={columns} rows={items} getRowKey={(m) => m.id} />
          </>
        )}
      </ESCard>

      <p className="mt-3.5 text-[12.5px] leading-relaxed text-plum/45">
        No MVP não há edição, desativação ou remoção de membros da equipe pelo painel — a API não
        expõe esses verbos. A situação é apenas informativa.
      </p>

      {addOpen && (
        <EquipeAddDialog
          existingEmails={existingEmails}
          onClose={() => setAddOpen(false)}
          onSubmit={async (input) => (await add(input)) !== null}
        />
      )}
    </div>
  )
}
