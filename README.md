# Entre Ser — App (Next.js)

Recriação do app **Entre Ser** em Next.js (App Router) com TypeScript, focada
no **módulo de Autenticação** (spec M01 · Cadastro e Acesso).

Esta etapa é **frontend-only**: toda a UX de auth funciona de ponta a ponta
contra uma camada de serviço tipada com implementação **mock** (sem backend
real). O mock é um "seam" — trocá-lo por Supabase, API própria, etc. não exige
mudar nenhuma tela.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript estrito)
- **Tailwind CSS v4** (tokens em `globals.css`)
- **Zod** (validação compartilhada) + **react-hook-form**
- Fontes: **Cormorant Garamond** (display) + **Onest** (corpo)

## Rodando

```bash
npm install
npm run dev      # http://localhost:3000  → redireciona para /login
```

### Conta de demonstração (semente)

Já existe uma usuária ativa para testar o login imediatamente:

- **E-mail:** `maria@entreser.com.br`
- **Senha:** `Entre123`

> Como não há envio de e-mail real, os fluxos de **confirmação** e
> **recuperação de senha** mostram um bloco "Modo demonstração" com o link/token
> para concluir o fluxo manualmente. Em produção, o token vai apenas no e-mail.
> O "banco" mock vive no `localStorage` — limpe-o para resetar o estado.

## Escopo desta etapa

Perfil **Usuária**, frontend-only. Fluxos implementados (spec M01):

| Fluxo | Tela |
|---|---|
| F1 Cadastro e-mail/senha | `/cadastro` |
| F2 Cadastro Google + complemento | botão Google · `/completar-cadastro` |
| F3 Confirmação de e-mail | `/confirmar-email?token=` |
| F4 Login | `/login` |
| F5 Login Google | botão Google |
| F6 Recuperação de senha | `/recuperar-senha` |
| F7 Redefinição de senha | `/redefinir-senha?token=` |
| F8 Sessão (access token simulado) | — |
| F9 Logout | `/home` |

**Fora do escopo** (fases futuras): backend real (DB/JWT/hash/e-mail/OAuth),
perfis Profissional e AdminGeral (F10–F13), painel admin, rate limiting,
endpoints LGPD, e a tela de onboarding de "fase" (apenas removida do cadastro).

## Arquitetura (auth)

```
src/
├── app/
│   ├── (auth)/        páginas públicas (tema escuro)
│   └── (app)/         rotas autenticadas (guard no cliente)
├── features/auth/
│   ├── components/    formulários e UI do tema escuro
│   ├── schemas/       validação Zod (client + server no futuro)
│   ├── services/      AuthService (interface) + MockAuthService
│   ├── context/       AuthProvider / useAuth
│   ├── hooks/         useGoogleSignIn
│   └── lib/           erros padronizados
└── lib/               fonts, cn()
```

**Trocar o backend:** editar apenas `src/features/auth/services/index.ts`.
# entreser
