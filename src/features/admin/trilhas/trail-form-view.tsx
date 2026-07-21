'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BackButton,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  Dialog,
  ESButton,
  ESCard,
  ESSkeleton,
  ESSpinner,
  InfoNote,
  PageHeader,
  PlusIcon,
  Tag,
  TextInput,
  TextareaInput,
  TrilhasIcon,
  useToast,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { ThumbUrlField } from '@/features/admin/components/thumb-url-field'
import { FORMATO } from '@/features/admin/conteudos/meta'
import { useConteudoOptions } from '@/features/admin/conteudos/use-conteudos'
import { ContentPickerDialog } from './content-picker-dialog'
import { trilhasService } from '.'
import { useTrilhaMutations } from './use-trilhas'
import type { Trilha } from './types'

export function TrailFormView({ id }: { id?: string }) {
  const router = useRouter()
  const [existing, setExisting] = useState<Trilha | null | undefined>(id ? undefined : null)

  useEffect(() => {
    if (!id) return
    let ativo = true
    trilhasService
      .getById(id)
      .then((t) => {
        if (ativo) setExisting(t)
      })
      .catch(() => {
        if (ativo) setExisting(null)
      })
    return () => {
      ativo = false
    }
  }, [id])

  if (existing === undefined) {
    return (
      <div>
        <PageHeader title="Editar trilha" />
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex justify-center py-16">
            <ESSpinner size="md" label="Carregando trilha…" />
          </div>
        </ESCard>
      </div>
    )
  }
  if (id && existing === null) {
    return (
      <div>
        <PageHeader title="Trilha não encontrada" />
        <ESCard variant="solid" isHoverable={false}>
          <div className="px-6 py-12 text-center">
            <p className="mb-4 text-[14.5px] text-plum/60">A trilha que você tentou abrir não existe.</p>
            <ESButton variant="primary" onPress={() => router.push('/admin/trilhas')}>Voltar à listagem</ESButton>
          </div>
        </ESCard>
      </div>
    )
  }
  return <TrailForm existing={existing} />
}

