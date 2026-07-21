'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  EditIcon,
  ESButton,
  ESCard,
  ESSpinner,
  EmptyState,
  PageHeader,
  PlusIcon,
  SearchIcon,
  SelectInput,
  Tag,
  TextInput,
  TrilhasIcon,
} from '@/components/ui'
import { useTrilhas } from './use-trilhas'
import type { Trilha } from './types'

export function TrilhasListView() {
  const router = useRouter()
  const { items, loading, error, reload } = useTrilhas()
  const [busca, setBusca] = useState('')
  const [fStatus, setFStatus] = useState('')

  const filtered = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return items.filter((t) => {
      if (q && !t.titulo.toLowerCase().includes(q)) return false
      if (fStatus === 'publicada' && !t.publicada) return false
      if (fStatus === 'rascunho' && t.publicada) return false
      return true
    })
  }, [items, busca, fStatus])

  return (
    <div>
      <PageHeader
        title="Trilhas"
        description="Curadorias ordenadas de conteúdo que a usuária percorre livremente."
        action={
          <ESButton variant="primary" startContent={<PlusIcon size={16} />} onPress={() => router.push('/admin/trilhas/nova')}>
            Nova trilha
          </ESButton>
        }
      />

      <div className="mb-[18px] flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-[1_1_260px]">
          <TextInput placeholder="Buscar por título" value={busca} onChange={setBusca} startContent={<SearchIcon size={16} />} />
        </div>
        <div className="w-[180px]">
          <SelectInput
            placeholder="Todos os status"
            selectedKey={fStatus}
            onChange={setFStatus}
            options={[
              { key: '', label: 'Todos os status' },
              { key: 'publicada', label: 'Publicadas' },
              { key: 'rascunho', label: 'Rascunhos' },
            ]}
          />
        </div>
      </div>

      {loading ? (
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex justify-center py-16">
            <ESSpinner size="md" label="Carregando trilhas…" />
          </div>
        </ESCard>
      ) : error ? (
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-plum/60">{error}</p>
            <ESButton variant="primary" onPress={() => void reload()}>
              Tentar novamente
            </ESButton>
          </div>
        </ESCard>
      ) : items.length === 0 ? (
        <ESCard variant="solid" isHoverable={false}>
          <EmptyState
            icon={<TrilhasIcon size={24} />}
            title="Nenhuma trilha ainda"
            description="Crie a primeira curadoria de conteúdos."
            action={
              <ESButton variant="primary" onPress={() => router.push('/admin/trilhas/nova')}>
                Nova trilha
              </ESButton>
            }
          />
        </ESCard>
      ) : filtered.length === 0 ? (
        <ESCard variant="solid" isHoverable={false}>
          <div className="px-10 py-11 text-center text-sm text-plum/50">
            Nenhuma trilha encontrada para os filtros aplicados.
          </div>
        </ESCard>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4">
          {filtered.map((t) => (
            <TrailCard key={t.id} trilha={t} />
          ))}
        </div>
      )}
    </div>
  )
}

function TrailCard({ trilha }: { trilha: Trilha }) {
  return (
    <Link
      href={`/admin/trilhas/${trilha.id}/editar`}
      className="group block overflow-hidden rounded-[20px] border border-plum/7 bg-white shadow-[0_2px_10px_rgba(45,24,64,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-mauve/20 hover:shadow-[0_12px_32px_rgba(45,24,64,0.10)]"
    >
      <div
        className="relative flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-plum-soft to-mauve-ghost bg-cover bg-center"
        style={trilha.thumb ? { backgroundImage: `url(${trilha.thumb})` } : undefined}
      >
        {!trilha.thumb && (
          <span className="text-mauve/35">
            <TrilhasIcon size={30} />
          </span>
        )}
        <div className="absolute left-3 top-3">
          <Tag label={trilha.publicada ? 'Publicada' : 'Rascunho'} variant={trilha.publicada ? 'primary' : 'muted'} size="sm" />
        </div>
      </div>
      <div className="p-[18px]">
        <h3 className="font-display text-xl text-plum">{trilha.titulo}</h3>
        {trilha.descricao && (
          <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-[1.5] text-plum/60">{trilha.descricao}</p>
        )}
        <div className="mt-3.5 flex items-center gap-2 text-[12.5px] text-plum/50">
          <TrilhasIcon size={15} />
          {(trilha.totalConteudos ?? trilha.conteudos.length)}{' '}
          {(trilha.totalConteudos ?? trilha.conteudos.length) === 1 ? 'conteúdo' : 'conteúdos'}
          <span className="ml-auto inline-flex items-center gap-1 font-medium text-mauve">
            <EditIcon size={14} /> Editar
          </span>
        </div>
      </div>
    </Link>
  )
}
