import type { ReactNode } from 'react'
import { AdminAuthProvider } from '@/features/admin/context/admin-auth-context'

/**
 * Provê o contexto de auth do backoffice a toda a subárvore /admin.
 * A tipografia de display do backoffice é a mesma do produto (Cormorant
 * Garamond, `--font-display`), injetada no layout raiz.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>
}
