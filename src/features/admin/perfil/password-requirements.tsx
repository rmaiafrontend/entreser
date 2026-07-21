import { cn } from '@/lib/utils'

function checks(v: string) {
  return { len: v.length >= 8, upper: /[A-Z]/.test(v), lower: /[a-z]/.test(v), num: /[0-9]/.test(v) }
}

/** Retorna true se a senha atende a todos os requisitos. */
export function passwordValid(v: string): boolean {
  const c = checks(v)
  return c.len && c.upper && c.lower && c.num
}

/** Grade de requisitos da senha (verde quando atendido). */
export function PasswordRequirements({ value }: { value: string }) {
  const c = checks(value)
  const items: Array<[string, boolean]> = [
    ['Mínimo 8 caracteres', c.len],
    ['Uma maiúscula', c.upper],
    ['Uma minúscula', c.lower],
    ['Um número', c.num],
  ]
  return (
    <ul className="mt-0.5 grid list-none grid-cols-2 gap-x-3 gap-y-1 p-0">
      {items.map(([label, ok]) => (
        <li key={label} className={cn('flex items-center gap-1.5 text-xs', ok ? 'text-success-dark' : 'text-plum/45')}>
          <span className="inline-flex w-3.5">
            {ok ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <circle cx="12" cy="12" r="9" />
              </svg>
            )}
          </span>
          {label}
        </li>
      ))}
    </ul>
  )
}
