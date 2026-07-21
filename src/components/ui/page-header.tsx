import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ESBreadcrumb, type BreadcrumbItem } from './es-breadcrumb'

export interface PageHeaderProps {
  breadcrumb?: BreadcrumbItem[]
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  /** Ação à direita do título (ex.: botão primário). */
  action?: ReactNode
  className?: string
}

/**
 * PageHeader — cabeçalho de página do backoffice
 * (breadcrumb + eyebrow + título display + descrição + ação).
 */
export function PageHeader({
  breadcrumb,
  eyebrow,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 flex flex-col gap-2.5', className)}>
      {breadcrumb && breadcrumb.length > 0 && <ESBreadcrumb items={breadcrumb} />}
      {eyebrow && <span className="text-eyebrow text-mauve">{eyebrow}</span>}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <h1 className="font-display text-[34px] font-normal leading-[1.1] text-plum">{title}</h1>
          {description && <p className="mt-2 max-w-[620px] text-[15px] text-plum/60">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
