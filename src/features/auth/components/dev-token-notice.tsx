import Link from 'next/link'

interface DevTokenNoticeProps {
  descricao: string
  href: string
  cta: string
  titulo?: string
}

/**
 * Aviso de "modo demonstração".
 *
 * Como o backend é mockado (frontend-only) e não há envio de e-mail real, este
 * bloco expõe o link com o token para que o fluxo (confirmação / redefinição)
 * possa ser concluído manualmente. Num backend real, este componente some — o
 * token chega apenas no e-mail.
 */
export function DevTokenNotice({
  descricao,
  href,
  cta,
  titulo = 'Modo demonstração',
}: DevTokenNoticeProps) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-cream/20 bg-cream/5 p-4 text-left">
      <p className="text-[11px] font-medium uppercase tracking-wider text-cream/50">
        {titulo}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-cream/45">{descricao}</p>
      <Link
        href={href}
        className="mt-2 inline-block text-sm font-medium text-cream underline decoration-cream/40 underline-offset-4 transition-colors hover:decoration-cream"
      >
        {cta}
      </Link>
    </div>
  )
}
