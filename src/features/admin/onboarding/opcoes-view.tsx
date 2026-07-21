'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertIcon,
  BackButton,
  ChevronDownIcon,
  ChevronUpIcon,
  Dialog,
  EditIcon,
  ESButton,
  ESCard,
  ESSpinner,
  IconButton,
  PageHeader,
  PlusIcon,
  SlidersIcon,
  Tag,
  TrashIcon,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { useFaseOptions } from '@/features/admin/fases/use-fases'
import { mapaResumo } from './helpers'
import { MapeamentoDialog } from './mapeamento-dialog'
import { OpcaoDialog } from './opcao-dialog'
import { usePergunta } from './use-onboarding'
import type { Opcao } from './types'

export function OpcoesView({ perguntaId }: { perguntaId: string }) {
  const router = useRouter()
  const { pergunta, addOpcao, updateOpcao, deleteOpcao, moveOpcao, setMapa } = usePergunta(perguntaId)
  const fases = useFaseOptions()
  const [opDialog, setOpDialog] = useState<Opcao | 'new' | null>(null)
  const [mapTarget, setMapTarget] = useState<Opcao | null>(null)
  const [confirmDeleteOp, setConfirmDeleteOp] = useState<Opcao | null>(null)

  if (pergunta === undefined) {
    return (
      <div>
        <PageHeader title="Opções de resposta" />
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex justify-center py-16">
            <ESSpinner size="md" label="Carregando pergunta…" />
          </div>
        </ESCard>
      </div>
    )
  }
  if (!pergunta) {
    return (
      <div>
        <PageHeader title="Pergunta não encontrada" />
        <ESCard variant="solid" isHoverable={false}>
          <div className="px-6 py-12 text-center">
            <p className="mb-4 text-[14.5px] text-plum/60">A pergunta que você tentou abrir não existe.</p>
            <ESButton variant="primary" onPress={() => router.push('/admin/onboarding')}>
              Voltar para perguntas
            </ESButton>
          </div>
        </ESCard>
      </div>
    )
  }

  const opcoes = [...pergunta.opcoes].sort((a, b) => a.ordem - b.ordem)
  const faseName = (fid: string) => fases.find((f) => f.id === fid)?.nome ?? null
  const nextOrdem = pergunta.opcoes.length ? Math.max(...pergunta.opcoes.map((o) => o.ordem)) + 1 : 1

  return (
    <div>
      <BackButton href="/admin/onboarding" label="Voltar para perguntas" />
      <div className="mb-[22px]">
        <div className="mb-1.5 flex items-center gap-2.5">
          <span className="text-eyebrow text-mauve">Opções de resposta</span>
          <Tag label={pergunta.ativa ? 'Ativa' : 'Inativa'} variant={pergunta.ativa ? 'primary' : 'muted'} size="sm" />
        </div>
        <h1 className="font-display text-[30px] font-normal leading-[1.15] text-plum">{pergunta.texto}</h1>
      </div>

      {pergunta.opcoes.length < 2 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#B8860B]/25 bg-[#B8860B]/10 px-3.5 py-2.5 text-[13.5px] text-[#7A5C00]">
          <AlertIcon size={16} /> Uma pergunta precisa de ao menos 2 opções para ser respondível pela usuária.
        </div>
      )}

      <div className="mb-3.5 flex justify-end">
        <ESButton variant="primary" size="sm" startContent={<PlusIcon size={15} />} onPress={() => setOpDialog('new')}>
          Adicionar opção
        </ESButton>
      </div>

      {opcoes.length === 0 ? (
        <ESCard variant="solid" isHoverable={false}>
          <div className="px-6 py-11 text-center">
            <p className="mb-3.5 text-sm text-plum/60">Nenhuma opção ainda. Adicione a primeira resposta desta pergunta.</p>
            <ESButton variant="primary" size="sm" onPress={() => setOpDialog('new')}>
              Adicionar opção
            </ESButton>
          </div>
        </ESCard>
      ) : (
        <div className="flex flex-col gap-2.5">
          {opcoes.map((op, i) => {
            const resumo = mapaResumo(op)
            return (
              <ESCard key={op.id} variant="solid" isHoverable={false}>
                <div className="flex items-center gap-3.5 px-5 py-4">
                  <div className="flex flex-col gap-px">
                    <MiniArrow dir="up" disabled={i === 0} onClick={() => moveOpcao(pergunta.id, op.id, -1)} />
                    <MiniArrow dir="down" disabled={i === opcoes.length - 1} onClick={() => moveOpcao(pergunta.id, op.id, 1)} />
                  </div>
                  <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-pill bg-plum-soft font-display text-sm text-mauve-dark">
                    {op.ordem}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14.5px] font-medium text-plum">{op.texto}</div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {resumo.length === 0 ? (
                        <WarnPillInline />
                      ) : (
                        resumo.map(([fid, pts]) => {
                          const nome = faseName(fid)
                          if (!nome) return null
                          return (
                            <span key={fid} className="rounded-pill bg-mauve-ghost px-2.5 py-[3px] text-xs text-plum">
                              {nome} · <strong>{pts}</strong>
                            </span>
                          )
                        })
                      )}
                    </div>
                  </div>
                  <ESButton variant="ghost" size="sm" startContent={<SlidersIcon size={15} />} onPress={() => setMapTarget(op)}>
                    Mapeamento
                  </ESButton>
                  <IconButton title="Editar opção" onPress={() => setOpDialog(op)}>
                    <EditIcon size={16} />
                  </IconButton>
                  <IconButton title="Excluir opção" variant="danger" onPress={() => setConfirmDeleteOp(op)}>
                    <TrashIcon size={16} />
                  </IconButton>
                </div>
              </ESCard>
            )
          })}
        </div>
      )}

      {opDialog !== null && (
        <OpcaoDialog
          target={opDialog}
          nextOrdem={nextOrdem}
          onClose={() => setOpDialog(null)}
          onSubmit={async (data) => {
            if (opDialog === 'new') await addOpcao(pergunta.id, data)
            else await updateOpcao(pergunta.id, opDialog.id, data)
          }}
        />
      )}

      {mapTarget && (
        <MapeamentoDialog
          opcao={mapTarget}
          fases={fases}
          onClose={() => setMapTarget(null)}
          onSave={(mapa) => setMapa(pergunta.id, mapTarget.id, mapa)}
        />
      )}

      {confirmDeleteOp && (
        <Dialog
          isOpen
          onClose={() => setConfirmDeleteOp(null)}
          variant="destructive"
          title="Excluir opção?"
          description={`A opção "${confirmDeleteOp.texto}" e seu mapeamento de fases serão excluídos permanentemente. Esta ação não pode ser desfeita.`}
          footer={
            <>
              <ESButton variant="ghost" onPress={() => setConfirmDeleteOp(null)}>
                Cancelar
              </ESButton>
              <ESButton
                variant="destructive"
                onPress={async () => {
                  const alvo = confirmDeleteOp
                  setConfirmDeleteOp(null)
                  await deleteOpcao(pergunta.id, alvo.id)
                }}
              >
                Excluir
              </ESButton>
            </>
          }
        />
      )}
    </div>
  )
}

function WarnPillInline() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill bg-[#B8860B]/12 px-2.5 py-[3px] text-xs text-[#7A5C00]">
      <AlertIcon size={12} /> sem mapeamento
    </span>
  )
}

function MiniArrow({ dir, disabled, onClick }: { dir: 'up' | 'down'; disabled: boolean; onClick: () => void }) {
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
