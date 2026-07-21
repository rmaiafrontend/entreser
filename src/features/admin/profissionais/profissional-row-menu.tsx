'use client'

import { BanIcon, CheckIcon, EditIcon, ResendIcon, RowActionsItem, RowActionsMenu } from '@/components/ui'
import type { Profissional } from './types'

interface ProfissionalRowMenuProps {
  p: Profissional
  onView: () => void
  onEdit: () => void
  onResend: () => void
  onDeactivate: () => void
  onReactivate: () => void
}

/**
 * Menu de ações por linha da listagem de profissionais. `stopPropagation`
 * impede que abrir o menu dispare o clique da linha (que abre o detalhe).
 */
export function ProfissionalRowMenu({
  p,
  onView,
  onEdit,
  onResend,
  onDeactivate,
  onReactivate,
}: ProfissionalRowMenuProps) {
  const needResend = p.convite === 'pendente' || p.convite === 'expirado'

  return (
    <RowActionsMenu>
      <RowActionsItem icon={<EyeIcon />} onSelect={onView}>
        Ver detalhe
      </RowActionsItem>
      <RowActionsItem icon={<EditIcon size={16} />} onSelect={onEdit}>
        Editar
      </RowActionsItem>
      {needResend && (
        <RowActionsItem icon={<ResendIcon size={16} />} onSelect={onResend}>
          Reenviar convite
        </RowActionsItem>
      )}
      {p.ativa ? (
        <RowActionsItem icon={<BanIcon size={16} />} danger onSelect={onDeactivate}>
          Desativar
        </RowActionsItem>
      ) : (
        <RowActionsItem icon={<CheckIcon size={16} />} onSelect={onReactivate}>
          Reativar
        </RowActionsItem>
      )}
    </RowActionsMenu>
  )
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
