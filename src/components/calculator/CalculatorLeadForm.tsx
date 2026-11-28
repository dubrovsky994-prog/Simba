import { ChangeEvent, FormEvent, useState } from 'react'
import { IconCheck, IconCheckSmall } from '../icons'
import { CONTACT_TELEGRAM, CONTACT_TELEGRAM_URL } from '../../legal/content'
import { getStoredUtm } from '../../lib/audit/utm'
import { trackCalculatorEvent } from '../../lib/calculator/analytics'
import type { CalculationInputs, CalculationResult, NicheKey } from '../../lib/calculator/types'
import { nicheLabel } from '../../lib/calculator/questions'

type PreferredContact = 'telegram' | 'phone' | 'other'

const CONTACT_OPTIONS: { id: PreferredContact; label: string }[] = [
  { id: 'telegram', label: 'Telegram' },
  { id: 'phone', label: 'Телефон' },
  { id: 'other', label: 'Другой способ' },
]

type FormState = {
  name: string
  contact: string
  businessLink: string
  preferredContact: PreferredContact | null
  consent: boolean
  // Honeypot: left empty by real visitors, invisible and unreachable by keyboard.
  company: string
}

const INITIAL_STATE: FormState = {
  name: '',
  contact: '',
  businessLink: '',
  preferredContact: null,
  consent: false,
  company: '',
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const fieldWrapClass = (hasError: boolean) =>
  `flex h-[50px] items-center rounded-2xl border bg-white/70 shadow-[0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all duration-200 focus-within:border-accent/60 focus-within:shadow-[0_0_0_3px_rgba(var(--accent-rgb),0.16)] ${
    hasError ? 'border-red-400' : 'border-accent/20'
  }`

const inputClass =
  'h-full w-full rounded-2xl border-0 bg-transparent px-4 text-sm text-text-main placeholder:text-text-muted/70 outline-none'

type CalculatorLeadFormProps = {
  niche: NicheKey
  nicheCustomText: string
  inputs: CalculationInputs
  result: CalculationResult
  onReturnToResult: () => void
}

export default function CalculatorLeadForm({
  niche,
  nicheCustomText,
  inputs,
  result,
  onReturnToResult,
}: CalculatorLeadFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const handleChange =
    (field: 'name' | 'contact' | 'businessLink' | 'company') => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleConsentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, consent: e.target.checked }))
  }

  const nameError = submitAttempted && !form.name.trim()
  const contactError = submitAttempted && !form.contact.trim()
  const preferredContactError = submitAttempted && !form.preferredContact
  const consentError = submitAttempted && !form.consent

  const isOffline = typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!form.name.trim() || !form.contact.trim() || !form.preferredContact || !form.consent) {
      return
    }
    if (status === 'submitting') return

    setStatus('submitting')
    trackCalculatorEvent('calculator_lead_submit')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'calculator',
          name: form.name,
          contact: form.contact,
          preferredContact: form.preferredContact,
          businessLink: form.businessLink,
          pageUrl: window.location.href,
          company: form.company,
          niche: niche === 'custom' ? nicheCustomText : nicheLabel(niche),
          nicheCustom: niche === 'custom' ? nicheCustomText : '',
          answers: inputs,
          results: {
            lostLeads: result.lostLeads,
            cancellationLoss: result.cancellationLoss,
            manualCost: result.manualCost,
            totalBurden: result.totalBurden,
            conservative: result.conservative,
            realistic: result.realistic,
            potential: result.potential,
          },
          utm: getStoredUtm(),
          // Reached only after the guard above confirmed the checkbox is
          // checked — never send this as true without a real, current consent.
          consent: true,
        }),
      })

      if (!response.ok) throw new Error('Request failed')
      setStatus('success')
      trackCalculatorEvent('calculator_lead_success')
    } catch {
      setStatus('error')
      trackCalculatorEvent('calculator_lead_error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center rounded-[28px] border border-black/[0.04] bg-white/60 p-7 text-center shadow-[0_20px_50px_rgba(31,37,43,0.06)] sm:p-9">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
          <IconCheck className="h-7 w-7" />
        </div>
        <span className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-accent-dark">Заявка принята</span>
        <h3 className="mt-2 text-2xl font-semibold text-text-main">Спасибо!</h3>
        <p className="mt-3 max-w-sm text-sm leading-7 text-text-muted">
          Мы получили ваш расчёт и свяжемся с вами выбранным способом.
        </p>
        <button type="button" onClick={onReturnToResult} className="btn-secondary mt-5">
          Вернуться к результату
        </button>
      </div>
    )
  }

  return (
    <div className="animate-calc-expand rounded-[28px] border border-black/[0.04] bg-white/60 p-5 shadow-[0_20px_50px_rgba(31,37,43,0.06)] sm:p-7">
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="calc-lead-name" className="mb-1 block text-[13px] font-medium text-text-main">
              Имя
            </label>
            <div className={fieldWrapClass(nameError)}>
              <input
                id="calc-lead-name"
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Как к вам обращаться"
                aria-invalid={nameError}
                className={inputClass}
              />
            </div>
            {nameError && <p className="mt-1 text-[11px] text-red-500">Заполните это поле</p>}
          </div>

          <div>
            <label htmlFor="calc-lead-contact" className="mb-1 block text-[13px] font-medium text-text-main">
              Телефон или Telegram
            </label>
            <div className={fieldWrapClass(contactError)}>
              <input
                id="calc-lead-contact"
                type="text"
                value={form.contact}
                onChange={handleChange('contact')}
                placeholder="@username или удобный контакт"
                aria-invalid={contactError}
                className={inputClass}
              />
            </div>
            {contactError && <p className="mt-1 text-[11px] text-red-500">Заполните это поле</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="calc-lead-link" className="mb-1 block text-[13px] font-medium text-text-main">
              Ссылка на сайт, VK или другую страницу бизнеса <span className="font-normal text-text-muted">· необязательно</span>
            </label>
            <div className={fieldWrapClass(false)}>
              <input
                id="calc-lead-link"
                type="text"
                value={form.businessLink}
                onChange={handleChange('businessLink')}
                placeholder="Ссылка на ваш бизнес"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <fieldset className="mt-4">
          <legend className="mb-1.5 text-[13px] font-medium text-text-main">Предпочтительный способ связи</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-invalid={preferredContactError}>
            {CONTACT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={form.preferredContact === option.id}
                onClick={() => setForm((prev) => ({ ...prev, preferredContact: option.id }))}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none ${
                  form.preferredContact === option.id
                    ? 'border-accent bg-accent text-white'
                    : preferredContactError
                      ? 'border-red-400 bg-white text-text-main'
                      : 'border-accent/25 bg-white text-text-main hover:border-accent/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {preferredContactError && <p className="mt-1 text-[11px] text-red-500">Выберите способ связи</p>}
        </fieldset>

        {/* Honeypot — hidden from real visitors, invisible to screen readers, unreachable by keyboard. */}
        <div className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="calc-lead-hp">Компания (не заполнять)</label>
          <input
            id="calc-lead-hp"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={handleChange('company')}
          />
        </div>

        <label htmlFor="calc-lead-consent" className="mt-4 flex cursor-pointer items-start gap-2.5 text-[11.5px] leading-relaxed text-text-muted">
          <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
            <input
              id="calc-lead-consent"
              type="checkbox"
              checked={form.consent}
              onChange={handleConsentChange}
              aria-invalid={consentError}
              className="peer sr-only"
            />
            <span
              className={`h-5 w-5 rounded-[7px] border-2 transition-all duration-200 motion-reduce:transition-none ${
                form.consent
                  ? 'border-accent bg-gradient-to-br from-accent to-accent-dark'
                  : consentError
                    ? 'border-red-400 bg-white'
                    : 'border-accent/35 bg-white'
              } peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 peer-focus-visible:ring-offset-1`}
            />
            <IconCheckSmall
              className={`pointer-events-none absolute h-3.5 w-3.5 text-white transition-opacity duration-150 ${
                form.consent ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </span>
          <span>
            Я согласен на обработку моих персональных данных для обработки заявки и связи со мной. Я ознакомился с{' '}
            <a href="/privacy" className="text-accent-dark underline underline-offset-2 hover:text-accent">
              Политикой обработки персональных данных
            </a>
            .
          </span>
        </label>
        {consentError && <p className="ml-8 mt-1 text-[11px] text-red-500">Нужно подтвердить согласие</p>}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-primary mt-4 w-full bg-gradient-to-r from-accent to-accent-dark shadow-[0_10px_24px_rgba(0,183,200,0.28)] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        >
          {status === 'submitting' ? 'Отправляем…' : 'Отправить заявку'}
        </button>

        {status === 'error' && (
          <p className="mt-3 text-center text-[13px] leading-relaxed text-red-600">
            {isOffline ? 'Похоже, пропало подключение к интернету. ' : 'Не удалось отправить заявку. '}
            Ваш результат никуда не делся — попробуйте отправить ещё раз или напишите напрямую в Telegram:{' '}
            <a href={CONTACT_TELEGRAM_URL} className="font-semibold underline underline-offset-2">
              {CONTACT_TELEGRAM}
            </a>
            .
          </p>
        )}
      </form>
    </div>
  )
}
