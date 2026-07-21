'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, ESButton, InfoNote } from '@/components/ui'
import { onlyDigits } from '@/features/admin/lib/format'
import { ProfissionalFormFields } from './profissional-form-fields'
import { profissionalSchema, type ProfissionalFormValues } from './schema'
import type { Profissional, ProfissionalInput } from './types'

interface ProfissionalAddDialogProps {
  /** Lista atual (para validar unicidade de e-mail/CRP). */
  existing: Profissional[]
  onClose: () => void
  onSubmit: (input: ProfissionalInput) => Promise<void>
}

/**
 * Modal de cadastro de profissional. Montado sob demanda (remonta a cada
 * abertura, capturando a lista atual para a validação de duplicidade).
 */
export function ProfissionalAddDialog({ existing, onClose, onSubmit }: ProfissionalAddDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProfissionalFormValues>({
    resolver: zodResolver(profissionalSchema(existing)),
    defaultValues: { nome: '', email: '', telefone: '', crp: '', abordagem: '' },
  })

  const submit = handleSubmit(async (values) => {
    await onSubmit({ ...values, telefone: onlyDigits(values.telefone) })
    onClose()
  })

  return (
    <Dialog
      isOpen
      onClose={() => !isSubmitting && onClose()}
      width={560}
      title="Adicionar profissional"
      description="Cadastre a profissional e envie o convite de primeiro acesso."
      footer={
        <>
          <ESButton variant="ghost" onPress={onClose} isDisabled={isSubmitting}>
            Cancelar
          </ESButton>
          <ESButton variant="primary" isLoading={isSubmitting} onPress={submit}>
            Salvar e enviar convite
          </ESButton>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <ProfissionalFormFields control={control} />
        <InfoNote>
          Ao salvar, enviamos um convite por e-mail e a profissional define a própria senha no
          primeiro acesso. Você não define a senha dela.
        </InfoNote>
      </form>
    </Dialog>
  )
}
