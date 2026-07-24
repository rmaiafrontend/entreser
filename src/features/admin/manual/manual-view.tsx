'use client'

import { useEffect, useState } from 'react'
import { AlertIcon, ChevronLeftIcon, ChevronRightIcon, PageHeader, Tag } from '@/components/ui'
import { cn } from '@/lib/utils'
import { MANUAL } from './manual-data'
import type { ManualSecao } from './types'

/**
 * Grupos do índice — espelham o menu do backoffice, para a pessoa reconhecer
 * onde cada assunto vive no painel.
 */
const GRUPOS: { titulo: string; slugs: string[] }[] = [
  { titulo: 'Começar', slugs: ['visao-geral', 'o-painel'] },
  { titulo: 'Conteúdo', slugs: ['tags', 'fases', 'conteudos', 'trilhas', 'onboarding'] },
  { titulo: 'Pessoas', slugs: ['profissionais', 'equipe', 'usuarias'] },
  { titulo: 'Análise', slugs: ['metricas'] },
  { titulo: 'Sua conta', slugs: ['conta-acesso'] },
]

const porSlug = (slug: string) => MANUAL.find((s) => s.slug === slug)
const grupoDe = (slug: string) => GRUPOS.find((g) => g.slugs.includes(slug))?.titulo ?? 'Manual'

/** Medida de leitura confortável para blocos de texto corrido. */
const PROSA = 'max-w-[68ch] text-[15px] leading-[1.75] text-plum/75'

/**
 * ManualView — manual da plataforma no formato de documentação: índice fixo à
 * esquerda e UMA seção por vez à direita (sem rolar a página inteira). O slug
 * ativo vai para o `#hash`, então dá para mandar o link de uma seção específica.
 */
