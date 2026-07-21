import { redirect } from 'next/navigation'

/**
 * Raiz do app. Nesta etapa (apenas auth) não há landing institucional, então
 * redirecionamos direto para o login. Quando a landing entrar, este redirect
 * dá lugar a ela.
 */
export default function Home() {
  redirect('/login')
}
