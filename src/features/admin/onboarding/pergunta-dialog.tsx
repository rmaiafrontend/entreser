'use client'

import { useState } from 'react'
import { Dialog, ESButton, InfoNote, TextInput, TextareaInput } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Pergunta, PerguntaInput } from './types'

interface PerguntaDialogProps {
  target: Pergunta | 'new'
  nextOrdem: number
  onClose: () => void
  onSubmit: (data: PerguntaInput) => Promise<void>
}

export function PerguntaDialog({ target, nextOrdem, onClose, onSubmit }: PerguntaDialogProps) {
  const editing = target !== 'new'
  const [texto, setTexto] = useState(target !== 'new' ? target.texto : '')
  const [ordem, setOrdem] = useState(String(target !== 'new' ? target.ordem : nextOrdem))
  // Pergunta nova nasce inativa (ES-020) — sem opções, não há o que ativar. O
  // seletor de Situação só aparece na edição; oferecê-lo na criação prometia uma
  // escolha que o `addPergunta` descartava.
  const [ativa, setAtiva] = useState(target !== 'new' ? target.ativa : false)
  const [errors, setErrors] = useState<{ texto?: string; ordem?: string }>({})
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    const e: { texto?: string; ordem?: string } = {}
    if (!texto.trim()) e.texto = 'Informe o texto da pergunta.'
    else if (texto.trim().length > 500) e.texto = 'Máximo de 500 caracteres.'
    if (!/^\d+$/.test(ordem.trim()) || parseInt(ordem, 10) <= 0) e.ordem = 'Ordem deve ser um inteiro positivo.'
    setErrors(e)
    if (Object.keys(e).length) return
    setSaving(true)
    await onSubmit({ texto: texto.trim(), ordem: parseInt(ordem, 10), ativa })
    setSaving(false)
    onClose()
  }

  return (
    <Dialog
      isOpen
      onClose={() => !saving && onClose()}
      width={540}
      title={editing ? 'Editar pergunta' : 'Nova pergunta'}
      description={editing ? 'Atualize o texto, a ordem e a situação.' : 'Cadastre uma pergunta do questionário de onboarding.'}
      footer={
        <>
          <ESButton variant="ghost" onPress={onClose} isDisabled={saving}>
            Cancelar
          </ESButton>
          <ESButton variant="primary" isLoading={saving} onPress={submit}>
            {editing ? 'Salvar' : 'Criar pergunta'}
          </ESButton>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <TextareaInput
          label="Texto da pergunta"
          placeholder="Ex.: Em que momento do tratamento você está?"
          value={texto}
          onChange={(v) => { setTexto(v); setErrors((e) => ({ ...e, texto: undefined })) }}
          errorMessage={errors.texto}
          minRows={2}
          isRequired
        />
        <div className="grid grid-cols-[120px_1fr] items-start gap-4">
          <TextInput
            label="Ordem"
            placeholder="1"
            value={ordem}
            onChange={(v) => { setOrdem(v); setErrors((e) => ({ ...e, ordem: undefined })) }}
            errorMessage={errors.ordem}
            isRequired
          />
          {editing && (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-plum/70">Situação</span>
              <div className="flex gap-2">
                <Chip active={ativa} label="Ativa" onClick={() => setAtiva(true)} />
                <Chip active={!ativa} label="Inativa" onClick={() => setAtiva(false)} />
              </div>
            </div>
          )}
        </div>
        {!editing && (
          <InfoNote>
            A pergunta nasce <strong>inativa</strong>. Ela só pode ir ao ar depois de ter ao menos
            2 opções, todas mapeadas para alguma fase — você ativa pelo card, na listagem.
          </InfoNote>
        )}
      </div>
    </Dialog>
  )
}

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
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
