'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ConteudosIcon,
  DataTable,
  Dialog,
  ESButton,
  ESCard,
  ESSpinner,
  EmptyState,
  PageHeader,
  Pagination,
  PlusIcon,
  RowActionsItem,
  RowActionsMenu,
  SearchIcon,
  SelectInput,
  Tag,
  TextInput,
  type DataTableColumn,
} from '@/components/ui'
import { formatDateBR } from '@/features/admin/lib/format'
import { FORMATO } from './meta'
import { useConteudos } from './use-conteudos'
import type { Conteudo } from './types'

const PER_PAGE = 15

interface ConfirmState {
  conteudo: Conteudo
  acao: 'despublicar' | 'excluir'
}

export function ConteudosListView() {
  const router = useRouter()
  const { items, loading, error, togglePublish, remove, reload } = useConteudos()

  const [busca, setBusca] = useState('')
  const [fFormato, setFFormato] = useState('')
  const [fStatus, setFStatus] = useState('')
  const [page, setPage] = useState(1)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)

  const filtered = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return items.filter((c) => {
      if (q && !c.titulo.toLowerCase().includes(q)) return false
      if (fFormato && c.formato !== fFormato) return false
      if (fStatus === 'publicado' && !c.publicado) return false
      if (fStatus === 'rascunho' && c.publicado) return false
      return true
    })
  }, [items, busca, fFormato, fStatus])

  const hasFilters = Boolean(busca || fFormato || fStatus)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const columns: DataTableColumn<Conteudo>[] = [
    {
      key: 'titulo',
      header: 'Título',
      width: '34%',
      cell: (c) => {
        const Icon = FORMATO[c.formato].Icon
        return (
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-plum-soft text-mauve">
              <Icon size={18} />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-plum" title={c.titulo}>
                {c.titulo}
              </div>
              <div className="text-xs text-plum/45">{FORMATO[c.formato].label}</div>
            </div>
          </div>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '12%',
      cell: (c) => <Tag label={c.publicado ? 'Publicado' : 'Rascunho'} variant={c.publicado ? 'primary' : 'muted'} size="sm" />,
    },
    {
      key: 'duracao',
      header: 'Duração',
      width: '11%',
      cell: (c) => <span className="text-[13.5px] text-plum/60">{c.duracao ? `${c.duracao} min` : '—'}</span>,
    },
    {
      key: 'atualizado',
      header: 'Atualizado',
      width: '13%',
      cell: (c) => <span className="text-[13px] text-plum/55">{formatDateBR(c.atualizadoEm)}</span>,
    },
    {
      key: 'acoes',
      header: '',
      width: '52px',
      align: 'end',
      // Coluna estreita: reduz o padding para o botão de menu (32px) caber sob table-fixed.
      cellClassName: 'px-2',
      headerClassName: 'px-2',
      cell: (c) => (
        <ContentRowMenu
          conteudo={c}
          onEdit={() => router.push(`/admin/conteudos/${c.id}/editar`)}
          onToggle={() => (c.publicado ? setConfirm({ conteudo: c, acao: 'despublicar' }) : togglePublish(c))}
          onDelete={() => setConfirm({ conteudo: c, acao: 'excluir' })}
        />
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Conteúdos"
        description="Biblioteca de artigos, vídeos e áudios — publicados e rascunhos."
        action={
          <ESButton variant="primary" startContent={<PlusIcon size={16} />} onPress={() => router.push('/admin/conteudos/novo')}>
            Novo conteúdo
          </ESButton>
        }
      />

      <div className="mb-[18px] flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-[1_1_260px]">
          <TextInput placeholder="Buscar por título" value={busca} onChange={(v) => { setBusca(v); setPage(1) }} startContent={<SearchIcon size={16} />} />
        </div>
        <div className="w-[170px]">
          <SelectInput
            placeholder="Todos os formatos"
            selectedKey={fFormato}
            onChange={(v) => { setFFormato(v); setPage(1) }}
            options={[
              { key: '', label: 'Todos os formatos' },
              { key: 'artigo', label: 'Artigo' },
              { key: 'video', label: 'Vídeo' },
              { key: 'audio', label: 'Áudio' },
            ]}
          />
        </div>
        <div className="w-[170px]">
          <SelectInput
            placeholder="Todos os status"
            selectedKey={fStatus}
            onChange={(v) => { setFStatus(v); setPage(1) }}
            options={[
              { key: '', label: 'Todos os status' },
              { key: 'publicado', label: 'Publicado' },
              { key: 'rascunho', label: 'Rascunho' },
            ]}
          />
        </div>
      </div>

      {loading ? (
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex justify-center py-16">
            <ESSpinner size="md" label="Carregando conteúdos…" />
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
      ) : items.length === 0 ? (
        <ESCard variant="solid" isHoverable={false}>
          <EmptyState
            icon={<ConteudosIcon size={24} />}
            title="Nenhum conteúdo ainda"
            description="Crie o primeiro conteúdo da biblioteca."
            action={
              <ESButton variant="primary" onPress={() => router.push('/admin/conteudos/novo')}>
                Novo conteúdo
              </ESButton>
            }
          />
        </ESCard>
      ) : (
        <ESCard variant="solid" isHoverable={false}>
          <div className="border-b border-plum/6 px-[22px] py-3.5 text-[13px] text-plum/50">
            {filtered.length} {filtered.length === 1 ? 'conteúdo' : 'conteúdos'}
            {hasFilters ? (filtered.length === 1 ? ' encontrado' : ' encontrados') : ''}
          </div>
          {pageItems.length === 0 ? (
            <div className="px-10 py-10 text-center text-sm text-plum/50">
              Nenhum conteúdo encontrado para os filtros aplicados.
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={pageItems}
              getRowKey={(c) => c.id}
              onRowClick={(c) => router.push(`/admin/conteudos/${c.id}/editar`)}
            />
          )}
          {totalPages > 1 && (
            <div className="flex justify-center px-[22px] py-4">
              <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </ESCard>
      )}

      {confirm && (
        <Dialog
          isOpen
          onClose={() => setConfirm(null)}
          variant="destructive"
          title={confirm.acao === 'excluir' ? 'Excluir conteúdo?' : 'Despublicar conteúdo?'}
          description={`"${confirm.conteudo.titulo}" (${FORMATO[confirm.conteudo.formato].label}) deixa de aparecer para as usuárias no feed, busca e navegação. ${
            confirm.acao === 'excluir'
              ? 'Exclusão lógica: o registro e os históricos de progresso permanecem no banco.'
              : 'A ação é reversível — você pode publicar novamente depois.'
          }`}
          footer={
            <>
              <ESButton variant="ghost" onPress={() => setConfirm(null)}>
                Cancelar
              </ESButton>
              <ESButton
                variant="destructive"
                onPress={async () => {
                  if (confirm.acao === 'excluir') await remove(confirm.conteudo)
                  else await togglePublish(confirm.conteudo)
                  setConfirm(null)
                }}
              >
                {confirm.acao === 'excluir' ? 'Excluir' : 'Despublicar'}
              </ESButton>
            </>
          }
        />
      )}
    </div>
  )
}

function ContentRowMenu({
  conteudo,
  onEdit,
  onToggle,
  onDelete,
}: {
  conteudo: Conteudo
  onEdit: () => void
  onToggle: () => void
  onDelete: () => void
}) {
  return (
    <RowActionsMenu>
      <RowActionsItem onSelect={onEdit}>Editar</RowActionsItem>
      <RowActionsItem onSelect={onToggle}>
        {conteudo.publicado ? 'Despublicar' : 'Publicar'}
      </RowActionsItem>
      <RowActionsItem danger onSelect={onDelete}>
        Excluir
      </RowActionsItem>
    </RowActionsMenu>
  )
}
