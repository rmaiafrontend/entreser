import { HomeView } from '@/features/usuaria/home/home-view'

/**
 * `/home` — landing do app da Usuária (destino do login). O `OnboardingGate`
 * (no layout) intercepta e manda para `/onboarding` quem ainda não tem fase.
 */
export default function HomePage() {
  return <HomeView />
}
