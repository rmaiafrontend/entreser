'use client'

import { useRouter } from 'next/navigation'
import { HeroIconButton } from './plum-hero'
import { ArrowLeftIcon } from './icons'

/**
 * HeroBackButton — botão circular de "voltar" para a `topBar` dos heros.
 *
 * Volta no histórico quando há de onde voltar; cai no `fallback` quando a tela
 * foi aberta por link direto / refresh (sem histórico do app), evitando o botão
 * morto. Combine com `topBarClassName="lg:hidden"` no `PageHero`/`PlumHero` para
 * exibi-lo só no mobile (no desktop o header superior já dá a navegação).
 */
export function HeroBackButton({ fallback = '/home' }: { fallback?: string }) {
  const router = useRouter()
  const voltar = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back()
    else router.push(fallback)
  }
  return (
    <HeroIconButton aria-label="Voltar" onPress={voltar}>
      <ArrowLeftIcon />
    </HeroIconButton>
  )
}
