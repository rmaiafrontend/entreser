'use client'

import { useCallback, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Dialog, ESButton } from '@/components/ui'
import { useLocalStorageBoolean } from '@/lib/use-local-storage'
import { useAdminAuth } from '@/features/admin/context/admin-auth-context'
import { BackofficeSidebar } from './backoffice-sidebar'
import { BackofficeTopbar } from './backoffice-topbar'
import { getActiveKey, type BackofficeProfile } from './backoffice-nav'

const COLLAPSE_KEY = 'bo-sidebar-collapsed'

/**
 * Casca do backoffice: Sidebar + Topbar + área de conteúdo, com fundo em
 * gradiente creme→rosé. Guarda o estado de recolhimento (persistido) e a
 * confirmação de logout. As páginas entram como `children` (podem ser Server
 * Components) — só a casca é cliente.
 */
export function BackofficeShell({ children }: { children: ReactNode }) {
  const { admin, signOut } = useAdminAuth()
  const pathname = usePathname()
  const router = useRouter()

  const [collapsed, setCollapsed] = useLocalStorageBoolean(COLLAPSE_KEY)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const toggleCollapse = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed, setCollapsed])

  const handleLogout = useCallback(async () => {
    setSigningOut(true)
    await signOut()
    router.replace('/admin/login')
  }, [signOut, router])

  if (!admin) return null

  const profile: BackofficeProfile = admin.perfil === 'AdminGeral' ? 'admin' : 'prof'
  const activeKey = getActiveKey(pathname)

  return (
    <div className="bg-backoffice flex min-h-screen">
      <BackofficeSidebar profile={profile} activeKey={activeKey} collapsed={collapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <BackofficeTopbar
          user={{ name: admin.nome, email: admin.email }}
          profile={profile}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          onLogout={() => setLogoutOpen(true)}
        />
        <main className="mx-auto w-full max-w-[1180px] flex-1 px-10 pb-14 pt-9">{children}</main>
      </div>

      <Dialog
        isOpen={logoutOpen}
        onClose={() => !signingOut && setLogoutOpen(false)}
        title="Sair do backoffice?"
        description="Sua sessão será encerrada e você voltará à tela de login."
        footer={
          <>
            <ESButton variant="ghost" onPress={() => setLogoutOpen(false)} isDisabled={signingOut}>
              Cancelar
            </ESButton>
            <ESButton variant="primary" onPress={handleLogout} isLoading={signingOut}>
              Sair
            </ESButton>
          </>
        }
      />
    </div>
  )
}
