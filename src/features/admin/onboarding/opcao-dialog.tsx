'use client'

import { useState } from 'react'
import { Dialog, ESButton, TextInput } from '@/components/ui'
import type { Opcao, OpcaoInput } from './types'

interface OpcaoDialogProps {
  target: Opcao | 'new'
  nextOrdem: number
  onClose: () => void
  onSubmit: (data: OpcaoInput) => Promise<void>
}

export function OpcaoDialog({ target, nextOrdem, onClose, onSubmit }: OpcaoDialogProps) {
  const editing = target !== 'new'
  const [texto, setTexto] = useState(target !== 'new' ? target.texto : '')
  const [ordem, setOrdem] = useState(String(target !== 'new' ? target.ordem : nextOrdem))
  const [errors, setErrors] = useState<{ texto?: string; ordem?: string }>({})
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    const e: { texto?: string; ordem?: string } = {}
    if (!texto.trim()) e.texto = 'Informe o texto da opção.'
    else if (texto.trim().length > 200) e.texto = 'Máximo de 200 caracteres.'
    if (!/^\d+$/.test(ordem.trim()) || parseInt(ordem, 10) <= 0) e.ordem = 'Ordem inválida.'
    setErrors(e)
    if (Object.keys(e).length) return
    setSaving(true)
    await onSubmit({ texto: texto.trim(), ordem: parseInt(ordem, 10) })
    setSaving(false)
    onClose()
  }

  return (
    <Dialog
      isOpen
      onClose={() => !saving && onClose()}
      width={500}
      title={editing ? 'Editar opção' : 'Adicionar opção'}
      description="Uma resposta possível para esta pergunta."
      footer={
        <>
          <ESButton variant="ghost" onPress={onClose} isDisabled={saving}>
            Cancelar
          </ESButton>
          <ESButton variant="primary" isLoading={saving} onPress={submit}>
            {editing ? 'Salvar' : 'Adicionar'}
          </ESButton>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <TextInput
          label="Texto da opção"
          placeholder="Ex.: Fazendo estimulação ovariana"
          value={texto}
          onChange={(v) => { setTexto(v); setErrors((e) => ({ ...e, texto: undefined })) }}
          errorMessage={errors.texto}
          isRequired
        />
        <div className="w-[120px]">
          <TextInput
            label="Ordem"
            placeholder="1"
            value={ordem}
            onChange={(v) => { setOrdem(v); setErrors((e) => ({ ...e, ordem: undefined })) }}
            errorMessage={errors.ordem}
            isRequired
          />
        </div>
      </div>
    </Dialog>
  )
}
