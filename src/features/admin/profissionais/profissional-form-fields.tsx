'use client'

import type { Control } from 'react-hook-form'
import { BadgeIcon, MailIcon } from '@/components/ui'
import { RHFPhoneInput, RHFTextInput } from '@/features/admin/components/form-controls'
import type { ProfissionalFormValues } from './schema'

/**
 * Campos do formulário de profissional, compartilhados pelo modal de cadastro
 * e pela página de edição. Ligados ao react-hook-form via `control`.
 */
export function ProfissionalFormFields({ control }: { control: Control<ProfissionalFormValues> }) {
  return (
    <div className="flex flex-col gap-[18px]">
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RHFPhoneInput
          control={control}
          name="telefone"
          label="Telefone"
          isRequired
        />
        <RHFTextInput
          control={control}
          name="crp"
          label="CRP"
          placeholder="06/12345"
          startContent={<BadgeIcon size={16} />}
          isRequired
        />
      </div>
      <RHFTextInput
        control={control}
        name="abordagem"
        label="Abordagem"
        placeholder="Ex.: TCC, ACT, MBSR"
        isRequired
      />
    </div>
  )
}
