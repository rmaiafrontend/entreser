'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ESAvatar, ESButton, Dialog, LogoutIcon, MailIcon, LockIcon, EditIcon } from '@/components/ui'
import { useAuth } from '@/features/auth/context/auth-context'
import type { Plano, UsuariaStatus } from '@/features/auth/types'
import { PageHero, PageContent, GlassCard } from '../ui'

const PLANO_LABEL: Record<Plano, string> = {
  Gratuito: 'Plano Gratuito',
  Premium: 'Plano Premium',
}

const STATUS_LABEL: Record<UsuariaStatus, string> = {
  Ativa: 'Conta ativa',
  AguardandoConfirmacao: 'Aguardando confirmação',
  Inativa: 'Conta inativa',
  AguardandoDelecao: 'Exclusão agendada',
  Anonimizada: 'Conta anonimizada',
}

/**
 * ContaView — área "Minha conta" da Usuária (MVP: dados + sair). É a ÚNICA
 * superfície de logout no mobile (a BottomNav ganha a aba "Conta"); no desktop o
 * header também tem o menu de conta. Alterar senha / editar perfil aparecem como
 * "em breve" — o endpoint de senha já existe no M01, o de perfil depende do
 * backend. Como é a saída da conta, `/conta` é isento do OnboardingGate.
 */
export function ContaView() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [confirmando, setConfirmando] = useState(false)
  const [saindo, setSaindo] = useState(false)

  async function sair() {
    setSaindo(true)
    try {
      await signOut()
      router.replace('/login')
    } catch {
      // Falha ao sair (raro — signOut é local + best-effort no servidor): reabre.
      setSaindo(false)
      setConfirmando(false)
    }
  }

  const primeiro = user?.nome?.split(' ')[0]

  return (
    <div className="min-h-dvh">
      <PageHero width="md" eyebrow="Minha conta" title={primeiro ? `Olá, ${primeiro}` : 'Minha conta'} />

      <PageContent width="md" className="space-y-5 pb-10 pt-6">
        {/* Identidade */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <ESAvatar name={user?.nome} size="lg" isBordered />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl text-plum">{user?.nome ?? 'Você'}</p>
              {user?.email && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-plum/55">
                  <MailIcon size={15} />
                  <span className="truncate">{user.email}</span>
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {user?.plano && <Pill>{PLANO_LABEL[user.plano]}</Pill>}
                {user?.status && <Pill tone="muted">{STATUS_LABEL[user.status]}</Pill>}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Ações da conta — placeholders on-brand até os fluxos existirem */}
        <GlassCard className="overflow-hidden p-0">
          <SoonRow icon={<LockIcon />} title="Alterar senha" />
          <div className="border-t border-plum/5" />
          <SoonRow icon={<EditIcon />} title="Editar perfil" />
        </GlassCard>

        <button
          type="button"
          onClick={() => setConfirmando(true)}
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-mauve px-6 py-3.5 text-sm font-medium text-cream shadow-[0_12px_30px_-10px_rgba(122,74,92,0.55)] transition-es hover:brightness-[1.08] hover:shadow-[0_16px_36px_-10px_rgba(122,74,92,0.7)] active:scale-[0.99] [&>svg]:h-[18px] [&>svg]:w-[18px]"
        >
          <LogoutIcon />
          Sair da conta
        </button>
      </PageContent>

      <Dialog
        isOpen={confirmando}
        onClose={saindo ? undefined : () => setConfirmando(false)}
        title="Sair da conta?"
        description="Você precisará entrar de novo com seu e-mail e senha para voltar ao seu espaço."
        footer={
          <>
            <ESButton variant="ghost" onPress={() => setConfirmando(false)} isDisabled={saindo}>
              Cancelar
            </ESButton>
            <ESButton variant="primary" onPress={sair} isLoading={saindo}>
              Sair
            </ESButton>
          </>
        }
      />
    </div>
  )
}

function Pill({ children, tone = 'brand' }: { children: ReactNode; tone?: 'brand' | 'muted' }) {
  return (
    <span
      className={
        tone === 'brand'
          ? 'inline-flex items-center rounded-full bg-mauve-ghost px-3 py-1 text-xs font-medium text-mauve-dark'
          : 'inline-flex items-center rounded-full bg-plum/5 px-3 py-1 text-xs font-medium text-plum/55'
      }
    >
      {children}
    </span>
  )
}

function SoonRow({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 opacity-60">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-plum/5 text-plum/50 [&>svg]:h-[18px] [&>svg]:w-[18px]">
        {icon}
      </span>
      <span className="flex-1 text-sm text-plum/70">{title}</span>
      <span className="text-xs text-plum/35">Em breve</span>
    </div>
  )
}
