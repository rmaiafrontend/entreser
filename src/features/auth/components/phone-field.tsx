'use client'

import { forwardRef, type ChangeEvent } from 'react'
import { formatarTelefoneBR } from '../lib/format'
import { AuthField } from './auth-field'
import { IconPhone } from './icons'

interface PhoneFieldProps {
  label?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  name?: string
  error?: string
  placeholder?: string
}

/**
 * Campo de telefone com máscara brasileira `(XX) XXXXX-XXXX`, aplicada
 * enquanto a usuária digita.
 *
 * Componente controlado: o valor guardado é a string já mascarada — o schema
 * Zod e o serviço normalizam para apenas dígitos. Reaproveita o visual do
 * `AuthField` e integra com o react-hook-form via `Controller`.
 */
export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  function PhoneField(
    {
      label = 'Telefone',
      value,
      onChange,
      onBlur,
      name,
      error,
      placeholder = '(83) 99999-9999',
    },
    ref,
  ) {
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      onChange(formatarTelefoneBR(e.target.value))
    }

    return (
      <AuthField
        ref={ref}
        label={label}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={15}
        placeholder={placeholder}
        icon={<IconPhone />}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        error={error}
      />
    )
  },
)
