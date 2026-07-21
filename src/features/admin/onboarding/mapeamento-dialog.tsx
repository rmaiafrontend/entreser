'use client'

import { useState } from 'react'
import { Dialog, ESButton } from '@/components/ui'
import type { Fase } from '@/features/admin/fases/types'
import { WarnPill } from './warn-pill'
import type { Opcao } from './types'

interface MapeamentoDialogProps {
  opcao: Opcao
  fases: Fase[]
  onClose: () => void
  onSave: (mapa: Record<string, number>) => Promise<void>
}

/** Mapeamento de peso (0–10) por fase para uma opção de resposta. */
export function MapeamentoDialog({ opcao, fases, onClose, onSave }: MapeamentoDialogProps) {
  const sorted = [...fases].sort((a, b) => a.ordem - b.ordem)
  const [pesos, setPesos] = useState<Record<string, number>>({ ...opcao.mapa })
  const [saving, setSaving] = useState(false)

  const setPeso = (fid: string, v: number) => setPesos((p) => ({ ...p, [fid]: v }))
  const todosZero = sorted.every((f) => !pesos[f.id])

  const salvar = async () => {
    const limpo: Record<string, number> = {}
    Object.entries(pesos).forEach(([k, v]) => {
      if (v > 0) limpo[k] = Math.min(10, v)
    })
    setSaving(true)
    await onSave(limpo)
    setSaving(false)
    onClose()
  }

  return (
    <Dialog
      isOpen
      onClose={() => !saving && onClose()}
      width={560}
      title="Mapeamento de fase"
      description={`Peso (0–10) que a opção "${opcao.texto}" dá a cada fase.`}
      footer={
        <>
          <ESButton variant="ghost" onPress={() => setPesos({})}>
            Zerar
          </ESButton>
          <div className="flex-1" />
          <ESButton variant="ghost" onPress={onClose} isDisabled={saving}>
            Cancelar
          </ESButton>
          <ESButton variant="primary" isLoading={saving} onPress={salvar}>
            Salvar mapeamento
          </ESButton>
        </>
      }
    >
      {sorted.length === 0 ? (
        <div className="px-5 py-5 text-center text-sm text-plum/55">
          Nenhuma fase cadastrada. Cadastre fases em Conteúdo › Fases antes de mapear.
        </div>
      ) : (
        <div className="flex max-h-[52vh] flex-col gap-1.5 overflow-y-auto pr-1">
          <p className="mb-2 rounded-[10px] bg-cream px-3 py-2.5 text-[12.5px] leading-[1.5] text-plum/50">
            Os pesos das opções escolhidas são somados por fase; a fase com maior soma vence (empate → fase de
            menor ordem).
          </p>
          {sorted.map((f) => {
            const val = pesos[f.id] || 0
            return (
              <div key={f.id} className="flex items-center gap-3.5 border-b border-plum/5 px-1 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-plum">{f.nome}</div>
                  {!f.ativa && <span className="text-[11.5px] text-plum/40">inativa</span>}
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={val}
                  onChange={(e) => setPeso(f.id, parseInt(e.target.value, 10))}
                  className="w-[160px] accent-mauve"
                />
                <span
                  className={`w-[30px] text-center font-display text-lg ${val > 0 ? 'text-mauve-dark' : 'text-plum/30'}`}
                >
                  {val}
                </span>
              </div>
            )
          })}
          {todosZero && (
            <div className="mt-2">
              <WarnPill>Todos os pesos em 0 — esta opção não contribui para a definição de fase.</WarnPill>
            </div>
          )}
        </div>
      )}
    </Dialog>
  )
}
