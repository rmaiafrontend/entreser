'use client'

import { useState } from 'react'
import { Dialog, ESButton, TextInput, TextareaInput } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { TagItem } from '@/features/admin/tags/types'
import type { Fase, FaseInput } from './types'

interface PhaseFormDialogProps {
  /** Fase em edição ou 'new' para criar. */
  target: Fase | 'new'
  tags: TagItem[]
  /** Ordem sugerida ao criar (fim da lista). */
  nextOrdem: number
  onClose: () => void
  onSubmit: (data: FaseInput) => Promise<void>
}

interface FormState {
  nome: string
  descricao: string
  ordem: string
  ativa: boolean
  tags: string[]
}

export function PhaseFormDialog({ target, tags, nextOrdem, onClose, onSubmit }: PhaseFormDialogProps) {
  const editing = target !== 'new'

  const [form, setForm] = useState<FormState>(() =>
    target !== 'new'
      ? {
          nome: target.nome,
          descricao: target.descricao,
          ordem: String(target.ordem),
          ativa: target.ativa,
          tags: [...target.tags],
        }
      : { nome: '', descricao: '', ordem: String(nextOrdem), ativa: true, tags: [] },
  )
  const [errors, setErrors] = useState<{ nome?: string; ordem?: string }>({})
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const toggleTag = (id: string) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(id) ? f.tags.filter((x) => x !== id) : [...f.tags, id],
    }))

  const submit = async () => {
    const e: { nome?: string; ordem?: string } = {}
    if (!form.nome.trim()) e.nome = 'Informe o nome da fase.'
    else if (form.nome.trim().length > 100) e.nome = 'Máximo de 100 caracteres.'
    if (!/^\d+$/.test(form.ordem.trim())) e.ordem = 'A ordem deve ser um número inteiro.'
    setErrors(e)
    if (Object.keys(e).length) return

    setSaving(true)
    await onSubmit({
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      ordem: parseInt(form.ordem, 10),
      ativa: form.ativa,
      tags: form.tags,
    })
    setSaving(false)
    onClose()
  }

  return (
    <Dialog
      isOpen
      onClose={() => !saving && onClose()}
      width={580}
      title={editing ? 'Editar fase' : 'Nova fase'}
      description={
        editing ? 'Atualize os dados da fase.' : 'Cadastre uma nova fase já atrelando suas tags.'
      }
      footer={
        <>
          <ESButton variant="ghost" onPress={onClose} isDisabled={saving}>
            Cancelar
          </ESButton>
          <ESButton variant="primary" isLoading={saving} onPress={submit}>
            {editing ? 'Salvar alterações' : 'Criar fase'}
          </ESButton>
        </>
      }
    >
      <div className="flex max-h-[58vh] flex-col gap-4 overflow-y-auto pr-1">
        <TextInput
          label="Nome"
          placeholder="Ex.: Estimulação"
          value={form.nome}
          onChange={(v) => { set('nome', v); setErrors((e) => ({ ...e, nome: undefined })) }}
          errorMessage={errors.nome}
          isRequired
        />
        <TextareaInput
          label="Descrição"
          placeholder="Descreva este momento do ciclo…"
          value={form.descricao}
          onChange={(v) => set('descricao', v)}
          minRows={3}
        />

        <div className="grid grid-cols-[120px_1fr] items-start gap-4">
          <TextInput
            label="Ordem"
            placeholder="1"
            value={form.ordem}
            onChange={(v) => { set('ordem', v); setErrors((e) => ({ ...e, ordem: undefined })) }}
            errorMessage={errors.ordem}
            isRequired
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-plum/70">Situação</span>
            <div className="flex gap-2">
              <ToggleChip active={form.ativa} label="Ativa" onClick={() => set('ativa', true)} />
              <ToggleChip active={!form.ativa} label="Inativa" onClick={() => set('ativa', false)} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-plum/70">Tags atreladas</span>
            <span
              className={cn(
                'text-[12.5px] font-medium',
                form.tags.length ? 'text-mauve' : 'text-plum/40',
              )}
            >
              {form.tags.length === 0
                ? 'nenhuma atrelada'
                : `${form.tags.length} ${form.tags.length === 1 ? 'atrelada' : 'atreladas'}`}
            </span>
          </div>
          {tags.length === 0 ? (
            <div className="rounded-xl bg-cream px-3.5 py-3 text-[13px] text-plum/50">
              Nenhuma tag cadastrada ainda. Crie tags em <strong>Conteúdo › Tags</strong> antes de
              atrelá-las.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => {
                  const on = form.tags.includes(t.id)
                  return (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleTag(t.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                        on
                          ? 'border border-transparent bg-mauve text-white'
                          : 'border border-dashed border-plum/25 bg-transparent text-plum/50 hover:border-mauve/50 hover:bg-mauve-ghost hover:text-plum',
                      )}
                    >
                      <span className={cn('leading-none', on ? 'text-white' : 'text-plum/35')}>
                        {on ? '✓' : '+'}
                      </span>
                      {t.nome}
                    </button>
                  )
                })}
              </div>
              <span className="text-[12.5px] text-plum/45">
                Clique para atrelar ou remover. As tags atreladas priorizam os conteúdos desta fase no
                feed.
              </span>
            </>
          )}
        </div>
      </div>
    </Dialog>
  )
}

function ToggleChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-pill px-4 py-2 text-sm font-medium transition-colors',
        active ? 'border border-transparent bg-plum text-white' : 'border border-plum/15 text-plum/60',
      )}
    >
      {label}
    </button>
  )
}
