import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react'
import WaveLines from './WaveLines'
import IdeaOptionCard from './idea/IdeaOptionCard'
import IdeaProgress from './idea/IdeaProgress'
import { IconArrowRight, IconCheck, IconCheckSmall } from './icons'
import { CONTACT_TELEGRAM, CONTACT_TELEGRAM_URL } from '../legal/content'
import { getStoredUtm } from '../lib/audit/utm'
import { trackIdeaEvent } from '../lib/idea/analytics'
import {
  CUSTOM_OPTION_ID,
  PROJECT_STAGE_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  TARGET_AUDIENCE_OPTIONS,
  resolveOptionLabel,
} from '../lib/idea/questions'
import { EMPTY_IDEA_ANSWERS, type IdeaAnswers, type StepAnswer } from '../lib/idea/types'

const TOTAL_STEPS = 4

const WHAT_YOU_GET = [
  { number: '01', title: 'Структуру идеи', text: 'Что именно должен делать продукт.' },
  { number: '02', title: 'MVP', text: 'Что действительно нужно сделать в первой версии.' },
  { number: '03', title: 'Сценарий пользователя', text: 'Как человек будет пользоваться продуктом.' },
  { number: '04', title: 'План реализации', text: 'Какие этапы нужны для запуска.' },
  { number: '05', title: 'Ориентир по стоимости', text: 'Без попытки продать лишнее.' },
]

const SUCCESS_STEPS = ['Разберём идею', 'Определим MVP', 'Предложим механику', 'Оценим первый этап']

const FLOW_LABELS = ['Идея', 'Разбор', 'MVP', 'Продукт']

type ContactState = {
  name: string
  contact: string
  email: string
  consent: boolean
  // Honeypot: left empty by real visitors, invisible and unreachable by keyboard.
  company: string
}

const EMPTY_CONTACT: ContactState = { name: '', contact: '', email: '', consent: false, company: '' }

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const fieldWrapClass = (hasError: boolean) =>
  `flex h-[50px] items-center rounded-2xl border bg-white/70 shadow-[0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all duration-200 focus-within:border-accent/60 focus-within:shadow-[0_0_0_3px_rgba(var(--accent-rgb),0.16)] ${
    hasError ? 'border-red-400' : 'border-accent/20'
  }`

const inputClass =
  'h-full w-full rounded-2xl border-0 bg-transparent px-4 text-sm text-text-main placeholder:text-text-muted/70 outline-none'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

function validateSelectAnswer(answer: StepAnswer, requiredMessage: string, customRequiredMessage: string): string | null {
  if (!answer.optionId) return requiredMessage
  if (answer.optionId === CUSTOM_OPTION_ID && !answer.customText.trim()) return customRequiredMessage
  return null
}

type CustomTextFieldProps = {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error: string | null
}

function CustomTextField({ id, label, placeholder, value, onChange, error }: CustomTextFieldProps) {
  return (
    <div className="mt-3 animate-calc-expand">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-text-main">
        {label}
      </label>
      <div className={fieldWrapClass(Boolean(error))}>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={inputClass}
        />
      </div>
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  )
}

