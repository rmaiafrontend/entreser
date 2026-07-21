'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ConteudosIcon,
  Dialog,
  ESButton,
  ESCard,
  ESSpinner,
  EmptyState,
  InfoNote,
  PageHeader,
  PlusIcon,
  SelectInput,
  SlidersIcon,
  TextInput,
  useToast,
} from '@/components/ui'
import { useFaseOptions } from '@/features/admin/fases/use-fases'
import { motivoNaoAtivavel } from './helpers'
import { PerguntaCard } from './pergunta-card'
import { PerguntaDialog } from './pergunta-dialog'
import { SimuladorDialog } from './simulador-dialog'
import { useOnboarding } from './use-onboarding'
import type { Pergunta } from './types'

export function OnboardingListView() {
  const router = useRouter()
  const { items, loading, error, addPergunta, updatePergunta, deletePergunta, movePergunta, reload } =
    useOnboarding()
  const fases = useFaseOptions()
  const { showToast } = useToast()
  const [busca, setBusca] = useState('')
  const [fStatus, setFStatus] = useState('')
  const [pergDialog, setPergDialog] = useState<Pergunta | 'new' | null>(null)
  const [confirmOff, setConfirmOff] = useState<Pergunta | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Pergunta | null>(null)
  const [simuladorOpen, setSimuladorOpen] = useState(false)

  const sorted = useMemo(() => [...items].sort((a, b) => a.ordem - b.ordem), [items])
  const totalAtivas = items.filter((p) => p.ativa).length
  const filtered = sorted.filter((p) => {
    const q = busca.trim().toLowerCase()
    if (q && !p.texto.toLowerCase().includes(q)) return false
    if (fStatus === 'ativa' && !p.ativa) return false
    if (fStatus === 'inativa' && p.ativa) return false
    return true
  })
  const nextOrdem = items.length ? Math.max(...items.map((p) => p.ordem)) + 1 : 1

  return (
    <div>
      <PageHeader
        title="Onboarding"
        description="O questionário de triagem que infere a fase inicial de cada nova usuária."
        action={
          <div className="flex gap-2.5">
            <ESButton variant="secondary" startContent={<SlidersIcon size={16} />} onPress={() => setSimuladorOpen(true)}>
              Simular
            </ESButton>
            <ESButton variant="primary" startContent={<PlusIcon size={16} />} onPress={() => setPergDialog('new')}>
              Nova pergunta
            </ESButton>
          </div>
        }
      />

      <div className="mb-2 flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-[1_1_260px]">
          <TextInput placeholder="Buscar pergunta" value={busca} onChange={setBusca} startContent={<ConteudosIcon size={16} />} />
        </div>
        <div className="w-[170px]">
          <SelectInput
            placeholder="Todas"
            selectedKey={fStatus}
            onChange={setFStatus}
            options={[
              { key: '', label: 'Todas' },
              { key: 'ativa', label: 'Ativas' },
              { key: 'inativa', label: 'Inativas' },
            ]}
          />
        </div>
      </div>
      <p className="mb-4 text-[13px] text-plum/50">
        {items.length} perguntas · {totalAtivas} ativas
      </p>

      {/* ES-020: zero perguntas ativas não é estado neutro — o onboarding fica
          desligado e novas usuárias não recebem fase. Alerta explícito. */}
      {!loading && !error && items.length > 0 && totalAtivas === 0 && (
        <div className="mb-4">
          <InfoNote>
            <strong>O onboarding está desligado.</strong> Nenhuma pergunta ativa — novas usuárias não
            respondem nada e não recebem uma fase inicial. Ative ao menos uma pergunta (com todas as
            opções mapeadas) para religar a inferência.
          </InfoNote>
        </div>
      )}

      {loading ? (
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex justify-center py-16">
            <ESSpinner size="md" label="Carregando perguntas…" />
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
            title="Nenhuma pergunta ainda"
            description="Crie a primeira pergunta do onboarding."
            action={
              <ESButton variant="primary" onPress={() => setPergDialog('new')}>
                Nova pergunta
              </ESButton>
            }
          />
        </ESCard>
      ) : (
        <div className="flex flex-col gap-3.5">
          {filtered.map((p, idx) => (
            <PerguntaCard
              key={p.id}
              pergunta={p}
              index={idx}
              total={filtered.length}
              onMove={(dir) => movePergunta(p.id, dir)}
              onEdit={() => setPergDialog(p)}
              onToggle={() => {
                if (p.ativa) {
                  setConfirmOff(p)
                  return
                }
                // ES-020: guarda-corpo — não ativa uma pergunta cujas opções não
                // estejam todas mapeadas (senão a inferência degrada em silêncio).
                const motivo = motivoNaoAtivavel(p)
                if (motivo) {
                  showToast(motivo, 'error')
                  return
                }
                updatePergunta(p.id, { texto: p.texto, ordem: p.ordem, ativa: true }, 'Pergunta ativada.')
              }}
              onDelete={() => setConfirmDelete(p)}
              onOpcoes={() => router.push(`/admin/onboarding/${p.id}`)}
            />
          ))}
        </div>
      )}

      {pergDialog !== null && (
        <PerguntaDialog
          target={pergDialog}
          nextOrdem={nextOrdem}
          onClose={() => setPergDialog(null)}
          onSubmit={async (data) => {
            if (pergDialog === 'new') {
              // ES-020: pergunta nova não tem opções — nasce inativa. Só se ativa
              // depois (pela guarda do toggle), com ≥2 opções todas mapeadas.
              await addPergunta({ ...data, ativa: false })
              return
            }
            // ES-020: editar não pode ATIVAR burlando a guarda. Se pediu ativa mas
            // a pergunta (com suas opções atuais) não pode ir ao ar, salva inativa.
            if (data.ativa) {
              const motivo = motivoNaoAtivavel({ ...pergDialog, ...data })
              if (motivo) {
                showToast(motivo, 'error')
                await updatePergunta(pergDialog.id, { ...data, ativa: false })
                return
              }
            }
            await updatePergunta(pergDialog.id, data, 'Pergunta atualizada.')
          }}
        />
      )}

      {confirmOff && (
        <Dialog
          isOpen
          onClose={() => setConfirmOff(null)}
          variant="destructive"
          title="Desativar pergunta?"
          description={`"${confirmOff.texto}" deixará de aparecer no onboarding das próximas usuárias. Quem já finalizou não é afetada.`}
          footer={
            <>
              <ESButton variant="ghost" onPress={() => setConfirmOff(null)}>
                Cancelar
              </ESButton>
              <ESButton
                variant="destructive"
                onPress={async () => {
                  await updatePergunta(
                    confirmOff.id,
                    { texto: confirmOff.texto, ordem: confirmOff.ordem, ativa: false },
                    'Pergunta desativada.',
                  )
                  setConfirmOff(null)
                }}
              >
                Desativar
              </ESButton>
            </>
          }
        />
      )}

      {confirmDelete && (
        <Dialog
          isOpen
          onClose={() => setConfirmDelete(null)}
          variant="destructive"
          title="Excluir pergunta?"
          description={`"${confirmDelete.texto}" e todas as suas opções serão excluídas permanentemente. Esta ação não pode ser desfeita.`}
          footer={
            <>
              <ESButton variant="ghost" onPress={() => setConfirmDelete(null)}>
                Cancelar
              </ESButton>
              <ESButton
                variant="destructive"
                onPress={async () => {
                  const alvo = confirmDelete
                  setConfirmDelete(null)
                  await deletePergunta(alvo.id)
                }}
              >
                Excluir
              </ESButton>
            </>
          }
        />
      )}

      {simuladorOpen && <SimuladorDialog fases={fases} onClose={() => setSimuladorOpen(false)} />}
    </div>
  )
}
