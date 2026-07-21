import type { NextConfig } from 'next'

/**
 * Proxy same-origin para o backend Spring Boot em desenvolvimento.
 *
 * Mantém app e API sob a MESMA origem (localhost:3000) para que o cookie de
 * refresh (HttpOnly, SameSite=Lax, Path=/api/v1/auth) seja enviado nas chamadas
 * a `/auth/refresh` e `/auth/logout`. Sem o proxy, o browser em localhost:3000
 * falaria cross-site com api.entreser.sw3.tec.br e o cookie Lax não viajaria.
 * Em produção, sirva app e API same-site (mesmo registrable domain) e o proxy
 * deixa de ser necessário.
 *
 *   /api/*                    → REST autenticado (/api/v1/...)
 *   /oauth2/authorization/*   → início do fluxo OAuth2 (SEM /api/v1)
 *   /usuaria/*                → rotas legadas da paciente (SEM /api/v1)
 *
 * `/oauth2/redirect` NÃO é reescrito de propósito: é uma rota real do App Router
 * que captura o `?token=` devolvido pelo backend.
 */
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN ?? 'https://api.entreser.sw3.tec.br'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${BACKEND_ORIGIN}/api/:path*` },
      {
        source: '/oauth2/authorization/:path*',
        destination: `${BACKEND_ORIGIN}/oauth2/authorization/:path*`,
      },
      { source: '/usuaria/:path*', destination: `${BACKEND_ORIGIN}/usuaria/:path*` },
    ]
  },
}

export default nextConfig
