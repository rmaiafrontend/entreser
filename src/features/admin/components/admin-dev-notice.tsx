import Link from 'next/link'

interface AdminDevNoticeProps {
  descricao: string
  href: string
  cta: string
  titulo?: string
}

/**
 * Aviso de "modo demonstração" (tema claro). Como não há e-mail real no mock,
 * expõe o link com o token para concluir o fluxo manualmente. Some no backend
 * real — o token vai apenas no e-mail.
 */
export function AdminDevNotice({
  descricao,
  href,
  cta,
  titulo = 'Modo demonstração',
}: AdminDevNoticeProps) {
  return (
    <div className="rounded-input border border-dashed border-plum/20 bg-cream/50 p-3.5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-plum/50">
        {titulo}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-plum/50">{descricao}</p>
      <Link
        href={href}
        className="mt-1.5 inline-block text-sm font-medium text-mauve underline decoration-mauve/40 underline-offset-4 transition-colors hover:decoration-mauve"
      >
        {cta}
      </Link>
    </div>
  )
}
