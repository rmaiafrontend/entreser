'use client'

import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import {
  TextInput,
  type TextInputProps,
  PhoneInput,
  type PhoneInputProps,
  SelectInput,
  type SelectInputProps,
  TextareaInput,
  type TextareaInputProps,
  CheckboxInput,
  type CheckboxInputProps,
} from '@/components/ui'

/**
 * Controles de formulário do backoffice ligados ao react-hook-form.
 *
 * Fazem a ponte entre a API `onChange(value)` da biblioteca de UI e o
 * react-hook-form via `useController` — assim as telas compõem forms
 * validados (Zod) usando os componentes da lib, sem markup ad-hoc.
 */

interface Bind<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
}

export function RHFTextInput<T extends FieldValues>({
  control,
  name,
  ...rest
}: Bind<T> & Omit<TextInputProps, 'value' | 'onChange' | 'errorMessage' | 'name'>) {
  const { field, fieldState } = useController({ control, name })
  return (
    <TextInput
      {...rest}
      name={name}
      value={(field.value as string | undefined) ?? ''}
      onChange={field.onChange}
      errorMessage={fieldState.error?.message}
    />
  )
}

export function RHFPhoneInput<T extends FieldValues>({
  control,
  name,
  ...rest
}: Bind<T> & Omit<PhoneInputProps, 'value' | 'onChange' | 'errorMessage' | 'name'>) {
  const { field, fieldState } = useController({ control, name })
  return (
    <PhoneInput
      {...rest}
      name={name}
      value={(field.value as string | undefined) ?? ''}
      onChange={field.onChange}
      errorMessage={fieldState.error?.message}
    />
  )
}

export function RHFSelectInput<T extends FieldValues>({
  control,
  name,
  ...rest
}: Bind<T> & Omit<SelectInputProps, 'selectedKey' | 'onChange' | 'errorMessage' | 'name'>) {
  const { field, fieldState } = useController({ control, name })
  return (
    <SelectInput
      {...rest}
      name={name}
      selectedKey={(field.value as string | undefined) ?? ''}
      onChange={field.onChange}
      errorMessage={fieldState.error?.message}
    />
  )
}

export function RHFTextarea<T extends FieldValues>({
  control,
  name,
  ...rest
}: Bind<T> & Omit<TextareaInputProps, 'value' | 'onChange' | 'errorMessage' | 'name'>) {
  const { field, fieldState } = useController({ control, name })
  return (
    <TextareaInput
      {...rest}
      name={name}
      value={(field.value as string | undefined) ?? ''}
      onChange={field.onChange}
      errorMessage={fieldState.error?.message}
    />
  )
}

export function RHFCheckbox<T extends FieldValues>({
  control,
  name,
  ...rest
}: Bind<T> & Omit<CheckboxInputProps, 'isSelected' | 'onChange'>) {
  const { field } = useController({ control, name })
  return <CheckboxInput {...rest} isSelected={!!field.value} onChange={field.onChange} />
}
