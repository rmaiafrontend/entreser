'use client'

import { useState } from 'react'
import { Dialog, ESAvatar, ESButton } from '@/components/ui'
import type { Profissional } from './types'

interface ProfissionalDeactivateDialogProps {
  /** Profissional-alvo; `null` mantém o modal fechado. */
  target: Profissional | null
  onClose: () => void
  onConfirm: (p: Profissional) => Promise<void>
}

/** Confirmação de desativação (destrutiva) — usada na lista e no detalhe. */
export function ProfissionalDeactivateDialog({
  target,
  onClose,
  onConfirm,
}: ProfissionalDeactivateDialogProps) {
  const [loading, setLoading] = useState(false)

  const confirm = async () => {
    if (!target) return
    setLoading(true)
    await onConfirm(target)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog
      isOpen={!!target}
      onClose={() => !loading && onClose()}
      variant="destructive"
      width={460}
      title="Desativar profissional?"
      footer={
        <>
          <ESButton variant="ghost" onPress={onClose} isDisabled={loading}>
            Cancelar
          </ESButton>
          <ESButton variant="destructive" isLoading={loading} onPress={confirm}>
            Confirmar desativação
          </ESButton>
        </>
      }
    >
      {target && (
        <div>
          <div className="mb-3.5 flex items-center gap-3 rounded-xl bg-cream p-3.5">
            <ESAvatar name={target.nome} size="sm" />
            <div>
              <div className="text-sm font-semibold text-plum">{target.nome}</div>
              <div className="text-[12.5px] text-plum/55">
                {target.email} · {target.crp}
              </div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-plum/70">
            Ela deixa de aparecer na listagem e no perfil público e{' '}
            <strong>não conseguirá mais fazer login</strong>. O registro é mantido e pode ser
            consultado como <em>Inativa</em>.
          </p>
        </div>
      )}
    </Dialog>
  )
}
