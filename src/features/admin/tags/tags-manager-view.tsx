'use client'

import { useState } from 'react'
import {
  CheckIcon,
  Dialog,
  ESButton,
  ESCard,
  ESSpinner,
  EmptyState,
  EditIcon,
  IconButton,
  PageHeader,
  PlusIcon,
  SearchIcon,
  Tag,
  TagsIcon,
  TextInput,
  TrashIcon,
} from '@/components/ui'
import { useTags } from './use-tags'
import { tagEmUso, validateTagName } from './validate'
import type { TagItem } from './types'

export function TagsManagerView() {
  const { items, loading, error, add, rename, remove, reload } = useTags()

  const [busca, setBusca] = useState('')
  const [novo, setNovo] = useState('')
  const [novoErr, setNovoErr] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editNome, setEditNome] = useState('')
  const [editErr, setEditErr] = useState('')
  const [removeTarget, setRemoveTarget] = useState<TagItem | null>(null)
  const [conflict, setConflict] = useState<TagItem | null>(null)

  const filtered = items.filter((t) => t.nome.toLowerCase().includes(busca.trim().toLowerCase()))

  const criar = async () => {
    const err = validateTagName(novo, items)
    setNovoErr(err)
    if (err) return
    const criada = await add(novo)
    if (criada) setNovo('')
  }

  const startEdit = (t: TagItem) => {
    setEditId(t.id)
    setEditNome(t.nome)
    setEditErr('')
  }
  const salvarEdit = async (t: TagItem) => {
    const err = validateTagName(editNome, items, t.id)
    setEditErr(err)
    if (err) return
    const ok = await rename(t.id, editNome)
    if (ok) setEditId(null)
  }

  const pedirRemover = (t: TagItem) => {
    if (tagEmUso(t)) setConflict(t)
    else setRemoveTarget(t)
  }
  const confirmarRemover = async () => {
    if (!removeTarget) return
    const alvo = removeTarget
    const res = await remove(alvo)
    setRemoveTarget(null)
    if (!res.ok && res.emUso) setConflict(alvo)
  }

  return (
    <div>
      <PageHeader
        title="Tags"
        description="O vocabulário que classifica conteúdos e fases. As tags são o motor de filtro do feed."
      />

      {/* Criar */}
      <ESCard variant="solid" isHoverable={false} className="mb-5">
        <div className="p-5">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-mauve">Nova tag</div>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <TextInput
                placeholder="Ex.: Autocompaixão"
                value={novo}
                onChange={(v) => { setNovo(v); setNovoErr('') }}
                errorMessage={novoErr}
                startContent={<TagsIcon size={16} />}
              />
            </div>
            <ESButton variant="primary" startContent={<PlusIcon size={16} />} onPress={criar}>
              Criar tag
            </ESButton>
          </div>
        </div>
      </ESCard>

      {/* Busca */}
      <div className="mb-4 max-w-[360px]">
        <TextInput placeholder="Buscar tag" value={busca} onChange={setBusca} startContent={<SearchIcon size={16} />} />
      </div>

      {loading ? (
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex justify-center py-12">
            <ESSpinner size="md" label="Carregando tags…" />
          </div>
        </ESCard>
      ) : error ? (
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-plum/60">{error}</p>
            <ESButton variant="primary" onPress={() => void reload()}>
              Tentar novamente
            </ESButton>
          </div>
        </ESCard>
      ) : items.length === 0 ? (
        <ESCard variant="solid" isHoverable={false}>
          <EmptyState
            icon={<TagsIcon size={24} />}
            title="Nenhuma tag ainda"
            description="Crie a primeira tag acima para começar a classificar conteúdos e fases."
          />
        </ESCard>
      ) : (
        <ESCard variant="solid" isHoverable={false}>
          <div className="border-b border-plum/6 px-[22px] py-3.5 text-[13px] text-plum/50">
            {filtered.length} de {items.length} {items.length === 1 ? 'tag' : 'tags'}
          </div>

          {filtered.map((t) => {
            const editando = editId === t.id
            return (
              <div
                key={t.id}
                className="flex items-center gap-4 border-b border-plum/5 px-[22px] py-3.5 last:border-0"
              >
                {editando ? (
                  <div className="flex flex-1 items-start gap-2.5">
                    <div className="max-w-[320px] flex-1">
                      <TextInput
                        value={editNome}
                        onChange={(v) => { setEditNome(v); setEditErr('') }}
                        errorMessage={editErr}
                      />
                    </div>
                    <ESButton variant="primary" size="sm" startContent={<CheckIcon size={15} />} onPress={() => salvarEdit(t)}>
                      Salvar
                    </ESButton>
                    <ESButton variant="ghost" size="sm" onPress={() => setEditId(null)}>
                      Cancelar
                    </ESButton>
                  </div>
                ) : (
                  <>
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="inline-flex text-mauve">
                        <TagsIcon size={16} />
                      </span>
                      <span className="text-[14.5px] font-medium text-plum">{t.nome}</span>
                    </div>
                    <div>
                      {tagEmUso(t) ? (
                        <span className="text-[12.5px] text-plum/50">
                          em uso · {t.usoConteudos} {t.usoConteudos === 1 ? 'conteúdo' : 'conteúdos'}
                          {t.usoFases ? `, ${t.usoFases} ${t.usoFases === 1 ? 'fase' : 'fases'}` : ''}
                        </span>
                      ) : (
                        // ES-002: "sem conteúdos", não "não usada" — o vínculo com
                        // FASES não é derivável no cliente (GET /admin/fases não traz
                        // as tags), então não podemos afirmar não-uso total.
                        <Tag label="sem conteúdos" variant="muted" size="sm" />
                      )}
                    </div>
                    <div className="flex gap-1">
                      <IconButton title="Renomear" onPress={() => startEdit(t)}>
                        <EditIcon size={16} />
                      </IconButton>
                      <IconButton title="Remover" variant="danger" onPress={() => pedirRemover(t)}>
                        <TrashIcon size={16} />
                      </IconButton>
                    </div>
                  </>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="px-8 py-8 text-center text-sm text-plum/50">
              Nenhuma tag encontrada para “{busca}”.
            </div>
          )}
        </ESCard>
      )}

      <p className="mt-3.5 text-[12.5px] leading-relaxed text-plum/45">
        Uma tag em uso por conteúdos ou fases não pode ser removida — desvincule-a primeiro. A
        entidade Tag só tem o campo nome.
      </p>

      {/* Confirmar remoção */}
      <Dialog
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        variant="destructive"
        title="Remover tag?"
        description={
          removeTarget
            ? `A tag "${removeTarget.nome}" será excluída permanentemente. Esta ação não pode ser desfeita.`
            : ''
        }
        footer={
          <>
            <ESButton variant="ghost" onPress={() => setRemoveTarget(null)}>
              Cancelar
            </ESButton>
            <ESButton variant="destructive" onPress={confirmarRemover}>
              Remover
            </ESButton>
          </>
        }
      />

      {/* Conflito (em uso) */}
      <Dialog
        isOpen={!!conflict}
        onClose={() => setConflict(null)}
        title="Tag em uso"
        description={
          conflict
            ? `"${conflict.nome}" está vinculada a conteúdos ou fases. Desvincule-a de tudo antes de remover.`
            : ''
        }
        footer={
          <ESButton variant="primary" onPress={() => setConflict(null)}>
            Entendi
          </ESButton>
        }
      />
    </div>
  )
}
