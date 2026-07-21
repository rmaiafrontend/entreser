'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BackButton, ESButton, ESCard, InfoNote, PageHeader, PasswordInput } from '@/components/ui'
import { useAdminAuth } from '@/features/admin/context/admin-auth-context'
import { PasswordRequirements, passwordValid } from './password-requirements'

interface FormErrors {
  atual?: string
  nova?: string
  conf?: string
}

export function TrocarSenhaView() {
  const router = useRouter()
  const { signOut } = useAdminAuth()
  const [atual, setAtual] = useState('')
  const [nova, setNova] = useState('')
  const [conf, setConf] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    const e: FormErrors = {}
    if (!atual) e.atual = 'Informe sua senha atual.'
    else if (atual.toLowerCase() === 'errada') e.atual = 'Senha atual incorreta.'
    if (!passwordValid(nova)) e.nova = 'A nova senha não atende aos requisitos.'
    if (nova !== conf) e.conf = 'As senhas não coincidem.'
    setErrors(e)
    if (Object.keys(e).length) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setLoading(false)
    setDone(true)
  }

  const entrarNovamente = async () => {
    await signOut()
    router.replace('/admin/login')
  }

  if (done) {
    return (
      <div>
        <BackButton href="/admin/perfil" label="Voltar para meu perfil" />
        <PageHeader title="Senha alterada" />
        <ESCard variant="solid" isHoverable={false}>
          <div className="px-8 py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-pill bg-success-light text-success-dark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="font-display text-[22px] text-plum">Senha alterada com sucesso</h3>
            <p className="mx-auto mt-2 max-w-[420px] text-sm leading-relaxed text-plum/60">
              Por segurança, suas outras sessões foram encerradas. Você precisará entrar novamente com a nova senha.
            </p>
            <div className="mt-5">
              <ESButton variant="primary" onPress={entrarNovamente}>
                Entrar novamente
              </ESButton>
            </div>
          </div>
        </ESCard>
      </div>
    )
  }

  return (
    <div>
      <BackButton href="/admin/perfil" label="Voltar para meu perfil" />
      <PageHeader
        breadcrumb={[{ label: 'Meu perfil', href: '/admin/perfil' }, { label: 'Trocar senha' }]}
        title="Trocar senha"
        description="Atualize sua senha de acesso ao painel."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.5fr_1fr] md:items-start">
        <ESCard variant="solid" isHoverable={false}>
          <div className="flex flex-col gap-[18px] p-[26px]">
            <PasswordInput
              label="Senha atual"
              value={atual}
              onChange={(v) => { setAtual(v); setErrors((e) => ({ ...e, atual: undefined })) }}
              placeholder="Sua senha atual"
              errorMessage={errors.atual}
              autoFocus
            />
            <div>
              <PasswordInput
                label="Nova senha"
                value={nova}
                onChange={(v) => { setNova(v); setErrors((e) => ({ ...e, nova: undefined })) }}
                placeholder="Crie uma nova senha"
                errorMessage={errors.nova}
              />
              <div className="mt-2.5">
                <PasswordRequirements value={nova} />
              </div>
            </div>
            <PasswordInput
              label="Confirmar nova senha"
              value={conf}
              onChange={(v) => { setConf(v); setErrors((e) => ({ ...e, conf: undefined })) }}
              placeholder="Repita a nova senha"
              errorMessage={errors.conf}
            />
            <div className="mt-0.5 flex items-center justify-between gap-2.5">
              <Link href="/admin/recuperar-senha" className="text-[13px] text-mauve hover:text-mauve-dark">
                Esqueci minha senha
              </Link>
              <ESButton variant="primary" isLoading={loading} onPress={submit}>
                Confirmar nova senha
              </ESButton>
            </div>
          </div>
        </ESCard>

        <InfoNote>
          Ao trocar a senha, <strong>todas as suas sessões ativas são encerradas</strong> e você precisará entrar
          novamente. Se preferir, use o link “Esqueci minha senha” para redefinir por e-mail.
        </InfoNote>
      </div>
    </div>
  )
}
