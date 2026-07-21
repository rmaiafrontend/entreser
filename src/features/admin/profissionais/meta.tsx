import { Tag } from '@/components/ui'
import type { ConviteStatus, Profissional } from './types'

type TagVariant = 'primary' | 'plum' | 'muted'

export const CONVITE_META: Record<ConviteStatus, { label: string; variant: TagVariant }> = {
  ativo: { label: 'Acesso ativo', variant: 'plum' },
  pendente: { label: 'Convite pendente', variant: 'primary' },
  expirado: { label: 'Convite expirado', variant: 'muted' },
}

/** Par de tags Ativa/Inativa + situação do convite. */
export function StatusTags({ p, size = 'sm' }: { p: Profissional; size?: 'sm' | 'md' }) {
  const cm = CONVITE_META[p.convite]
  return (
    <div className="flex flex-wrap gap-1.5">
      <Tag label={p.ativa ? 'Ativa' : 'Inativa'} variant={p.ativa ? 'primary' : 'muted'} size={size} />
      <Tag label={cm.label} variant={cm.variant} size={size} />
    </div>
  )
}
