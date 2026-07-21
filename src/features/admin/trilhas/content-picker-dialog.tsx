'use client'

import { useMemo, useState } from 'react'
import { Dialog, ESButton, SearchIcon, SelectInput, Tag, TextInput } from '@/components/ui'
import { cn } from '@/lib/utils'
import { FORMATO } from '@/features/admin/conteudos/meta'
import type { Conteudo } from '@/features/admin/conteudos/types'

interface ContentPickerDialogProps {
  allContent: Conteudo[]
  /** Ids já na trilha (desabilitados). */
  alreadyIn: string[]
  onClose: () => void
  onAdd: (ids: string[]) => void
}

/** Modal de seleção de conteúdos da biblioteca para compor a trilha. */
export function ContentPickerDialog({ allContent, alreadyIn, onClose, onAdd }: ContentPickerDialogProps) {
  const [busca, setBusca] = useState('')
  const [fFormato, setFFormato] = useState('')
  const [sel, setSel] = useState<string[]>([])

  const filtered = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return allContent.filter((c) => {
      if (q && !c.titulo.toLowerCase().includes(q)) return false
      if (fFormato && c.formato !== fFormato) return false
      return true
    })
  }, [allContent, busca, fFormato])

  const toggle = (id: string) => setSel((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]))

  return (
    <Dialog
      isOpen
      onClose={onClose}
      width={620}
      title="Adicionar conteúdo"
      description="Busque na biblioteca e selecione os conteúdos que entram na trilha."
      footer={
        <>
          <ESButton variant="ghost" onPress={onClose}>
            Cancelar
          </ESButton>
          <ESButton variant="primary" isDisabled={sel.length === 0} onPress={() => onAdd(sel)}>
            Adicionar {sel.length > 0 ? `(${sel.length})` : ''}
          </ESButton>
        </>
      }
    >
      <div className="flex flex-col gap-3.5">
        <div className="flex gap-2.5">
          <div className="flex-1">
            <TextInput placeholder="Buscar por título" value={busca} onChange={setBusca} startContent={<SearchIcon size={16} />} />
          </div>
          <div className="w-[150px]">
            <SelectInput
              placeholder="Formato"
              selectedKey={fFormato}
              onChange={setFFormato}
              options={[
                { key: '', label: 'Todos' },
                { key: 'artigo', label: 'Artigo' },
                { key: 'video', label: 'Vídeo' },
                { key: 'audio', label: 'Áudio' },
              ]}
            />
          </div>
        </div>

        <div className="flex max-h-[46vh] flex-col gap-2 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="px-8 py-8 text-center text-sm text-plum/50">Nenhum conteúdo encontrado.</div>
          ) : (
            filtered.map((c) => {
              const jaIncluido = alreadyIn.includes(c.id)
              const marcado = sel.includes(c.id)
              const Icon = FORMATO[c.formato].Icon
              return (
                <button
                  key={c.id}
                  type="button"
                  disabled={jaIncluido}
                  onClick={() => toggle(c.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors',
                    jaIncluido
                      ? 'cursor-default border-plum/10 bg-cream opacity-60'
                      : marcado
                        ? 'border-mauve bg-mauve-ghost'
                        : 'border-plum/10 bg-white',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] text-[13px] text-white',
                      marcado ? 'border-mauve bg-mauve' : 'border-plum/25',
                    )}
                  >
                    {marcado ? '✓' : ''}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cream-mid text-mauve">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-plum">{c.titulo}</div>
                    <div className="text-xs text-plum/45">
                      {FORMATO[c.formato].label}
                      {c.duracao ? ` · ${c.duracao} min` : ''}
                      {!c.publicado ? ' · rascunho' : ''}
                    </div>
                  </div>
                  {jaIncluido && <Tag label="Já na trilha" variant="muted" size="sm" />}
                </button>
              )
            })
          )}
        </div>
      </div>
    </Dialog>
  )
}