function TrailForm({ existing }: { existing: Trilha | null }) {
  const router = useRouter()
  const { add, update } = useTrilhaMutations()
  const { showToast } = useToast()
  const { conteudos: allContent, loading: loadingContent, error: errorContent } = useConteudoOptions()
  const editing = Boolean(existing)

  const [titulo, setTitulo] = useState(existing?.titulo ?? '')
  const [descricao, setDescricao] = useState(existing?.descricao ?? '')
  const [thumb, setThumb] = useState<string | null>(existing?.thumb ?? null)
  const [ids, setIds] = useState<string[]>(existing ? [...existing.conteudos] : [])
  const [tituloErr, setTituloErr] = useState('')
  const [saving, setSaving] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [confirmPublish, setConfirmPublish] = useState(false)

  const conteudoById = (cid: string) => allContent.find((c) => c.id === cid)

  // ES-016: ids sem conteúdo correspondente (removidos da biblioteca). Só dá para
  // afirmar isso DEPOIS de a biblioteca carregar com sucesso — enquanto carrega,
  // ou se a carga falhou, todo id resolveria para "não encontrado" por engano.
  const idsFantasma = !loadingContent && !errorContent ? ids.filter((cid) => !conteudoById(cid)) : []
  const removerFantasmas = () => setIds((l) => l.filter((cid) => conteudoById(cid)))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= ids.length) return
    setIds((l) => {
      const n = [...l]
      ;[n[i], n[j]] = [n[j], n[i]]
      return n
    })
  }
  const removeId = (cid: string) => setIds((l) => l.filter((x) => x !== cid))

  const back = () => router.push('/admin/trilhas')

  const persist = async (publicar: boolean) => {
    setSaving(true)
    const data = { titulo: titulo.trim(), descricao: descricao.trim(), thumb, conteudos: ids, publicada: publicar }
    // ES-015: só navega se o salvamento confirmar sucesso. Em erro, permanece na
    // tela com título, descrição e curadoria intactos e o toast de erro visível —
    // nunca leva a pessoa de volta descartando o trabalho.
    const ok = existing ? await update(existing.id, data) : await add(data)
    setSaving(false)
    if (ok) {
      // Invalida o Router Cache do cliente ANTES de navegar: sem isso a listagem
      // é reexibida do cache (o efeito de `useTrilhas` não re-roda) e os cards
      // ficam com os dados antigos, mesmo com o PATCH já persistido no backend.
      router.refresh()
      back()
    }
  }
  const salvar = (publicar: boolean) => {
    if (!titulo.trim()) {
      setTituloErr('Informe o título.')
      return
    }
    if (titulo.trim().length > 200) {
      setTituloErr('Máximo de 200 caracteres.')
      return
    }
    if (publicar) {
      const temRascunho = ids.some((cid) => {
        const c = conteudoById(cid)
        return c && !c.publicado
      })
      if (ids.length === 0 || temRascunho) {
        setConfirmPublish(true)
        return
      }
    }
    void persist(publicar)
  }

  return (
    <div>
      <BackButton href="/admin/trilhas" label="Voltar para trilhas" />
      <PageHeader
        breadcrumb={[{ label: 'Trilhas', href: '/admin/trilhas' }, { label: editing ? 'Editar' : 'Nova' }]}
        title={editing ? 'Editar trilha' : 'Nova trilha'}
        description={editing ? 'Ajuste os dados e a curadoria de conteúdos.' : 'Monte uma curadoria ordenada de conteúdos.'}
      />

      <div className="flex flex-col gap-5">
        {/* Metadados */}
        <ESCard variant="solid" isHoverable={false}>
          <div className="grid grid-cols-1 gap-5 p-[26px] md:grid-cols-[1.7fr_1fr] md:items-start">
            <div className="flex flex-col gap-[18px]">
              <TextInput
                label="Título"
                placeholder="Ex.: Primeiros passos na FIV"
                value={titulo}
                onChange={(v) => { setTitulo(v); setTituloErr('') }}
                errorMessage={tituloErr}
                isRequired
              />
              <TextareaInput
                label="Descrição"
                placeholder="Descreva o objetivo desta trilha…"
                value={descricao}
                onChange={setDescricao}
                minRows={3}
              />
            </div>
            <ThumbUrlField value={thumb} onChange={setThumb} />
          </div>
        </ESCard>

        {/* Curadoria */}
        <ESCard variant="solid" isHoverable={false}>
          <div className="p-[26px]">
            <div className="mb-1 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-mauve">Conteúdos da trilha</div>
                <div className="mt-1 text-[13px] text-plum/50">
                  {ids.length} {ids.length === 1 ? 'conteúdo' : 'conteúdos'} · a ordem define a sequência sugerida
                </div>
              </div>
              <ESButton variant="secondary" size="sm" startContent={<PlusIcon size={15} />} onPress={() => setPickerOpen(true)}>
                Adicionar conteúdo
              </ESButton>
            </div>

            {ids.length === 0 ? (
              <div className="mt-[18px] rounded-2xl border-[1.5px] border-dashed border-cream-dark bg-cream px-6 py-10 text-center">
                <div className="mb-2.5 flex justify-center text-mauve/40">
                  <TrilhasIcon size={26} />
                </div>
                <p className="mb-3.5 text-sm text-plum/60">Nenhum conteúdo ainda. Adicione o primeiro da biblioteca.</p>
                <ESButton variant="primary" size="sm" onPress={() => setPickerOpen(true)}>
                  Adicionar conteúdo
                </ESButton>
              </div>
            ) : loadingContent ? (
              // ES-016: enquanto a biblioteca carrega, mostramos um esqueleto por id —
              // nunca uma lista vazia com o contador dizendo que há N conteúdos.
              <div className="mt-4 flex flex-col gap-2.5">
                {ids.map((cid) => (
                  <div key={cid} className="flex items-center gap-3.5 rounded-[14px] border border-plum/8 bg-white px-3.5 py-3">
                    <ESSkeleton variant="circular" width={26} height={26} />
                    <ESSkeleton variant="circular" width={34} height={34} />
                    <ESSkeleton variant="text" width="45%" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-2.5">
                {errorContent && (
                  <InfoNote>
                    Não foi possível carregar a biblioteca de conteúdos. Os itens abaixo aparecem
                    apenas pela posição — recarregue a página para ver os títulos.
                  </InfoNote>
                )}
                {idsFantasma.length > 0 && (
                  <div className="flex items-center justify-between gap-3 rounded-[14px] border border-red-muted bg-red-alert/[0.05] px-3.5 py-2.5 text-[13px] text-red-alert">
                    <span>
                      {idsFantasma.length}{' '}
                      {idsFantasma.length === 1
                        ? 'conteúdo não está mais na biblioteca'
                        : 'conteúdos não estão mais na biblioteca'}{' '}
                      e não aparecem para as usuárias.
                    </span>
                    <button type="button" onClick={removerFantasmas} className="shrink-0 font-medium underline">
                      Remover indisponíveis
                    </button>
                  </div>
                )}
                {ids.map((cid, i) => {
                  const c = conteudoById(cid)
                  // ES-016: um id sem conteúdo NÃO some (return null). Vira uma linha
                  // "indisponível" visível, com opção de remover quando é fantasma de
                  // verdade (biblioteca carregou e o id não existe mais).
                  if (!c)
                    return (
                      <UnavailableRow
                        key={cid}
                        idx={i}
                        conhecido={!errorContent}
                        onRemove={() => removeId(cid)}
                      />
                    )
                  const Icon = FORMATO[c.formato].Icon
                  return (
                    <div key={cid} className="flex items-center gap-3.5 rounded-[14px] border border-plum/8 bg-white px-3.5 py-3">
                      <div className="flex flex-col gap-px">
                        <MiniArrow dir="up" disabled={i === 0} onClick={() => move(i, -1)} />
                        <MiniArrow dir="down" disabled={i === ids.length - 1} onClick={() => move(i, 1)} />
                      </div>
                      <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-pill bg-plum-soft font-display text-sm text-mauve-dark">
                        {i + 1}
                      </span>
                      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-cream-mid text-mauve">
                        <Icon size={17} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-plum">{c.titulo}</div>
                        <div className="text-xs text-plum/45">
                          {FORMATO[c.formato].label}
                          {c.duracao ? ` · ${c.duracao} min` : ''}
                        </div>
                      </div>
                      {!c.publicado && <Tag label="Rascunho" variant="muted" size="sm" />}
                      <button
                        type="button"
                        onClick={() => removeId(cid)}
                        title="Remover"
                        aria-label="Remover"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] text-plum/40 transition-colors hover:bg-red-alert/10 hover:text-red-alert"
                      >
                        <CloseIcon size={16} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </ESCard>
      </div>

      {/* Ações */}
      <div className="mt-[22px] flex flex-wrap justify-end gap-2.5 border-t border-plum/8 pt-5">
        <ESButton variant="ghost" onPress={back} isDisabled={saving}>
          Cancelar
        </ESButton>
        <ESButton variant="secondary" isLoading={saving} onPress={() => salvar(false)}>
          Salvar rascunho
        </ESButton>
        <ESButton variant="primary" isLoading={saving} onPress={() => salvar(true)}>
          {editing && existing?.publicada ? 'Salvar e publicar' : 'Publicar'}
        </ESButton>
      </div>

      {pickerOpen && (
        <ContentPickerDialog
          allContent={allContent}
          alreadyIn={ids}
          onClose={() => setPickerOpen(false)}
          onAdd={(novos) => {
            setIds((l) => [...l, ...novos])
            setPickerOpen(false)
            showToast(`${novos.length} conteúdo(s) adicionado(s).`, 'success')
          }}
        />
      )}

      {confirmPublish && (
        <ConfirmPublishDialog
          empty={ids.length === 0}
          onClose={() => setConfirmPublish(false)}
          onConfirm={() => {
            setConfirmPublish(false)
            void persist(true)
          }}
        />
      )}
    </div>
  )
}

function MiniArrow({ dir, disabled, onClick }: { dir: 'up' | 'down'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={dir === 'up' ? 'Subir' : 'Descer'}
      className={cn(
        'flex h-5 w-6 items-center justify-center rounded-md transition-colors',
        disabled ? 'cursor-default text-plum/20' : 'text-mauve hover:bg-mauve/12',
      )}
    >
      {dir === 'up' ? <ChevronUpIcon size={15} /> : <ChevronDownIcon size={15} />}
    </button>
  )
}

/**
 * Linha de um conteúdo que a curadoria referencia mas a biblioteca não resolve.
 * `conhecido` = a biblioteca carregou e o id realmente não existe mais (fantasma,
 * removível). Se a biblioteca não carregou, é só indisponibilidade momentânea —
 * não afirmamos que foi removido nem oferecemos remover.
 */
function UnavailableRow({
  idx,
  conhecido,
  onRemove,
}: {
  idx: number
  conhecido: boolean
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-[14px] border border-dashed border-red-muted bg-red-alert/[0.04] px-3.5 py-3">
      <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-pill bg-red-alert/10 font-display text-sm text-red-alert">
        {idx + 1}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-red-alert">Conteúdo indisponível</div>
        <div className="text-xs text-plum/45">
          {conhecido
            ? 'Removido da biblioteca — não aparece para as usuárias.'
            : 'A biblioteca não carregou; recarregue para ver o título.'}
        </div>
      </div>
      {conhecido && (
        <button
          type="button"
          onClick={onRemove}
          title="Remover"
          aria-label="Remover"
          className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] text-plum/40 transition-colors hover:bg-red-alert/10 hover:text-red-alert"
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  )
}

function ConfirmPublishDialog({
  empty,
  onClose,
  onConfirm,
}: {
  empty: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Dialog
      isOpen
      onClose={onClose}
      title="Publicar mesmo assim?"
      description={
        empty
          ? 'Esta trilha não tem nenhum conteúdo. A experiência da usuária ficará vazia.'
          : 'Esta trilha contém conteúdos em rascunho, que não aparecem para as usuárias — a trilha pode ficar incompleta.'
      }
      footer={
        <>
          <ESButton variant="ghost" onPress={onClose}>
            Voltar
          </ESButton>
          <ESButton variant="primary" onPress={onConfirm}>
            Publicar assim mesmo
          </ESButton>
        </>
      }
    />
  )
}
