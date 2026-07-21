import { HomeIcon, ConteudosIcon, TrilhasIcon, FasesIcon } from '@/components/ui'
import type { BottomNavItem } from '../ui'

/**
 * Navegação inferior do app da Usuária — SÓ as áreas do M05 (Início, Feed,
 * Trilhas, Minha fase). Abas de outros módulos (Social, Agendar, Diário, Perfil)
 * entram aqui quando esses módulos forem construídos, sem tocar no shell.
 */
export const USUARIA_NAV: BottomNavItem[] = [
  { key: 'home', label: 'Início', href: '/home', icon: <HomeIcon /> },
  { key: 'feed', label: 'Feed', href: '/feed', icon: <ConteudosIcon /> },
  { key: 'trilhas', label: 'Trilhas', href: '/trilhas', icon: <TrilhasIcon /> },
  { key: 'fase', label: 'Minha fase', href: '/fase', icon: <FasesIcon /> },
]

/** Rotas full-screen que escondem a BottomNav (leitor e onboarding). */
export const NAV_HIDDEN_PREFIXES = ['/onboarding', '/conteudos/']
