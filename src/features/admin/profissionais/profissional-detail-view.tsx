'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  BackButton,
  BanIcon,
  CheckIcon,
  ESAvatar,
  ESButton,
  ESCard,
  ESSpinner,
  EditIcon,
  PageHeader,
  ResendIcon,
} from '@/components/ui'
import { formatDateBR, formatPhone } from '@/features/admin/lib/format'
import { StatusTags } from './meta'
import { ProfissionalDeactivateDialog } from './profissional-deactivate-dialog'
import { ProfissionalNotFound } from './profissional-not-found'
import { useProfissionais } from './use-profissionais'

export function ProfissionalDetailView({ id }: { id: string }) {
  const router = useRouter()
  const { items, loading, deactivate, reactivate, resendInvite } = useProfissionais()
  const [deactivateOpen, setDeactivateOpen] = useState(false)

  const p = items.find((x) => x.id === id)
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
  if (!p) return <ProfissionalNotFound />

  const needResend = p.convite === 'pendente' || p.convite === 'expirado'

  return (
    <div>
      <BackButton href="/admin/profissionais" label="Voltar para profissionais" />
      <PageHeader
        breadcrumb={[{ label: 'Profissionais', href: '/admin/profissionais' }, { label: p.nome }]}
        title={p.nome}
        action={
          <div className="flex flex-wrap gap-2.5">
            {needResend && (
              <ESButton variant="secondary" startContent={<ResendIcon size={16} />} onPress={() => resendInvite(p)}>
                Reenviar convite
              </ESButton>
            )}
            <ESButton
              variant="secondary"
              startContent={<EditIcon size={16} />}
              onPress={() => router.push(`/admin/profissionais/${p.id}/editar`)}
            >
              Editar
            </ESButton>
            {p.ativa ? (
              <ESButton variant="destructive" startContent={<BanIcon size={16} />} onPress={() => setDeactivateOpen(true)}>
                Desativar
              </ESButton>
            ) : (
              <ESButton variant="secondary" startContent={<CheckIcon size={16} />} onPress={() => reactivate(p)}>
                Reativar
              </ESButton>
            )}
          </div>
        }
      />

      <div className="mb-5">
        <StatusTags p={p} size="md" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.6fr_1fr]">
        <ESCard variant="solid" isHoverable={false}>
          <div className="p-[26px]">
            <div className="mb-6 flex items-center gap-4">
              <ESAvatar name={p.nome} size="lg" isBordered />
              <div>
                <div className="font-display text-[22px] text-plum">{p.nome}</div>
                <div className="text-[13.5px] text-plum/55">{p.abordagem}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="E-mail">{p.email}</Field>
              <Field label="Telefone">{formatPhone(p.telefone)}</Field>
              <Field label="CRP">{p.crp}</Field>
              <Field label="Abordagem">{p.abordagem}</Field>
            </div>
            <div className="my-6 h-px bg-plum/7" />
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-mauve">
              Conteúdo público (somente leitura)
            </div>
            <p
              className={
                p.bio
                  ? 'text-sm leading-relaxed text-plum/75'
                  : 'text-sm italic leading-relaxed text-plum/40'
              }
            >
              {p.bio || 'A profissional ainda não preencheu a bio pública.'}
            </p>
            <p className="mt-2 text-xs text-plum/45">
              Bio e foto são geridas pela própria profissional — não editáveis aqui.
            </p>
          </div>
        </ESCard>

        <ESCard variant="solid" isHoverable={false}>
          <div className="flex flex-col gap-4 p-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-mauve">
              Convite &amp; auditoria
            </div>
            {needResend && p.conviteExpiraEm && (
              <Field label={p.convite === 'expirado' ? 'Convite expirou em' : 'Convite expira em'}>
                {formatDateBR(p.conviteExpiraEm)}
              </Field>
            )}
            <Field label="Cadastrada em">{formatDateBR(p.criadaEm)}</Field>
            <Field label="Cadastrada por">{p.criadaPor || '—'}</Field>
          </div>
        </ESCard>
      </div>

      <ProfissionalDeactivateDialog
        target={deactivateOpen ? p : null}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={async (target) => {
          await deactivate(target)
          setDeactivateOpen(false)
        }}
      />
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-mauve">{label}</div>
      <div className="text-[14.5px] text-plum">{children}</div>
    </div>
  )
}
