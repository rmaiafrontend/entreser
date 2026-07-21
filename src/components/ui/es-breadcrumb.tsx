import Link from 'next/link'
import { Fragment } from 'react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface ESBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * ESBreadcrumb — trilha de localização; o último item é a página atual.
 * Itens com href (exceto o último) viram links via next/link.
 */
export function ESBreadcrumb({ items, className }: ESBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 text-sm', className)}>
      {items.map((it, i) => {
        const last = i === items.length - 1
        const isLink = it.href && !last
        return (
          <Fragment key={i}>
            {isLink ? (
              <Link href={it.href!} className="text-plum/60 hover:text-mauve">
                {it.label}
              </Link>
            ) : (
              <span className={last ? 'font-medium text-plum' : 'text-plum/60'}>{it.label}</span>
            )}
            {!last && (
              <span aria-hidden className="text-plum/30">
                /
              </span>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
