'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ESButton, EmptyState } from '@/components/ui'
import { mdToHtml } from '@/lib/markdown'
import { PageHero, PageContent, HeroIconButton, GlassCard, ArrowLeftIcon, CheckCircleIcon } from '@/features/usuaria/ui'
import { FORMATO_LABEL, formatDuracao } from '@/features/usuaria/lib/content'
import { useConteudo } from './use-conteudo'

/**
 * ConteudoReaderView (UF6) — leitor de conteúdo. Artigo (Markdown), vídeo ou
 * áudio, com marcação binária de concluído numa barra fixa. Sem tracking de
 * tempo (fora do escopo do M05). Tela full-screen (a BottomNav some no leitor).
 *
 * Desktop: usa `PageHero`/`PageContent` (hero ameixa contido e coluna de leitura
 * centralizada), o mesmo tratamento das demais telas internas — no mobile segue
 * a faixa full-bleed.
 */
export function ConteudoReaderView({ id }: { id: string }) {
  const router = useRouter()
  const { conteudo, loading, error, notFound, salvando, toggleConcluido, reload } = useConteudo(id)

  // Volta no histórico quando há de onde voltar; cai no feed quando a tela foi
  // aberta por link direto / refresh (sem histórico do app) — evita o botão morto.
  const voltar = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back()
    else router.push('/feed')
  }

  const backBar = (
    <HeroIconButton aria-label="Voltar" onPress={voltar}>
      <ArrowLeftIcon />
    </HeroIconButton>
  )

  if (loading) return <ReaderSkeleton backBar={backBar} />

  if (notFound) {
    return (
      <ReaderMessage
        backBar={backBar}
        title="Conteúdo indisponível"
        description="Este conteúdo não está mais disponível ou foi despublicado."
        action={
          <ESButton variant="secondary" onPress={() => router.push('/feed')}>
            Voltar ao feed
          </ESButton>
        }
      />
    )
  }

  if (error || !conteudo) {
    return (
      <ReaderMessage
        backBar={backBar}
        title="Algo deu errado"
        description={error ?? 'Não foi possível carregar o conteúdo.'}
        action={<ESButton onPress={reload}>Tentar novamente</ESButton>}
      />
    )
  }

  const duracao = formatDuracao(conteudo.formato, conteudo.duracao)

  return (
    <div className="min-h-dvh pb-28">
      <PageHero
        width="md"
        topBar={backBar}
        eyebrow={FORMATO_LABEL[conteudo.formato]}
        title={conteudo.titulo}
        description={conteudo.descricao || undefined}
      >
        {duracao && <p className="mt-4 text-sm text-cream/50">{duracao}</p>}
      </PageHero>

      <PageContent width="md" className="pt-6">
        {conteudo.formato === 'artigo' ? (
          <GlassCard accent>
            <article
              className="px-6 py-5 font-body text-[15px]"
              dangerouslySetInnerHTML={{ __html: mdToHtml(conteudo.corpo) }}
            />
          </GlassCard>
        ) : conteudo.formato === 'video' ? (
          <GlassCard>
            <video
              controls
              playsInline
              poster={conteudo.thumb ?? undefined}
              src={conteudo.media ?? undefined}
              className="aspect-video w-full bg-black"
            >
              Seu navegador não suporta vídeo.
            </video>
            {conteudo.descricao && (
              <p className="px-5 py-4 text-sm leading-relaxed text-plum/70">{conteudo.descricao}</p>
            )}
          </GlassCard>
        ) : (
          <AudioPlayer src={conteudo.media} titulo={conteudo.titulo} duracao={duracao} />
        )}
      </PageContent>

      {/* Barra fixa de progresso (UF6) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/40 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <ESButton
            fullWidth
            variant={conteudo.consumido ? 'secondary' : 'primary'}
            isLoading={salvando}
            onPress={toggleConcluido}
            startContent={conteudo.consumido ? <CheckCircleIcon size={18} /> : undefined}
          >
            {conteudo.consumido ? 'Concluído' : 'Marcar como concluído'}
          </ESButton>
        </div>
      </div>
    </div>
  )
}

function AudioPlayer({ src, titulo, duracao }: { src: string | null; titulo: string; duracao?: string }) {
  return (
    <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-plum-soft to-mauve-ghost p-5 shadow-card">
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/25 blur-2xl" />
      <div className="relative z-10">
        <p className="text-eyebrow text-mauve">Áudio</p>
        <p className="mt-1 font-display text-lg leading-snug text-plum">{titulo}</p>
        {duracao && <p className="mt-0.5 text-xs text-plum/45">{duracao}</p>}
        <audio controls src={src ?? undefined} className="mt-4 w-full">
          Seu navegador não suporta áudio.
        </audio>
      </div>
    </div>
  )
}

function ReaderMessage({
  backBar,
  title,
  description,
  action,
}: {
  backBar: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="min-h-dvh">
      <PageHero width="md" topBar={backBar} />
      <PageContent width="md" className="pt-6">
        <EmptyState title={title} description={description} action={action} />
      </PageContent>
    </div>
  )
}

function ReaderSkeleton({ backBar }: { backBar: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <PageHero width="md" topBar={backBar}>
        <div className="mt-2 space-y-3">
          <div className="h-3.5 w-2/5 animate-pulse rounded bg-white/20" />
          <div className="h-7 w-4/5 animate-pulse rounded bg-white/20" />
        </div>
      </PageHero>
      <PageContent width="md" className="pt-6">
        <GlassCard>
          <div className="space-y-3 p-6">
            {[95, 100, 88, 92, 70].map((w, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-plum/8" style={{ width: `${w}%` }} />
            ))}
          </div>
        </GlassCard>
      </PageContent>
    </div>
  )
}
