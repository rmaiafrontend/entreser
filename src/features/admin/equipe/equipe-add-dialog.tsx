'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, ESButton, InfoNote, MailIcon } from '@/components/ui'
import { RHFTextInput } from '@/features/admin/components/form-controls'
import { equipeSchema, type EquipeFormValues } from './schema'
import type { EquipeInput } from './types'

interface EquipeAddDialogProps {
  existingEmails: string[]
  onClose: () => void
  /** `false` mantém o modal aberto (ex.: 409 do servidor), preservando o que foi digitado. */
  onSubmit: (input: EquipeInput) => Promise<boolean>
}

/** Modal de cadastro de membro da equipe (Admin Geral). */
export function EquipeAddDialog({ existingEmails, onClose, onSubmit }: EquipeAddDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EquipeFormValues>({
    resolver: zodResolver(equipeSchema(existingEmails)),
    defaultValues: { nome: '', email: '' },
  })

  const submit = handleSubmit(async (values) => {
    if (await onSubmit(values)) onClose()
  })

  return (
    <Dialog
      isOpen
      onClose={() => !isSubmitting && onClose()}
      width={520}
      title="Adicionar membro da equipe"
      description="Cadastre uma nova Admin Geral. Ela recebe uma senha temporária por e-mail."
      footer={
        <>
          <ESButton variant="ghost" onPress={onClose} isDisabled={isSubmitting}>
            Cancelar
          </ESButton>
          <ESButton variant="primary" isLoading={isSubmitting} onPress={submit}>
            Adicionar membro
          </ESButton>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <RHFTextInput
          control={control}
          name="nome"
          label="Nome completo"
          placeholder="Ex.: Maria da Silva"
          isRequired
        />
        <RHFTextInput
          control={control}
          name="email"
          type="email"
          label="E-mail"
          placeholder="nome@entreser.com.br"
          startContent={<MailIcon size={16} />}
          isRequired
        />
        <InfoNote>
          Ao salvar, geramos uma <strong>senha temporária</strong> e a enviamos por e-mail ao novo
          membro, que deverá trocá-la no primeiro login. A senha nunca é exibida aqui.
        </InfoNote>
      </form>
    </Dialog>
  )
}
