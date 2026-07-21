'use client'

import {
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  I18nProvider,
  Label,
} from '@heroui/react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { IconCalendar, IconChevronDown } from './icons'

interface BirthDateFieldProps {
  label: string
  /** Valor em ISO 8601 (YYYY-MM-DD); string vazia quando ainda não preenchido. */
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  name?: string
}

/** ISO (YYYY-MM-DD) → DateValue do HeroUI, tolerando valor vazio/incompleto. */
function isoParaDateValue(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  try {
    return parseDate(iso)
  } catch {
    return null
  }
}

/**
 * Data de nascimento no tema escuro das telas de auth.
 *
 * Usa o DatePicker do HeroUI (calendário com seletor rápido de ano — útil
 * para datas distantes), mas expõe uma API simples de string ISO para casar
 * com o schema Zod e o react-hook-form (via `Controller`). O campo replica o
 * visual glassmorphic dos demais `AuthField`; o calendário é escuro on-brand
 * (tema definido em globals.css). Datas futuras ficam bloqueadas no próprio
 * picker; a idade mínima (18) continua validada pelo schema.
 */
export function BirthDateField({
  label,
  value,
  onChange,
  onBlur,
  error,
  name,
}: BirthDateFieldProps) {
  const maxValue = today(getLocalTimeZone())
  // Abre o calendário perto de uma data de nascimento plausível, não no mês atual.
  const placeholderValue = maxValue.subtract({ years: 25 }).set({ month: 1, day: 1 })

  // Permite abrir o calendário clicando em qualquer ponto do campo (e não só na
  // setinha), preservando o clique nos segmentos editáveis (dd/mm/aaaa) p/ digitar.
  const triggerRef = useRef<HTMLButtonElement>(null)
  function abrirAoClicarNoCampo(e: React.MouseEvent<HTMLDivElement>) {
    const alvo = e.target as HTMLElement
    if (alvo.closest('[data-slot="date-picker-trigger"]')) return
    const seg = alvo.closest('[data-slot="date-input-group-segment"]')
    if (seg && seg.getAttribute('data-type') !== 'literal') return
    triggerRef.current?.click()
  }

  return (
    <I18nProvider locale="pt-BR">
      <DatePicker
        name={name}
        aria-label={label}
        value={isoParaDateValue(value)}
        onChange={(date) => onChange(date ? date.toString() : '')}
        maxValue={maxValue}
        placeholderValue={placeholderValue}
        isInvalid={Boolean(error)}
        shouldForceLeadingZeros
        className="flex w-full flex-col gap-0"
      >
        <Label className="mb-2 block w-fit text-[11px] font-medium uppercase tracking-wider text-cream/40">
          {label}
        </Label>

        <DateField.Group
          fullWidth
          onBlur={onBlur}
          onClick={abrirAoClicarNoCampo}
          className={cn(
            'flex h-auto cursor-pointer items-center gap-3 rounded-2xl border bg-white/10 px-4 py-3.5 shadow-none outline-none backdrop-blur-sm transition-all',
            'focus-within:bg-white/15 focus-within:ring-0',
            error
              ? 'border-mauve-soft/60'
              : 'border-white/10 focus-within:border-cream/30',
          )}
        >
          <DateField.Prefix className="mx-0 shrink-0 text-cream/30">
            <IconCalendar />
          </DateField.Prefix>

          <DateField.Input className="flex flex-1 gap-px px-0 py-0 text-sm text-cream">
            {(segment) => (
              <DateField.Segment
                segment={segment}
                className="rounded-md px-0.5 text-cream data-[placeholder=true]:text-cream/30"
              />
            )}
          </DateField.Input>

          <DateField.Suffix className="mx-0 shrink-0">
            <DatePicker.Trigger
              ref={triggerRef}
              aria-label="Abrir calendário"
              className="w-auto p-0 text-cream/40 transition-colors hover:text-cream/70"
            >
              <DatePicker.TriggerIndicator className="size-4 text-current">
                <IconChevronDown />
              </DatePicker.TriggerIndicator>
            </DatePicker.Trigger>
          </DateField.Suffix>
        </DateField.Group>

        {error && (
          <FieldError className="mt-1.5 px-0 text-xs font-medium text-mauve-soft">
            {error}
          </FieldError>
        )}

        <DatePicker.Popover
          placement="bottom start"
          className="w-auto min-w-0 border border-white/10 text-cream"
        >
          <Calendar aria-label={label} className="w-64">
            <Calendar.Header>
              <Calendar.YearPickerTrigger>
                <Calendar.YearPickerTriggerHeading />
                <Calendar.YearPickerTriggerIndicator />
              </Calendar.YearPickerTrigger>
              <Calendar.NavButton slot="previous" />
              <Calendar.NavButton slot="next" />
            </Calendar.Header>

            <Calendar.Grid>
              <Calendar.GridHeader>
                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
              </Calendar.GridHeader>
              <Calendar.GridBody>
                {(date) => <Calendar.Cell date={date} />}
              </Calendar.GridBody>
            </Calendar.Grid>

            <Calendar.YearPickerGrid>
              <Calendar.YearPickerGridBody>
                {({ year }) => <Calendar.YearPickerCell year={year} />}
              </Calendar.YearPickerGridBody>
            </Calendar.YearPickerGrid>
          </Calendar>
        </DatePicker.Popover>
      </DatePicker>
    </I18nProvider>
  )
}
