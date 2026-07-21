'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ESButton, ESSkeleton } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/context/auth-context'
import { PageHero, PageContent, HeroBackButton, ErrorRetry, CheckCircleIcon, CircleIcon } from '../ui'
import { useMinhaFase } from './use-minha-fase'
import type { Fase } from './types'

/**
 * MinhaFaseView (UF7) — mostra a fase atual e permite trocar para qualquer fase
 * ativa. É também a "conta" da Usuária no M05: abriga o logout (não há tela de
 * Perfil neste módulo).
 */
export function MinhaFaseView() {
  const { data, loading, error, salvando, trocar, reload } = useMinhaFase()
  // Escolha explícita da usuária; sem pick, vale a fase atual (deriva, sem efeito).
  const [pick, setPick] = useState<string | null>(null)
  const { signOut } = useAuth()
  const router = useRouter()
  const [saindo, setSaindo] = useState(false)

  const atualId = data?.atual?.id ?? null
  const selecionada = pick ?? atualId

  async function handleLogout() {
    setSaindo(true)
    await signOut()
    router.replace('/login')
  }

  if (loading) return <FaseSkeleton />

  if (error || !data) {
    return (
      <div className="min-h-dvh">
        <PageHero topBar={<HeroBackButton />} topBarClassName="lg:hidden" eyebrow="Sua fase atual" title="Minha fase" />
        <PageContent className="pt-6">
          <ErrorRetry message={error ?? 'Não foi possível carregar sua fase.'} onRetry={reload} />
        </PageContent>
      </div>
    )
  }

  const { atual, disponiveis } = data
  const mudou = Boolean(selecionada && selecionada !== atualId)

  return (
    <div className="min-h-dvh">
      <PageHero
        topBar={<HeroBackButton />}
        topBarClassName="lg:hidden"
        eyebrow="Sua fase atual"
        title={atual?.nome ?? 'Sua fase'}
        description={atual?.descricao || 'Escolha a fase que melhor representa o seu momento agora.'}
      />

      <PageContent className="space-y-6 pb-10 pt-6">
        <section>
          <p className="text-eyebrow mb-3 text-mauve">Trocar de fase</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {disponiveis.map((f) => (
              <PhaseOption
                key={f.id}
                fase={f}
                selected={selecionada === f.id}
                current={atualId === f.id}
                onSelect={() => setPick(f.id)}
              />
            ))}
          </div>
        </section>

        <div className="lg:mx-auto lg:w-full lg:max-w-sm">
          <ESButton
            fullWidth
            isDisabled={!mudou}
            isLoading={salvando}
            onPress={() => selecionada && trocar(selecionada)}
          >
            {mudou ? 'Confirmar nova fase' : 'Esta é a sua fase atual'}
          </ESButton>
        </div>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleLogout}
            disabled={saindo}
            className="text-sm text-plum/50 transition-es hover:text-plum disabled:opacity-60"
          >
            {saindo ? 'Saindo…' : 'Sair da conta'}
          </button>
        </div>
      </PageContent>
    </div>
  )
}

function PhaseOption({
  fase,
  selected,
  current,
  onSelect,
}: {
  fase: Fase
  selected: boolean
  current: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-es',
        selected
          ? 'border-mauve/40 bg-mauve-ghost/60'
          : 'border-white/40 bg-white/60 backdrop-blur-sm hover:bg-white/80',
      )}
    >
      <span className={cn('mt-0.5 shrink-0', selected ? 'text-mauve' : 'text-plum/25')}>
        {selected ? <CheckCircleIcon size={22} /> : <CircleIcon size={22} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-medium text-plum">{fase.nome}</span>
          {current && (
            <span className="rounded-full bg-plum/8 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-plum/50">
              Atual
            </span>
          )}
        </span>
        {fase.descricao && <span className="mt-0.5 block text-xs leading-relaxed text-plum/50">{fase.descricao}</span>}
      </span>
    </button>
  )
}

function FaseSkeleton() {
  return (
    <div className="min-h-dvh">
      <PageHero topBar={<HeroBackButton />} topBarClassName="lg:hidden" eyebrow="Sua fase atual" title="Minha fase" />
      <PageContent className="pb-10 pt-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ESSkeleton key={i} variant="rectangular" height={72} className="rounded-2xl" />
          ))}
        </div>
      </PageContent>
    </div>
  )
}
