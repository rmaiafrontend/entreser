import type { ReactNode } from 'react'
import { AlertIcon } from '@/components/ui'

/** Pílula de aviso âmbar (integridade do onboarding). */
export function WarnPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill bg-[#B8860B]/12 px-2.5 py-[3px] text-xs text-[#7A5C00]">
      <AlertIcon size={13} />
      {children}
    </span>
  )
}
