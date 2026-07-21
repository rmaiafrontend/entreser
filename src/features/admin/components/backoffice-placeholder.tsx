import { ESCard, PageHeader } from '@/components/ui'

interface BackofficePlaceholderProps {
  title: string
  description?: string
  /** Rótulo da fase em que esta área será desenhada (ex.: "Fase 1"). */
  phase: string
}

/**
 * Placeholder on-design para áreas ainda não implementadas. A casca e a
 * navegação já funcionam; a tela interna chega na fase indicada.
 */
export function BackofficePlaceholder({ title, description, phase }: BackofficePlaceholderProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <ESCard isHoverable={false}>
        <div className="px-8 py-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-pill bg-cream-mid text-mauve">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4l3 2" />
            </svg>
          </div>
          <h3 className="font-display text-[22px] text-plum">Área em construção</h3>
          <p className="mx-auto mt-2 max-w-[420px] text-[14.5px] leading-relaxed text-plum/60">
            Esta área será desenhada na <strong className="text-mauve">{phase}</strong>. A casca e a
            navegação já estão prontas — as telas internas chegam nas próximas fases.
          </p>
        </div>
      </ESCard>
    </div>
  )
}
