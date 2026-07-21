'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BackButton, ESButton, ESCard, ESSpinner, InfoNote, PageHeader, Tag } from '@/components/ui'
import { formatPhone, onlyDigits } from '@/features/admin/lib/format'
import { CONVITE_META } from './meta'
import { ProfissionalFormFields } from './profissional-form-fields'
import { ProfissionalNotFound } from './profissional-not-found'
import { profissionalSchema, type ProfissionalFormValues } from './schema'
import { useProfissionais } from './use-profissionais'

export function ProfissionalEditView({ id }: { id: string }) {
  const router = useRouter()
  const { items, loading, update } = useProfissionais()
  const existing = items.find((p) => p.id === id)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProfissionalFormValues>({
    resolver: zodResolver(profissionalSchema(items, id)),
    defaultValues: { nome: '', email: '', telefone: '', crp: '', abordagem: '' },
  })

  // A lista carrega de forma assíncrona; quando a profissional aparece, preenche
  // o formulário (o defaultValues não reage a mudança depois do mount).
  useEffect(() => {
    if (existing) {
      reset({
        nome: existing.nome,
        email: existing.email,
        telefone: formatPhone(existing.telefone),
        crp: existing.crp,
        abordagem: existing.abordagem,
      })
    }
  }, [existing, reset])

  if (loading) {
    return (
      <div>
        <BackButton href="/admin/profissionais" label="Voltar para profissionais" />
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex justify-center py-16">
            <ESSpinner size="md" label="Carregando…" />
          </div>
        </ESCard>
      </div>
    )
  }
  if (!existing) return <ProfissionalNotFound />

  const submit = handleSubmit(async (values) => {
    // ES-15: só navega em sucesso; em erro fica na tela com os dados intactos.
    const ok = await update(id, { ...values, telefone: onlyDigits(values.telefone) })
    if (ok) router.push(`/admin/profissionais/${id}`)
  })

  const cm = CONVITE_META[existing.convite]

  return (
    <div>
      <BackButton href={`/admin/profissionais/${id}`} label="Voltar" />
      <PageHeader
        breadcrumb={[
          { label: 'Profissionais', href: '/admin/profissionais' },
          { label: existing.nome, href: `/admin/profissionais/${id}` },
          { label: 'Editar' },
        ]}
        title="Editar profissional"
        description="Atualize os dados cadastrais e de identidade profissional."
      />

      <form onSubmit={submit} className="grid grid-cols-1 gap-5 md:grid-cols-[1.5fr_1fr] md:items-start">
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex flex-col gap-[18px] p-[26px]">
            <ProfissionalFormFields control={control} />
            <div className="mt-1 flex justify-end gap-2.5">
              <ESButton
                variant="ghost"
                onPress={() => router.push(`/admin/profissionais/${id}`)}
                isDisabled={isSubmitting}
              >
                Cancelar
              </ESButton>
              <ESButton type="submit" variant="primary" isLoading={isSubmitting}>
                Salvar alterações
              </ESButton>
            </div>
          </div>
        </ESCard>

        <div className="flex flex-col gap-4">
          <InfoNote>
            Alterar o e-mail muda a identidade de login da profissional. Foto e bio pública não são
            editadas aqui.
          </InfoNote>
          <ESCard variant="solid" isHoverable={false}>
            <div className="p-5">
              <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-mauve">
                Status atual
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Tag label={existing.ativa ? 'Ativa' : 'Inativa'} variant={existing.ativa ? 'primary' : 'muted'} size="sm" />
                <Tag label={cm.label} variant={cm.variant} size="sm" />
              </div>
            </div>
          </ESCard>
        </div>
      </form>
    </div>
  )
}