export function ManualView() {
  const [ativo, setAtivo] = useState(() => MANUAL[0]?.slug ?? '')

  // Deep link: aplica o #hash na entrada e responde ao voltar/avançar do
  // navegador. O disparo inicial é adiado para fora do corpo do efeito.
  useEffect(() => {
    const aplicar = () => {
      const slug = window.location.hash.replace('#', '')
      if (slug && MANUAL.some((s) => s.slug === slug)) setAtivo(slug)
    }
    const id = window.setTimeout(aplicar, 0)
    window.addEventListener('hashchange', aplicar)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('hashchange', aplicar)
    }
  }, [])

  const secao = porSlug(ativo) ?? MANUAL[0]
  const indice = MANUAL.findIndex((s) => s.slug === secao?.slug)
  const anterior = indice > 0 ? MANUAL[indice - 1] : null
  const proxima = indice >= 0 && indice < MANUAL.length - 1 ? MANUAL[indice + 1] : null

  function abrir(slug: string) {
    setAtivo(slug)
    window.history.replaceState(null, '', `#${slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!secao) return null

  return (
    <div>
      <PageHeader
        eyebrow="Ajuda"
        title="Manual da plataforma"
        description="Como configurar e operar o Entre Ser — do zero até o conteúdo publicado para as usuárias."
      />

      <div className="grid gap-6 lg:grid-cols-[236px_minmax(0,1fr)] lg:gap-10">
        <IndiceMobile ativo={secao.slug} onAbrir={abrir} />
        <IndiceDesktop ativo={secao.slug} onAbrir={abrir} />

        <div className="min-w-0">
          <Secao secao={secao} posicao={indice + 1} total={MANUAL.length} />
          <Paginacao anterior={anterior} proxima={proxima} onAbrir={abrir} />
        </div>
      </div>
    </div>
  )
}

function IndiceDesktop({ ativo, onAbrir }: { ativo: string; onAbrir: (slug: string) => void }) {
  return (
    <nav aria-label="Índice do manual" className="hidden lg:block lg:sticky lg:top-6 lg:self-start">
      <div className="space-y-6 rounded-[18px] border border-plum/8 bg-white p-4 shadow-card">
        {GRUPOS.map((g) => {
          const itens = g.slugs.map(porSlug).filter(Boolean) as ManualSecao[]
          if (itens.length === 0) return null
          return (
            <div key={g.titulo}>
              <p className="mb-2 pl-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-plum/35">
                {g.titulo}
              </p>
              <ul>
                {itens.map((s) => {
                  const on = s.slug === ativo
                  return (
                    <li key={s.slug}>
                      <button
                        type="button"
                        onClick={() => onAbrir(s.slug)}
                        aria-current={on ? 'page' : undefined}
                        className={cn(
                          'relative w-full py-1.5 pl-3 pr-2 text-left text-[13.5px] transition-colors',
                          on ? 'font-semibold text-mauve-dark' : 'text-plum/60 hover:text-plum',
                        )}
                      >
                        {/* Barra de acento do item ativo, sobre a régua do grupo */}
                        <span
                          aria-hidden
                          className={cn(
                            'absolute -left-px top-1 bottom-1 w-[2px] rounded-full transition-colors',
                            on ? 'bg-mauve' : 'bg-transparent',
                          )}
                        />
                        {s.titulo}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </nav>
  )
}

function IndiceMobile({ ativo, onAbrir }: { ativo: string; onAbrir: (slug: string) => void }) {
  return (
    <div
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden"
      style={{ scrollbarWidth: 'none' }}
      role="tablist"
      aria-label="Índice do manual"
    >
      {MANUAL.map((s) => (
        <button
          key={s.slug}
          type="button"
          role="tab"
          aria-selected={s.slug === ativo}
          onClick={() => onAbrir(s.slug)}
          className={cn(
            'shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] transition-colors',
            s.slug === ativo
              ? 'bg-plum font-medium text-cream'
              : 'border border-plum/10 bg-white text-plum/65 hover:text-plum',
          )}
        >
          {s.titulo}
        </button>
      ))}
    </div>
  )
}

function Secao({ secao, posicao, total }: { secao: ManualSecao; posicao: number; total: number }) {
  const { slug, titulo, resumo, paraQueServe, passos, campos, relacoes, atencao } = secao
  return (
    <article className="rounded-[18px] border border-plum/8 bg-white p-6 shadow-card lg:p-9">
      {/* Cabeçalho da seção — direto na página, sem card, para dar ar de documentação */}
      <header>
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
          <span className="text-mauve">{grupoDe(slug)}</span>
          <span aria-hidden className="text-plum/20">
            ·
          </span>
          <span className="text-plum/35">
            {posicao} de {total}
          </span>
        </div>
        <h2 className="mt-2 font-display text-[32px] font-light leading-[1.15] text-plum">{titulo}</h2>
        <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.65] text-plum/60">{resumo}</p>
      </header>

      <div className="mt-9 space-y-9">
        <Bloco titulo="Para que serve">
          <p className={PROSA}>{paraQueServe}</p>
        </Bloco>

        {passos.length > 0 && (
          <Bloco titulo="Passo a passo">
            <ol className="max-w-[68ch]">
              {passos.map((p, i) => {
                const ultimo = i === passos.length - 1
                return (
                  <li key={p.titulo} className="flex gap-4">
                    {/* Trilho numerado — dá a sensação de sequência */}
                    <div className="flex shrink-0 flex-col items-center">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mauve/10 text-[12px] font-semibold text-mauve">
                        {i + 1}
                      </span>
                      {!ultimo && <span aria-hidden className="mt-1 w-px flex-1 bg-plum/10" />}
                    </div>
                    <div className={cn('min-w-0', ultimo ? 'pb-0' : 'pb-5')}>
                      <p className="text-[15px] font-semibold text-plum">{p.titulo}</p>
                      <p className="mt-1 text-[14.5px] leading-[1.7] text-plum/65">{p.descricao}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </Bloco>
        )}

        {campos.length > 0 && (
          <Bloco titulo="Campos e regras">
            <div className="overflow-hidden rounded-[14px] border border-plum/10 bg-canvas/50">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left">
                  <thead>
                    <tr className="bg-plum/[0.03]">
                      <th className="px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-plum/40">
                        Campo
                      </th>
                      <th className="px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-plum/40">
                        Preenchimento
                      </th>
                      <th className="px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-plum/40">
                        Regra
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {campos.map((c) => (
                      <tr key={c.nome} className="border-t border-plum/5">
                        <td className="px-4 py-3 align-top text-[14px] font-medium text-plum">{c.nome}</td>
                        <td className="px-4 py-3 align-top">
                          <Tag
                            label={c.obrigatorio ? 'Obrigatório' : 'Opcional'}
                            variant={c.obrigatorio ? 'primary' : 'muted'}
                            size="sm"
                          />
                        </td>
                        <td className="px-4 py-3 align-top text-[14px] leading-[1.6] text-plum/70">{c.regra}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Bloco>
        )}

        {relacoes && (
          <Bloco titulo="Como se conecta">
            <div className="max-w-[68ch] rounded-[14px] border-l-[3px] border-mauve/40 bg-canvas/60 py-4 pl-5 pr-4">
              <p className="text-[15px] leading-[1.75] text-plum/75">{relacoes}</p>
            </div>
          </Bloco>
        )}

        {atencao.length > 0 && (
          <Bloco titulo="Atenção">
            <ul className="max-w-[68ch] space-y-2.5">
              {atencao.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-3 rounded-[14px] border border-mauve/15 bg-mauve-ghost px-4 py-3.5"
                >
                  <span className="mt-0.5 shrink-0 text-mauve">
                    <AlertIcon size={16} />
                  </span>
                  <span className="text-[14px] leading-[1.65] text-mauve-dark">{a}</span>
                </li>
              ))}
            </ul>
          </Bloco>
        )}
      </div>
    </article>
  )
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3.5 font-display text-[20px] text-plum">{titulo}</h3>
      {children}
    </section>
  )
}

function Paginacao({
  anterior,
  proxima,
  onAbrir,
}: {
  anterior: ManualSecao | null
  proxima: ManualSecao | null
  onAbrir: (slug: string) => void
}) {
  if (!anterior && !proxima) return null
  return (
    <div className="mt-12 flex flex-col gap-3 border-t border-plum/8 pt-6 sm:flex-row">
      {anterior ? (
        <button
          type="button"
          onClick={() => onAbrir(anterior.slug)}
          className="group flex flex-1 items-center gap-3 rounded-[14px] border border-plum/10 bg-white p-4 text-left transition-colors hover:border-mauve/30"
        >
          <ChevronLeftIcon size={18} className="shrink-0 text-plum/25 transition-colors group-hover:text-mauve" />
          <span className="min-w-0">
            <span className="block text-[10.5px] uppercase tracking-wider text-plum/40">Anterior</span>
            <span className="block truncate text-[14px] font-medium text-plum">{anterior.titulo}</span>
          </span>
        </button>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
      {proxima && (
        <button
          type="button"
          onClick={() => onAbrir(proxima.slug)}
          className="group flex flex-1 items-center justify-end gap-3 rounded-[14px] border border-plum/10 bg-white p-4 text-right transition-colors hover:border-mauve/30"
        >
          <span className="min-w-0">
            <span className="block text-[10.5px] uppercase tracking-wider text-plum/40">Próximo</span>
            <span className="block truncate text-[14px] font-medium text-plum">{proxima.titulo}</span>
          </span>
          <ChevronRightIcon size={18} className="shrink-0 text-plum/25 transition-colors group-hover:text-mauve" />
        </button>
      )}
    </div>
  )
}
