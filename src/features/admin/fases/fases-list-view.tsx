'use client'

import { useMemo, useState } from 'react'
import { ESButton, ESCard, ESSpinner, EmptyState, FasesIcon, PageHeader, PlusIcon } from '@/components/ui'
import { useTagOptions } from '@/features/admin/tags/use-tags'
import { PhaseFormDialog } from './phase-form-dialog'
import { PhaseRow } from './phase-row'
import { useFases } from './use-fases'
import type { Fase } from './types'

export function FasesListView() {
  const { items, loading, error, add, update, move, reload } = useFases()
  const tags = useTagOptions()
  const [editing, setEditing] = useState<Fase | 'new' | null>(null)

  const sorted = useMemo(() => [...items].sort((a, b) => a.ordem - b.ordem), [items])
  const tagName = (id: string) => tags.find((t) => t.id === id)?.nome ?? null
  const nextOrdem = items.length ? Math.max(...items.map((f) => f.ordem)) + 1 : 1

  return (
    <div>
      <PageHeader
        title="Fases"
        description="Os momentos do ciclo da usuária. Cada fase agrega tags que orientam o feed e a inferência no onboarding."
        action={
          <ESButton variant="primary" startContent={<PlusIcon size={16} />} onPress={() => setEditing('new')}>
            Nova fase
          </ESButton>
        }
      />

      {loading ? (
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex justify-center py-16">
            <ESSpinner size="md" label="Carregando fases…" />
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
      ) : sorted.length === 0 ? (
        <ESCard variant="solid" isHoverable={false}>
          <EmptyState
            icon={<FasesIcon size={24} />}
            title="Nenhuma fase ainda"
            description="Crie a primeira fase do ciclo."
            action={
              <ESButton variant="primary" onPress={() => setEditing('new')}>
                Nova fase
              </ESButton>
            }
          />
        </ESCard>
      ) : (
        <div className="flex flex-col gap-3.5">
          {sorted.map((f, idx) => (
            <PhaseRow
              key={f.id}
              fase={f}
              index={idx}
              total={sorted.length}
              tagLabels={f.tags.map(tagName).filter((n): n is string => n !== null)}
              onMove={(dir) => move(f.id, dir)}
              onEdit={() => setEditing(f)}
            />
          ))}
        </div>
      )}

      <p className="mt-3.5 text-[12.5px] leading-relaxed text-plum/45">
        Não há exclusão de fase — desativar (Ativa = não) é o mecanismo de saída de uso. Alterar as
        tags muda imediatamente o que é priorizado no feed daquela fase.
      </p>

      {editing !== null && (
        <PhaseFormDialog
          target={editing}
          tags={tags}
          nextOrdem={nextOrdem}
          onClose={() => setEditing(null)}
          onSubmit={async (data) => {
            if (editing === 'new') await add(data)
            else await update(editing.id, data)
          }}
        />
      )}
    </div>
  )
}