function DarkPitchPanel() {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#1f252b] p-5 sm:p-9 lg:p-10">
      <WaveLines className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-96 opacity-[0.16]" />
      <div className="relative z-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(0,183,200,0.9)]" />
          Есть идея?
        </span>
        <h2 className="mt-6 text-3xl font-bold leading-[1.12] text-white sm:text-4xl">
          Вы знаете свою сферу. Мы поможем превратить это знание в продукт.
        </h2>
        <p className="mt-5 max-w-lg text-base leading-7 text-white/65">
          Специалисты, эксперты и предприниматели с сильной идеей — помогаем превратить её в работающий
          digital-продукт: сайт, приложение, AI, сервис или автоматизацию.
        </p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
          Сайт · Приложение · AI · Сервис · Автоматизация
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {FLOW_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80">
                {label}
              </span>
              {i < FLOW_LABELS.length - 1 && <IconArrowRight className="h-3.5 w-3.5 text-white/30" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepShell({
  step,
  title,
  hint,
  children,
  fieldError,
  canProceed,
  onBack,
  onNext,
}: {
  step: number
  title: string
  hint?: string
  children: ReactNode
  fieldError: string | null
  canProceed: boolean
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div>
      <IdeaProgress step={step} total={TOTAL_STEPS} />

      <div key={step} className="mt-5 animate-calc-step">
        <h3 id="idea-question" tabIndex={-1} className="text-xl font-bold leading-snug text-text-main sm:text-2xl">
          {title}
        </h3>
        {hint && <p className="mt-2 text-sm leading-relaxed text-text-muted">{hint}</p>}
        {children}
        {fieldError && <p className="mt-3 text-[13px] text-red-500">{fieldError}</p>}
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <button type="button" onClick={onBack} className="btn-secondary">
          Назад
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Продолжить
          <IconArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function IdeaLeadMagnet() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<IdeaAnswers>(EMPTY_IDEA_ANSWERS)
  const [contact, setContact] = useState<ContactState>(EMPTY_CONTACT)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [status, setStatus] = useState<SubmitStatus>('idle')

  useEffect(() => {
    trackIdeaEvent('idea_lead_view')
  }, [])

  useEffect(() => {
    if (step < 1 || step > TOTAL_STEPS) return
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('idea-question')?.focus({ preventScroll: true })
      document.getElementById('idea')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [step])

  const handleStart = () => {
    trackIdeaEvent('idea_lead_start')
    setStep(1)
  }

  const handleBack = () => {
    setFieldError(null)
    setStep((s) => Math.max(0, s - 1))
  }

  const handleSelectProjectType = (optionId: string) => {
    setFieldError(null)
    setAnswers((prev) => ({ ...prev, projectType: { optionId, customText: prev.projectType.customText } }))
  }
  const handleProjectTypeCustomText = (text: string) => {
    setAnswers((prev) => ({ ...prev, projectType: { ...prev.projectType, customText: text } }))
  }

  const handleSelectTargetAudience = (optionId: string) => {
    setFieldError(null)
    setAnswers((prev) => ({ ...prev, targetAudience: { optionId, customText: prev.targetAudience.customText } }))
  }
  const handleTargetAudienceCustomText = (text: string) => {
    setAnswers((prev) => ({ ...prev, targetAudience: { ...prev.targetAudience, customText: text } }))
  }

  const handleIdeaDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers((prev) => ({ ...prev, ideaDescription: e.target.value }))
  }

  const handleSelectStage = (optionId: string) => {
    setFieldError(null)
    setAnswers((prev) => ({ ...prev, projectStage: { optionId, customText: '' } }))
  }

  const handleContactChange =
    (field: 'name' | 'contact' | 'email' | 'company') => (e: ChangeEvent<HTMLInputElement>) => {
      setContact((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleConsentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContact((prev) => ({ ...prev, consent: e.target.checked }))
  }

  const handleNextStep1 = () => {
    const error = validateSelectAnswer(answers.projectType, 'Выберите один из вариантов', 'Опишите идею своими словами')
    if (error) {
      setFieldError(error)
      return
    }
    setFieldError(null)
    trackIdeaEvent('idea_lead_step_1')
    setStep(2)
  }

  const handleNextStep2 = () => {
    const error = validateSelectAnswer(
      answers.targetAudience,
      'Выберите один из вариантов',
      'Расскажите, кто будет этим пользоваться',
    )
    if (error) {
      setFieldError(error)
      return
    }
    setFieldError(null)
    trackIdeaEvent('idea_lead_step_2')
    setStep(3)
  }

  const handleNextStep3 = () => {
    if (!answers.ideaDescription.trim()) {
      setFieldError('Расскажите, что должен делать продукт')
      return
    }
    setFieldError(null)
    trackIdeaEvent('idea_lead_step_3')
    setStep(4)
  }

  const stageError = submitAttempted && !answers.projectStage.optionId
  const nameError = submitAttempted && !contact.name.trim()
  const contactError = submitAttempted && !contact.contact.trim()
  const consentError = submitAttempted && !contact.consent

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!answers.projectStage.optionId || !contact.name.trim() || !contact.contact.trim() || !contact.consent) {
      return
    }
    if (status === 'submitting') return

    setStatus('submitting')
    trackIdeaEvent('idea_lead_step_4')
    trackIdeaEvent('idea_lead_submit')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'idea_review',
          name: contact.name,
          contact: contact.contact,
          email: contact.email,
          company: contact.company,
          projectType: resolveOptionLabel(PROJECT_TYPE_OPTIONS, answers.projectType),
          targetAudience: resolveOptionLabel(TARGET_AUDIENCE_OPTIONS, answers.targetAudience),
          ideaDescription: answers.ideaDescription,
          projectStage: resolveOptionLabel(PROJECT_STAGE_OPTIONS, answers.projectStage),
          pageUrl: window.location.href,
          utm: getStoredUtm(),
          // Reached only after the guard above confirmed the checkbox is
          // checked — never send this as true without a real, current consent.
          consent: true,
        }),
      })

      if (!response.ok) throw new Error('Request failed')
      setStatus('success')
      trackIdeaEvent('idea_lead_success')
      setStep(TOTAL_STEPS + 1)
    } catch {
      setStatus('error')
      trackIdeaEvent('idea_lead_error')
    }
  }

  const handleRestart = () => {
    setAnswers(EMPTY_IDEA_ANSWERS)
    setContact(EMPTY_CONTACT)
    setFieldError(null)
    setSubmitAttempted(false)
    setStatus('idle')
    setStep(0)
  }

  const selectedProjectTypeOption = PROJECT_TYPE_OPTIONS.find((o) => o.id === answers.projectType.optionId)
  const selectedTargetAudienceOption = TARGET_AUDIENCE_OPTIONS.find((o) => o.id === answers.targetAudience.optionId)

  return (
    <section id="idea" className="py-12 sm:py-16 lg:py-20">
      <div className="container-px">
        <div className="neu-panel-accent relative overflow-hidden p-3 sm:p-4 lg:p-5">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:gap-5">
            <DarkPitchPanel />

            <div className="relative overflow-hidden rounded-[28px] border border-accent/25 bg-white/55 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:p-7 lg:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative">
                {step === 0 && (
                  <div>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.14em] text-accent-dark">Что вы получите</span>
                        <h3 className="mt-1 text-xl font-semibold text-text-main">После разбора идеи</h3>
                      </div>
                      <span className="hidden rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent-dark sm:inline-flex">
                        ≈ 2 минуты
                      </span>
                    </div>
                    <div className="mb-4 mt-3 h-px w-full bg-gradient-to-r from-transparent via-[rgba(var(--accent-rgb),0.28)] to-transparent" />

                    <div className="grid gap-4 sm:grid-cols-2">
                      {WHAT_YOU_GET.map((item) => (
                        <div key={item.number} className="flex gap-3">
                          <span className="text-xs font-bold text-accent-dark">{item.number}</span>
                          <div>
                            <div className="text-sm font-semibold text-text-main">{item.title}</div>
                            <div className="mt-0.5 text-[13px] leading-relaxed text-text-muted">{item.text}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button type="button" onClick={handleStart} className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 sm:w-auto">
                      Разобрать идею
                      <IconArrowRight className="h-4 w-4" />
                    </button>
                    <p className="mt-3 text-xs text-text-muted">От идеи → к первой рабочей версии.</p>
                  </div>
                )}

                {step === 1 && (
                  <StepShell
                    step={1}
                    title="Что хотите создать?"
                    hint="Не знаете, что именно нужно? Ничего страшного — опишите идею своими словами."
                    fieldError={fieldError}
                    canProceed={Boolean(answers.projectType.optionId)}
                    onBack={handleBack}
                    onNext={handleNextStep1}
                  >
                    <div role="radiogroup" aria-labelledby="idea-question" className="mt-5 flex flex-col gap-2.5">
                      {PROJECT_TYPE_OPTIONS.map((option) => (
                        <IdeaOptionCard
                          key={option.id}
                          label={option.label}
                          selected={answers.projectType.optionId === option.id}
                          onToggle={() => handleSelectProjectType(option.id)}
                        />
                      ))}
                    </div>
                    {selectedProjectTypeOption?.kind === 'input' && (
                      <CustomTextField
                        id="idea-project-type-custom"
                        label="Опишите идею своими словами"
                        placeholder={selectedProjectTypeOption.placeholder ?? ''}
                        value={answers.projectType.customText}
                        onChange={handleProjectTypeCustomText}
                        error={null}
                      />
                    )}
                  </StepShell>
                )}

                {step === 2 && (
                  <StepShell
                    step={2}
                    title="Для кого ваш проект?"
                    hint="Кто будет пользоваться продуктом."
                    fieldError={fieldError}
                    canProceed={Boolean(answers.targetAudience.optionId)}
                    onBack={handleBack}
                    onNext={handleNextStep2}
                  >
                    <div role="radiogroup" aria-labelledby="idea-question" className="mt-5 flex flex-col gap-2.5">
                      {TARGET_AUDIENCE_OPTIONS.map((option) => (
                        <IdeaOptionCard
                          key={option.id}
                          label={option.label}
                          selected={answers.targetAudience.optionId === option.id}
                          onToggle={() => handleSelectTargetAudience(option.id)}
                        />
                      ))}
                    </div>
                    {selectedTargetAudienceOption?.kind === 'input' && (
                      <CustomTextField
                        id="idea-target-audience-custom"
                        label="Кто будет этим пользоваться?"
                        placeholder={selectedTargetAudienceOption.placeholder ?? ''}
                        value={answers.targetAudience.customText}
                        onChange={handleTargetAudienceCustomText}
                        error={null}
                      />
                    )}
                  </StepShell>
                )}

                {step === 3 && (
                  <StepShell
                    step={3}
                    title="Что продукт должен делать?"
                    fieldError={fieldError}
                    canProceed={Boolean(answers.ideaDescription.trim())}
                    onBack={handleBack}
                    onNext={handleNextStep3}
                  >
                    <div className="mt-5">
                      <div className="rounded-2xl border border-accent/20 bg-white/70 shadow-[0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all duration-200 focus-within:border-accent/60 focus-within:shadow-[0_0_0_3px_rgba(var(--accent-rgb),0.16)]">
                        <textarea
                          id="idea-description"
                          rows={5}
                          value={answers.ideaDescription}
                          onChange={handleIdeaDescriptionChange}
                          placeholder="Например: принимать записи, помогать клиентам выбирать услугу, автоматически обрабатывать заявки, анализировать данные..."
                          className="min-h-[140px] w-full resize-none rounded-2xl border-0 bg-transparent px-4 py-3 text-sm text-text-main placeholder:text-text-muted/70 outline-none"
                        />
                      </div>
                    </div>
                  </StepShell>
                )}

                {step === 4 && (
                  <form onSubmit={handleSubmit} noValidate>
                    <IdeaProgress step={4} total={TOTAL_STEPS} />

                    <div key={step} className="mt-5 animate-calc-step">
                      <h3 id="idea-question" tabIndex={-1} className="text-xl font-bold leading-snug text-text-main sm:text-2xl">
                        На каком вы сейчас этапе?
                      </h3>

                      <div role="radiogroup" aria-labelledby="idea-question" className="mt-5 flex flex-col gap-2.5">
                        {PROJECT_STAGE_OPTIONS.map((option) => (
                          <IdeaOptionCard
                            key={option.id}
                            label={option.label}
                            selected={answers.projectStage.optionId === option.id}
                            onToggle={() => handleSelectStage(option.id)}
                          />
                        ))}
                      </div>
                      {stageError && <p className="mt-2 text-[13px] text-red-500">Выберите этап проекта</p>}

                      {answers.projectStage.optionId && (
                        <div className="mt-5 animate-calc-expand border-t border-black/[0.06] pt-5">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label htmlFor="idea-name" className="mb-1 block text-[13px] font-medium text-text-main">
                                Имя
                              </label>
                              <div className={fieldWrapClass(nameError)}>
                                <input
                                  id="idea-name"
                                  type="text"
                                  value={contact.name}
                                  onChange={handleContactChange('name')}
                                  placeholder="Как к вам обращаться"
                                  aria-invalid={nameError}
                                  className={inputClass}
                                />
                              </div>
                              {nameError && <p className="mt-1 text-[11px] text-red-500">Заполните это поле</p>}
                            </div>

                            <div>
                              <label htmlFor="idea-contact" className="mb-1 block text-[13px] font-medium text-text-main">
                                Телефон / Telegram
                              </label>
                              <div className={fieldWrapClass(contactError)}>
                                <input
                                  id="idea-contact"
                                  type="text"
                                  value={contact.contact}
                                  onChange={handleContactChange('contact')}
                                  placeholder="@username или удобный контакт"
                                  aria-invalid={contactError}
                                  className={inputClass}
                                />
                              </div>
                              {contactError && <p className="mt-1 text-[11px] text-red-500">Заполните это поле</p>}
                            </div>

                            <div className="sm:col-span-2">
                              <label htmlFor="idea-email" className="mb-1 block text-[13px] font-medium text-text-main">
                                Email <span className="font-normal text-text-muted">· необязательно</span>
                              </label>
                              <div className={fieldWrapClass(false)}>
                                <input
                                  id="idea-email"
                                  type="email"
                                  value={contact.email}
                                  onChange={handleContactChange('email')}
                                  placeholder="you@example.com"
                                  className={inputClass}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Honeypot: hidden from real visitors, invisible to screen readers, unreachable by keyboard. */}
                          <div className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
                            <label htmlFor="idea-company">Компания</label>
                            <input
                              id="idea-company"
                              name="company"
                              type="text"
                              tabIndex={-1}
                              autoComplete="off"
                              value={contact.company}
                              onChange={handleContactChange('company')}
                            />
                          </div>

                          <label htmlFor="idea-consent" className="mt-4 flex cursor-pointer items-start gap-2.5 text-[11.5px] leading-relaxed text-text-muted">
                            <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                              <input
                                id="idea-consent"
                                type="checkbox"
                                checked={contact.consent}
                                onChange={handleConsentChange}
                                aria-invalid={consentError}
                                className="peer sr-only"
                              />
                              <span
                                className={`h-5 w-5 rounded-[7px] border-2 transition-all duration-200 ${
                                  contact.consent
                                    ? 'border-accent bg-gradient-to-br from-accent to-accent-dark'
                                    : consentError
                                      ? 'border-red-400 bg-white'
                                      : 'border-accent/35 bg-white'
                                } peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 peer-focus-visible:ring-offset-1`}
                              />
                              <IconCheckSmall
                                className={`pointer-events-none absolute h-3.5 w-3.5 text-white transition-opacity duration-150 ${
                                  contact.consent ? 'opacity-100' : 'opacity-0'
                                }`}
                              />
                            </span>
                            <span>
                              Я согласен на обработку моих персональных данных для обработки заявки, связи со мной и
                              подготовки разбора идеи. Я ознакомился с{' '}
                              <a href="/privacy" className="text-accent-dark underline underline-offset-2 hover:text-accent">
                                Политикой обработки персональных данных
                              </a>
                              .
                            </span>
                          </label>
                          {consentError && <p className="ml-8 mt-1 text-[11px] text-red-500">Нужно подтвердить согласие</p>}
                        </div>
                      )}
                    </div>

                    <div className="mt-7 flex items-center justify-between gap-4">
                      <button type="button" onClick={handleBack} className="btn-secondary">
                        Назад
                      </button>
                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {status === 'submitting' ? 'Отправляем…' : 'Получить разбор идеи'}
                      </button>
                    </div>

                    {status === 'error' && (
                      <p className="mt-3 text-center text-[13px] leading-relaxed text-red-600">
                        Не удалось отправить заявку. Ваши ответы никуда не делись — попробуйте ещё раз или напишите
                        напрямую в Telegram:{' '}
                        <a href={CONTACT_TELEGRAM_URL} className="font-semibold underline underline-offset-2">
                          {CONTACT_TELEGRAM}
                        </a>
                        .
                      </p>
                    )}
                  </form>
                )}

                {step === TOTAL_STEPS + 1 && (
                  <div className="flex h-full min-h-[420px] flex-col items-center justify-center py-6 text-center">
                    <div className="neu-chip flex h-16 w-16 items-center justify-center text-accent">
                      <IconCheck className="h-7 w-7" />
                    </div>
                    <span className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-accent-dark">Заявка принята</span>
                    <h3 className="mt-2 text-2xl font-semibold text-text-main">Идея принята</h3>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-text-muted">
                      Посмотрим на неё как на продукт: что стоит сделать первым, какой MVP нужен и как проверить
                      гипотезу без лишних затрат.
                    </p>

                    <ol className="mt-6 flex w-full max-w-xs flex-col gap-2.5 text-left">
                      {SUCCESS_STEPS.map((label, index) => (
                        <li key={label} className="flex items-center gap-3">
                          <span className="neu-chip flex h-8 w-8 shrink-0 items-center justify-center text-xs font-bold text-accent-dark">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-text-main">{label}</span>
                        </li>
                      ))}
                    </ol>

                    <p className="mt-6 text-xs text-text-muted">Обычно связываемся в течение рабочего дня.</p>

                    <button type="button" onClick={handleRestart} className="mt-5 text-sm font-medium text-text-muted underline underline-offset-2 hover:text-accent-dark">
                      Рассказать ещё одну идею
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
