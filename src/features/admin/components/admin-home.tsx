'use client'

import Link from 'next/link'
import type { ComponentType } from 'react'
import { PageHeader, type IconProps } from '@/components/ui'
import { useAdminAuth } from '@/features/admin/context/admin-auth-context'
import { NAV_ADMIN } from './backoffice-nav'

/** Descrições curtas de cada área, exibidas nos cartões-atalho da Home. */
const AREA_DESC: Record<string, string> = {
  profissionais: 'Cadastre e gerencie as psicólogas da plataforma.',
  equipe: 'Membros internos com acesso ao backoffice.',
  usuarias: 'Consulte as usuárias cadastradas na plataforma.',
  tags: 'O vocabulário que classifica conteúdos e fases.',
  fases: 'Os momentos do ciclo e suas tags atreladas.',
  conteudos: 'Biblioteca de artigos, vídeos e áudios.',
  trilhas: 'Curadorias ordenadas de conteúdo.',
  onboarding: 'Questionário que infere a fase inicial.',
  metricas: 'Visão agregada de consumo da plataforma.',
}

/**
 * Home do Admin Geral — saudação + atalhos por seção (Pessoas / Conteúdo /
 * Análise), construídos a partir da navegação canônica (NAV_ADMIN).
 */
export function AdminHome() {
  const { admin } = useAdminAuth()
  const first = admin?.nome.split(' ')[0] ?? ''
  const sections = NAV_ADMIN.filter((g) => g.section !== 'Início')

  return (
    <div>
      <PageHeader
        eyebrow="Painel administrativo"
        title={`Olá, ${first}.`}
        description="Gerencie pessoas, conteúdos e acompanhe o consumo da plataforma."
      />
      {sections.map((g) => (
        <section key={g.section} className="mb-8">
          <h2 className="mb-3.5 font-display text-xl text-plum">{g.section}</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
            {g.items.map((it) => (
              <HomeCard
                key={it.key}
                href={it.href}
                icon={it.icon}
                title={it.label}
                description={AREA_DESC[it.key]}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function HomeCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string
  icon: ComponentType<IconProps>
  title: string
  description?: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-[18px] border border-plum/6 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-plum-soft text-mauve">
        <Icon size={22} />
      </span>
      <div>
        <div className="font-display text-[19px] text-plum">{title}</div>
        <div className="mt-0.5 text-[13.5px] leading-[1.45] text-plum/55">{description}</div>
      </div>
    </Link>
  )
}
