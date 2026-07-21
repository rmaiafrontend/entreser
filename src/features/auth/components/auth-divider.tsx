interface AuthDividerProps {
  label?: string
}

/** Divisor "ou" entre o formulário e o login social. */
export function AuthDivider({ label = 'ou' }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-3" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-white/10" />
      <span className="text-xs text-cream/30">{label}</span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  )
}
