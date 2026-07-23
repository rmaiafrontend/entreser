'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ESButton, EmptyState, CheckIcon } from '@/components/ui'
import { mdToHtml } from '@/lib/markdown'
import { PageHero, PageContent, HeroIconButton, GlassCard, ReadingRow, ArrowLeftIcon } from '@/features/usuaria/ui'
import { FORMATO_LABEL, formatDuracao } from '@/features/usuaria/lib/content'
import { useConteudo } from './use-conteudo'
import { useRecentes } from './use-recentes'
import { conteudoResumoToVM } from './vm'

/* Ícones inline (não há clock/bookmark no kit). */
function ClockIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}
function BookmarkIcon({ size = 19 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  )
}

/** Estilos de prosa do card de leitura, fiéis ao handoff (serif nos títulos,
 *  parágrafos Onest 15/1.75, listas com marcadores mauve). */
const PROSE = cn(
  '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
  '[&_h2]:mb-2.5 [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:font-medium [&_h2]:leading-[1.2] [&_h2]:text-plum',
  '[&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-[19px] [&_h3]:font-medium [&_h3]:leading-[1.2] [&_h3]:text-plum',
  '[&_p]:mb-5 [&_p]:text-[15px] [&_p]:leading-[1.75] [&_p]:text-plum/[0.74]',
  '[&_strong]:font-semibold [&_strong]:text-plum',
  '[&_a]:text-mauve [&_a]:underline',
  '[&_ul]:mb-5 [&_ul]:mt-0 [&_ul]:flex [&_ul]:list-none [&_ul]:flex-col [&_ul]:gap-3 [&_ul]:p-0',
  '[&_li]:relative [&_li]:pl-5 [&_li]:text-[15px] [&_li]:leading-[1.55] [&_li]:text-plum',
  "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[9px] [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:bg-mauve [&_li]:before:content-['']",
  '[&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:border-mauve/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-plum/60',
)

/**
 * ConteudoReaderView (UF6) — leitor de conteúdo, redesenho do handoff (Artigo):
 * header ameixa (voltar + salvar, eyebrow formato·tag, título, resumo, tempo),
 * corpo do artigo em card de leitura com faixa de acento, "Continue lendo" e
 * barra fixa (salvar + marcar como concluído). Vídeo/áudio mantêm seus players.
 * Tela full-screen (a BottomNav some no leitor).
 */
export function ConteudoReaderView({ id }: { id: string }) {
  const router = useRouter()
  const { conteudo, loading, error, notFound, salvando, toggleConcluido, reload } = useConteudo(id)

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
  const eyebrow = conteudo.tagNome
    ? `${FORMATO_LABEL[conteudo.formato]} · ${conteudo.tagNome}`
    : FORMATO_LABEL[conteudo.formato]

  const topBar = (
    <div className="flex items-center justify-between">
      <HeroIconButton aria-label="Voltar" onPress={voltar}>
        <ArrowLeftIcon />
      </HeroIconButton>
      {/* Salvar (UF8) ainda dormente — botão presente, sem ação por ora. */}
      <HeroIconButton aria-label="Salvar" onPress={() => {}}>
        <BookmarkIcon />
      </HeroIconButton>
    </div>
  )

  return (
    <div className="min-h-dvh pb-28">
      <PageHero width="md" topBar={topBar} eyebrow={eyebrow} title={conteudo.titulo} description={conteudo.descricao || undefined}>
        {duracao && (
          <div className="mt-4 flex items-center gap-2 text-cream/55">
            <ClockIcon />
            <span className="text-[12.5px]">{duracao}</span>
          </div>
        )}
      </PageHero>

      <PageContent width="md" className="pt-6">
        {conteudo.formato === 'artigo' ? (
          // Sem card: o texto vai direto no fundo creme, ocupando a largura da coluna.
          <article className={cn('font-body', PROSE)} dangerouslySetInnerHTML={{ __html: mdToHtml(conteudo.corpo) }} />
        ) : conteudo.formato === 'video' ? (
          <GlassCard>
            <video controls playsInline poster={conteudo.thumb ?? undefined} src={conteudo.media ?? undefined} className="aspect-video w-full bg-black">
              Seu navegador não suporta vídeo.
            </video>
            {conteudo.descricao && <p className="px-5 py-4 text-sm leading-relaxed text-plum/70">{conteudo.descricao}</p>}
          </GlassCard>
        ) : (
          <AudioPlayer src={conteudo.media} titulo={conteudo.titulo} duracao={duracao} />
        )}

        <Relacionados excluirId={conteudo.id} />
      </PageContent>

      {/* Barra fixa de ação (UF6): salvar + marcar como concluído */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-plum/[0.06] bg-[rgba(255,253,250,0.9)] shadow-[0_-6px_24px_rgba(45,24,64,0.08)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-[11px] px-[18px] pb-[18px] pt-[14px]">
          <button
            type="button"
            aria-label="Salvar"
            className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border border-mauve/25 bg-white text-mauve transition-es hover:bg-mauve-ghost active:scale-[0.97]"
          >
            <BookmarkIcon />
          </button>
          <button
            type="button"
            onClick={toggleConcluido}
            disabled={salvando}
            className={cn(
              'flex h-[50px] flex-1 items-center justify-center gap-[9px] rounded-full text-[15px] font-semibold transition-es active:scale-[0.99] disabled:opacity-70',
              conteudo.consumido
                ? 'border border-mauve/30 bg-white text-mauve'
                : 'bg-mauve text-cream shadow-[0_8px_22px_rgba(122,74,92,0.32)]',
            )}
          >
            <CheckIcon size={18} />
            <span>{conteudo.consumido ? 'Concluído' : 'Marcar como concluído'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/** "Continue lendo" — relacionados (aproximados por recentes; handoff usa placeholders). */
function Relacionados({ excluirId }: { excluirId: string }) {
  const { itens, loading } = useRecentes(4)
  if (loading) return null
  const rel = itens.filter((c) => c.id !== excluirId).slice(0, 2)
  if (rel.length === 0) return null
  return (
    <section className="mt-6">
      <p className="text-eyebrow mb-[13px] px-0.5 text-mauve">Continue lendo</p>
      <div className="flex flex-col gap-[11px]">
        {rel.map((c) => (
          <ReadingRow key={c.id} item={conteudoResumoToVM(c)} eyebrow trailing="chevron" />
        ))}
      </div>
    </section>
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
      <PageContent width="md" className="space-y-3 pt-6">
        {[95, 100, 88, 92, 70].map((w, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-plum/8" style={{ width: `${w}%` }} />
        ))}
      </PageContent>
    </div>
  )
}
