'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ESAvatar, ESProgressBar, ESSkeleton, ConteudosIcon, TrilhasIcon } from '@/components/ui'
import { useAuth } from '@/features/auth/context/auth-context'
import { PlumHero, GlassCard, ContentCard, ChevronRightIcon } from '../ui'
import { useMinhaFase } from '../fase/use-minha-fase'
import { useFeed } from '../feed/use-feed'
import { useTrilhas } from '../trilhas/use-trilhas'
import { feedItemToVM } from '../feed/vm'

/**
 * HomeView — landing do app da Usuária. Responsiva: no mobile é uma coluna única
 * (card de fase sobreposto ao hero, vitrine em carrossel); no desktop usa a
 * largura — banda superior com fase + atalhos lado a lado e vitrine em grade.
 * Escopada ao M05 (sem links para módulos ainda não construídos).
 */
export function HomeView() {
  const { user } = useAuth()
  const primeiro = user?.nome?.split(' ')[0]

  const { data: minhaFase, loading: faseLoading } = useMinhaFase()
  const { itens, loading: feedLoading } = useFeed({ tamanho: 6 })
  const { trilhas } = useTrilhas()

  const fase = minhaFase?.atual
  const emAndamento = trilhas.find((t) => t.progresso > 0 && t.progresso < 100)
  const destaque = itens.slice(0, 6)

  return (
    <div className="min-h-dvh overflow-x-hidden">
      {/* Hero: full-bleed no mobile; no desktop vira um card ameixa contido e
          arredondado, com margem no topo — flutua como a sidebar e alinha à
          largura do conteúdo (mesmo px), em vez de sangrar de ponta a ponta. */}
      <div className="lg:mx-auto lg:max-w-5xl lg:px-6 lg:pt-6">
        <PlumHero wide elevated className="pb-20 lg:rounded-card lg:pb-8">
          <div className="flex items-center gap-4">
            <ESAvatar name={user?.nome} size="lg" isBordered />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-cream/60">Bem-vinda de volta</p>
              <h1 className="truncate font-display text-2xl font-light text-cream lg:text-3xl">
                Olá{primeiro ? `, ${primeiro}` : ''}!
              </h1>
            </div>
          </div>
        </PlumHero>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        {/* Card da fase — sobreposto ao hero no mobile; com respiro no desktop */}
        <div className="relative z-20 -mt-10 lg:mt-6">
          {faseLoading ? (
            <ESSkeleton variant="rectangular" height={112} className="rounded-card" />
          ) : (
            <Link href="/fase" className="block">
              <GlassCard className="p-5 transition-es hover:shadow-card-hover">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-mauve to-mauve-dark text-white">
                      <FaseGlyph />
                    </span>
                    <div className="min-w-0">
                      <p className="text-eyebrow text-mauve">Sua fase atual</p>
                      <p className="truncate font-display text-lg text-plum">
                        {fase?.nome ?? 'Definir minha fase'}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-plum/30">
                    <ChevronRightIcon size={20} />
                  </span>
                </div>
                {fase?.descricao && (
                  <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-plum/60">{fase.descricao}</p>
                )}
              </GlassCard>
            </Link>
          )}
        </div>

        {/* Atalhos — só no mobile; no desktop a sidebar cobre a navegação */}
        <div className="grid grid-cols-2 gap-3 pt-4 lg:hidden">
          <QuickTile href="/feed" label="Explorar conteúdos" icon={<ConteudosIcon />} />
          <QuickTile href="/trilhas" label="Ver trilhas" icon={<TrilhasIcon />} />
        </div>

        <div className="space-y-8 py-8">
          {/* Continue de onde parou */}
          {emAndamento && (
            <section>
              <SectionHead title="Continue de onde parou" actionHref="/trilhas" actionLabel="Ver todas" />
              <Link href={`/trilhas/${emAndamento.id}`} className="block">
                <GlassCard className="mt-3 p-4 transition-es hover:shadow-card-hover">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-plum-soft text-mauve">
                      <TrilhasIcon size={22} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-plum">{emAndamento.titulo}</p>
                      <div className="mt-2 max-w-md">
                        <ESProgressBar value={emAndamento.progresso} showValueLabel size="sm" />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </section>
          )}

          {/* Conteúdo para você (vitrine) */}
          <section>
            <SectionHead
              title="Conteúdo para você"
              description={fase ? `Selecionado para a fase ${fase.nome}` : undefined}
              actionHref="/feed"
              actionLabel="Ver tudo"
            />
            {feedLoading ? (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <ESSkeleton key={i} variant="rectangular" height={190} className="rounded-card" />
                ))}
              </div>
            ) : destaque.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-white/40 bg-white/50 px-4 py-8 text-center text-sm text-plum/45 backdrop-blur-sm">
                Conteúdos para a sua fase aparecem aqui em breve.
              </p>
            ) : (
              <div
                className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible lg:grid-cols-3"
                style={{ scrollbarWidth: 'none' }}
              >
                {destaque.map((item) => (
                  <div key={item.id} className="w-[80%] shrink-0 snap-start sm:w-auto">
                    <ContentCard item={feedItemToVM(item)} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Frase de acolhimento */}
          <section>
            <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-plum via-plum-mid to-mauve-dark p-6 lg:p-8">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
              <div className="relative z-10 mx-auto max-w-2xl text-center">
                <p className="font-display text-xl font-medium italic leading-relaxed text-cream/90 lg:text-2xl">
                  &ldquo;Cada tentativa é um ato de coragem. Você não está sozinha nessa jornada.&rdquo;
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function QuickTile({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-2xl border border-white/40 bg-white/70 p-4 backdrop-blur-sm transition-es hover:scale-[1.02] hover:bg-white/90 active:scale-[0.98]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mauve-ghost text-mauve">{icon}</span>
      <span className="text-sm font-medium text-plum">{label}</span>
    </Link>
  )
}

function SectionHead({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="text-eyebrow text-mauve">{title}</p>
        {description && <p className="mt-1 text-xs text-plum/45">{description}</p>}
      </div>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="shrink-0 text-sm text-mauve transition-es hover:text-mauve-dark">
          {actionLabel} →
        </Link>
      )}
    </div>
  )
}

function FaseGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}
