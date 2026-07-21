'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ESAvatar, LogoutIcon, ChevronDownIcon } from '@/components/ui'
import { useAuth } from '@/features/auth/context/auth-context'
import { getActiveKey, BellIcon } from '../ui'
import { USUARIA_NAV } from './usuaria-nav'

/**
 * UsuariaHeader — navegação SUPERIOR do app da Usuária no desktop (lg+): barra
 * full-width colada no topo (sticky, borda inferior). Marca na ponta esquerda,
 * links do M05 centralizados (pílulas) e o menu de conta na ponta direita. No
 * mobile fica oculta — a BottomNav assume. Reusa `USUARIA_NAV` e a mesma lógica
 * de item ativo da BottomNav.
 */
export function UsuariaHeader() {
  const pathname = usePathname()
  const active = getActiveKey(USUARIA_NAV, pathname)
  const { user, signOut } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await signOut()
    router.replace('/login')
  }

  return (
    <header className="sticky top-0 z-40 hidden border-b border-plum/8 bg-white/80 backdrop-blur-xl lg:block">
      <div className="relative flex h-16 w-full items-center px-6 lg:px-8">
        {/* Marca (esquerda) */}
        <Link href="/home" aria-label="Início" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/marca-entreser-plum.png" alt="Entre Ser" className="h-7 w-auto" />
        </Link>

        {/* Navegação (centralizada) */}
        <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
          {USUARIA_NAV.map((item) => {
            const isActive = item.key === active
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition-es [&>svg]:h-[18px] [&>svg]:w-[18px]',
                  isActive
                    ? 'bg-mauve-ghost font-medium text-mauve-dark'
                    : 'text-plum/55 hover:bg-plum/5 hover:text-plum',
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Notificações + conta (direita) */}
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <NotificationsMenu />
          <AccountMenu nome={user?.nome} email={user?.email} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  )
}

/** Fecha um popover ao clicar fora do `ref` ou pressionar Esc. */
function useDismiss(open: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, ref, onClose])
}

/** Sino de notificações — botão circular com indicador de novidades, abrindo um
 *  painel. O feed de notificações não faz parte do M05, então o painel exibe um
 *  estado vazio acolhedor; o indicador segue o design pedido para o header. */
function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(open, ref, () => setOpen(false))

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Notificações"
        className={cn(
          'relative flex h-10 w-10 items-center justify-center rounded-full border border-plum/12 text-plum/55 transition-es hover:border-plum/20 hover:bg-plum/5 hover:text-plum',
          open && 'border-plum/20 bg-plum/5 text-plum',
        )}
      >
        <BellIcon size={20} />
        {/* Indicador de novidades */}
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-mauve ring-2 ring-white" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-plum/8 bg-white shadow-modal"
        >
          <div className="flex items-center justify-between border-b border-plum/8 px-4 py-3.5">
            <p className="text-sm font-medium text-plum">Notificações</p>
          </div>
          <div className="px-6 py-10 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-mauve-ghost text-mauve">
              <BellIcon size={20} />
            </span>
            <p className="mt-3 text-sm font-medium text-plum">Você está em dia</p>
            <p className="mt-1 text-xs leading-relaxed text-plum/45">
              Novas atividades e lembretes aparecem aqui.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/** Menu de conta — chip (avatar + nome + chevron) que abre um dropdown com as
 *  informações da usuária e a ação de sair. Fecha ao clicar fora ou com Esc. */
function AccountMenu({ nome, email, onLogout }: { nome?: string; email?: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(open, ref, () => setOpen(false))

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'flex items-center gap-2.5 rounded-full border border-plum/12 py-1 pl-1 pr-2.5 transition-es hover:border-plum/20 hover:bg-plum/5',
          open && 'border-plum/20 bg-plum/5',
        )}
      >
        <ESAvatar name={nome} size="sm" />
        <span className="max-w-[150px] truncate text-sm font-medium text-plum">{nome ?? 'Você'}</span>
        <ChevronDownIcon size={16} className={cn('text-plum/40 transition-es', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-plum/8 bg-white shadow-modal"
        >
          <div className="flex items-center gap-3 border-b border-plum/8 px-4 py-3.5">
            <ESAvatar name={nome} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-plum">{nome ?? 'Você'}</p>
              {email && <p className="truncate text-xs text-plum/45">{email}</p>}
            </div>
          </div>
          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-plum/70 transition-es hover:bg-plum/5 hover:text-plum [&>svg]:h-[18px] [&>svg]:w-[18px]"
            >
              <LogoutIcon />
              Sair da conta
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
