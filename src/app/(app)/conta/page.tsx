import { ContaView } from '@/features/usuaria/conta'

/**
 * `/conta` — área "Minha conta" da Usuária (dados + sair). Único ponto de logout
 * no mobile (aba "Conta" da BottomNav); isento do OnboardingGate para ser sempre
 * acessível como saída da conta.
 */
export default function ContaPage() {
  return <ContaView />
}
