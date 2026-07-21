import { IconGoogle } from './icons'

interface GoogleButtonProps {
  onClick?: () => void
  isLoading?: boolean
  label?: string
}

/** Botão "Continuar com Google" no tema escuro das telas de auth. */
export function GoogleButton({
  onClick,
  isLoading,
  label = 'Continuar com Google',
}: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading || undefined}
      className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 py-3.5 text-sm font-medium text-cream transition-all hover:bg-white/10 active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100"
    >
      <IconGoogle />
      {isLoading ? 'Conectando…' : label}
    </button>
  )
}
