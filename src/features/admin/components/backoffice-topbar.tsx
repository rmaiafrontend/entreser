'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ESAvatar, LockIcon, LogoutIcon, PanelLeftIcon } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BackofficeProfile } from './backoffice-nav'

interface BackofficeTopbarProps {
  user: { name: string; email: string }
  profile: BackofficeProfile
  collapsed: boolean
  onToggleCollapse: () => void
  onLogout: () => void
}

/**
 * Topbar do backoffice — botão de recolher a sidebar, identidade da pessoa
 * logada e menu (Trocar senha / Sair). Fundo "glass".
 */
export function BackofficeTopbar({
  user,
  profile,
  collapsed,
  onToggleCollapse,
  onLogout,
}: BackofficeTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const tipo = profile === 'admin' ? 'Admin Geral' : 'Profissional'

  // Fecha o menu ao clicar em qualquer lugar fora dele ou ao pressionar Escape.
  // (Um overlay `fixed` não serve aqui: o `backdrop-blur` do header vira o bloco
  // de contenção de descendentes fixed, prendendo-o à altura do header.)
  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const goChangePassword = () => {
    setMenuOpen(false)
    router.push(profile === 'prof' ? '/admin/perfil/senha' : '/admin/recuperar-senha')
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3.5 border-b border-plum/7 bg-white/85 px-8 backdrop-blur-[12px]">
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-plum/60 transition-colors hover:bg-plum/5"
      >
        <PanelLeftIcon size={20} />
      </button>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-pill px-1.5 py-1"
        >
          <div className="text-right leading-tight">
            <div className="text-[13.5px] font-semibold text-plum">{user.name}</div>
            <div className="text-[11.5px] text-plum/50">{tipo}</div>
          </div>
          <ESAvatar name={user.name} size="sm" isBordered />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] z-[31] w-[236px] rounded-2xl border border-plum/6 bg-white p-2 shadow-modal">
            <div className="mb-1.5 border-b border-plum/6 px-3 pb-2.5 pt-2">
              <div className="text-[13.5px] font-semibold text-plum">{user.name}</div>
              <div className="truncate text-xs text-plum/50">{user.email}</div>
            </div>
            <MenuRow icon={<LockIcon size={18} />} label="Trocar senha" onClick={goChangePassword} />
            <MenuRow
              icon={<LogoutIcon size={18} />}
              label="Sair"
              danger
              onClick={() => {
                setMenuOpen(false)
                onLogout()
              }}
            />
          </div>
        )}
      </div>
    </header>
  )
}

function MenuRow({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left font-body text-sm font-medium transition-colors',
        danger ? 'text-red-alert hover:bg-red-alert/8' : 'text-plum/75 hover:bg-plum/[0.04]',
      )}
    >
      <span className={cn('inline-flex', danger ? 'text-red-alert' : 'text-plum/45')}>{icon}</span>
      {label}
    </button>
  )
}
