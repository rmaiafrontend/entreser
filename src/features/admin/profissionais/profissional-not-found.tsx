'use client'

import { useRouter } from 'next/navigation'
import { ESButton, ESCard, PageHeader } from '@/components/ui'

/** Estado de "não encontrada" reutilizado por detalhe e edição. */
export function ProfissionalNotFound() {
  const router = useRouter()
  return (
    <div>
      <PageHeader title="Profissional não encontrada" />
      <ESCard variant="solid" isHoverable={false}>
        <div className="px-6 py-12 text-center">
          <p className="mb-4 text-[14.5px] text-plum/60">
            O registro que você tentou abrir não existe ou foi removido.
          </p>
          <ESButton variant="primary" onPress={() => router.push('/admin/profissionais')}>
            Voltar à listagem
          </ESButton>
        </div>
      </ESCard>
    </div>
  )
}
