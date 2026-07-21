import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getNavGroups, type BackofficeProfile, type NavItem } from './backoffice-nav'

interface BackofficeSidebarProps {
  profile: BackofficeProfile
  activeKey: string | null
  collapsed: boolean
}

/**
 * Sidebar do backoffice — navegação agrupada por perfil, item ativo em pílula
 * mauve-ghost. Recolhível (74px) mostrando só ícones. Presentational: recebe o
 * estado de colapso e a rota ativa do Shell.
 */
export function BackofficeSidebar({ profile, activeKey, collapsed }: BackofficeSidebarProps) {
  const groups = getNavGroups(profile)
  return (
    <aside
      className="sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden border-r border-plum/8 bg-white transition-[width] duration-200 ease-[cubic-bezier(0,0,0.2,1)]"
      style={{ width: collapsed ? 74 : 256 }}
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-plum/6',
          collapsed ? 'justify-center px-0' : 'px-6',
        )}
      >
        {collapsed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/brand/logo-icon.svg" alt="entre ser" className="block h-9.5 w-9.5" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/brand/marca-entreser-plum.png" alt="entre ser" className="block w-[152px] max-w-full" />
        )}
      </div>

      <nav className={cn('flex-1 overflow-y-auto overflow-x-hidden', collapsed ? 'px-3 py-3.5' : 'px-3.5 py-4')}>
        {groups.map((g, gi) => (
          <div key={g.section} className={collapsed ? 'mb-3' : 'mb-5'}>
            {collapsed ? (
              gi > 0 && <div className="mx-1.5 mb-3 h-px bg-plum/7" />
            ) : (
              <p className="mb-1.5 px-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-plum/35">
                {g.section}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {g.items.map((it) => (
                <SidebarItem key={it.key} item={it} active={activeKey === it.key} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

function SidebarItem({
  item,
  active,
  collapsed,
}: {
  item: NavItem
  active: boolean
  collapsed: boolean
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-[11px] rounded-xl font-body text-sm transition-colors duration-150',
        collapsed ? 'justify-center py-2.5' : 'px-3 py-[9px]',
        active
          ? 'bg-mauve-ghost font-semibold text-mauve-dark'
          : 'font-medium text-plum/70 hover:bg-plum/[0.04]',
      )}
    >
      <span className={cn('inline-flex', active ? 'text-mauve' : 'text-plum/45')}>
        <Icon size={19} />
      </span>
      {!collapsed && item.label}
    </Link>
  )
}
