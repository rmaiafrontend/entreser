import { AdminHome } from '@/features/admin/components/admin-home'

/**
 * Home do backoffice (/admin) — renderizada dentro da casca (ver o layout do
 * grupo (protected)). O conteúdo vive no componente de feature AdminHome.
 */
export default function AdminHomePage() {
  return <AdminHome />
}
