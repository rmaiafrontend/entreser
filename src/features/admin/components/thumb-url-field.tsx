'use client'

import { ImageIcon, TextInput } from '@/components/ui'

interface ThumbUrlFieldProps {
  value: string | null
  onChange: (v: string | null) => void
  label?: string
}

/**
 * Campo de CAPA por URL externa (ES-014).
 *
 * O upload por arquivo gerava um data URI base64 e mostrava "Capa enviada." — mas
 * o backend REJEITA imagens embutidas em base64 (API §11.3), `thumbUrl` é
 * VARCHAR(500) e o endpoint de upload responde 501. Ou seja: não havia caminho
 * válido para subir capa, e a UI prometia o que não entregava (preview + toast de
 * sucesso, dado descartado ao salvar).
 *
 * Enquanto o upload real não existe (ES-010), este campo usa o caminho que o
 * próprio backend documenta — "hospedar externamente e usar URL": a pessoa cola a
 * URL de uma imagem já hospedada, que cabe em 500 chars e é aceita pelo servidor.
 * Nada de base64, nada de toast de sucesso falso. Quando o upload real chegar,
 * basta trocar este componente de volta por um uploader.
 */
export function ThumbUrlField({ value, onChange, label = 'Capa (opcional)' }: ThumbUrlFieldProps) {
  const url = value ?? ''
  const temPreview = /^https?:\/\//i.test(url)

  return (
    <div className="flex flex-col gap-1.5">
      <TextInput
        label={label}
        type="url"
        placeholder="https://…/imagem.jpg"
        value={url}
        onChange={(v) => {
          const limpo = v.trim()
          onChange(limpo ? limpo : null)
        }}
        startContent={<ImageIcon size={16} />}
      />
      {temPreview && (
        <div
          className="relative aspect-video overflow-hidden rounded-[14px] bg-cream bg-cover bg-center"
          style={{ backgroundImage: `url("${url}")` }}
        />
      )}
      <p className="text-xs leading-relaxed text-plum/45">
        O upload de arquivo de capa ainda não está disponível. Cole a URL de uma imagem
        já hospedada (link direto para .jpg, .png ou .webp).
      </p>
    </div>
  )
}
