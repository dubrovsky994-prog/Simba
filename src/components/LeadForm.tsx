import { ChangeEvent, FormEvent, useState } from 'react'
import { IconCheck } from './icons'
import WaveLines from './WaveLines'
import { CONTACT_TELEGRAM, CONTACT_TELEGRAM_URL } from '../legal/content'

type FormState = {
  name: string
  contact: string
  businessType: string
  link: string
  message: string
  consent: boolean
  // Honeypot: left empty by real visitors, invisible and unreachable by keyboard.
  // A filled value means the submission was likely automated — see api/lead.ts.
  company: string
}

const INITIAL_STATE: FormState = {
  name: '',
  contact: '',
  businessType: '',
  link: '',
  message: '',
  consent: false,
  company: '',
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function LeadForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const handleChange =
    (field: 'name' | 'contact' | 'businessType' | 'link' | 'message' | 'company') =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleConsentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, consent: e.target.checked }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.consent) return

    setStatus('submitting')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          contact: form.contact,
          businessType: form.businessType,
          link: form.link,
          message: form.message,
          company: form.company,
          page: window.location.pathname,
        }),
      })

      if (!response.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="audit" className="py-12 sm:py-16 lg:py-20">
      <div className="container-px">
        <div className="neu-panel-accent relative overflow-hidden p-3 sm:p-4 lg:p-5">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:gap-5">
            <div className="relative overflow-hidden rounded-[24px] bg-[#1f252b] p-7 sm:p-9 lg:p-10">
              <WaveLines className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-96 opacity-[0.16]" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(0,183,200,0.9)]" />
                  Заявка
                </span>
                <h2 className="mt-6 text-3xl font-bold leading-[1.12] text-white sm:text-4xl">
                  Оставьте заявку
                </h2>
                <p className="mt-5 max-w-lg text-base leading-7 text-white/65">
                  Расскажите коротко о бизнесе и задаче. Мы свяжемся с вами, чтобы обсудить, какой формат SIMBA
                  подойдёт: «Старт», «Продажи» или «Система».
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/70 bg-[rgba(255,255,255,0.52)] p-6 sm:p-8 lg:p-9">
              {status === 'success' ? (
                <div className="flex h-full min-h-[420px] flex-col items-center justify-center py-10 text-center">
                  <div className="neu-chip flex h-16 w-16 items-center justify-center text-accent">
                    <IconCheck className="h-7 w-7" />
                  </div>
                  <span className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-accent-dark">Заявка принята</span>
                  <h3 className="mt-2 text-2xl font-semibold text-text-main">Спасибо</h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-text-muted">
                    Заявка отправлена. Мы свяжемся с вами по указанному контакту, чтобы обсудить задачу.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-accent-dark">Шаг 1 из 1</span>
                      <h3 className="mt-1 text-xl font-semibold text-text-main">Расскажите о задаче</h3>
                    </div>
                    <span className="hidden rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent-dark sm:inline-flex">
                      ≈ 2 минуты
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-main">
                        Имя
                      </label>
                      <div className="neu-inset rounded-xl">
                        <input
                          id="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={handleChange('name')}
                          placeholder="Как к вам обращаться"
                          className="w-full rounded-xl border-0 bg-transparent px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact" className="mb-1.5 block text-sm font-medium text-text-main">
                        Телефон / Telegram
                      </label>
                      <div className="neu-inset rounded-xl">
                        <input
                          id="contact"
                          type="text"
                          required
                          value={form.contact}
                          onChange={handleChange('contact')}
                          placeholder="@username или удобный контакт"
                          className="w-full rounded-xl border-0 bg-transparent px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="businessType" className="mb-1.5 block text-sm font-medium text-text-main">
                        Сфера / вид бизнеса
                      </label>
                      <div className="neu-inset rounded-xl">
                        <input
                          id="businessType"
                          type="text"
                          required
                          value={form.businessType}
                          onChange={handleChange('businessType')}
                          placeholder="Например: доставка еды"
                          className="w-full rounded-xl border-0 bg-transparent px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="link" className="mb-1.5 block text-sm font-medium text-text-main">
                        Ссылка <span className="font-normal text-text-muted">· необязательно</span>
                      </label>
                      <div className="neu-inset rounded-xl">
                        <input
                          id="link"
                          type="text"
                          value={form.link}
                          onChange={handleChange('link')}
                          placeholder="Сайт, соцсеть или маркетплейс"
                          className="w-full rounded-xl border-0 bg-transparent px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text-main">
                        Что нужно улучшить <span className="font-normal text-text-muted">· необязательно</span>
                      </label>
                      <div className="neu-inset rounded-xl">
                        <textarea
                          id="message"
                          rows={2}
                          value={form.message}
                          onChange={handleChange('message')}
                          placeholder="Например: больше заявок, свой бот, порядок в базе клиентов"
                          className="w-full resize-none rounded-xl border-0 bg-transparent px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Honeypot: hidden from real visitors, invisible to screen readers, unreachable by keyboard. */}
                  <div className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="company">Компания</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.company}
                      onChange={handleChange('company')}
                    />
                  </div>

                  <label htmlFor="consent" className="mt-5 flex items-start gap-3 text-xs leading-relaxed text-text-muted">
                    <input
                      id="consent"
                      type="checkbox"
                      required
                      checked={form.consent}
                      onChange={handleConsentChange}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
                    />
                    <span>
                      Я согласен на обработку моих персональных данных для обработки заявки, связи со мной и
                      подготовки предложения. Я ознакомился с{' '}
                      <a href="/privacy" className="text-accent-dark underline underline-offset-2 hover:text-accent">
                        Политикой обработки персональных данных
                      </a>
                      .
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!form.consent || status === 'submitting'}
                    className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                  >
                    {status === 'submitting' ? 'Отправляем…' : 'Отправить заявку'}
                  </button>

                  {status === 'error' && (
                    <p className="mt-3 text-center text-[13px] leading-relaxed text-red-600">
                      Не удалось отправить заявку. Пожалуйста, попробуйте ещё раз или напишите напрямую в Telegram:{' '}
                      <a href={CONTACT_TELEGRAM_URL} className="font-semibold underline underline-offset-2">
                        {CONTACT_TELEGRAM}
                      </a>
                      .
                    </p>
                  )}

                  <p className="mt-3 text-center text-[11px] leading-relaxed text-text-muted">
                    Отправка заявки не означает заключение договора и не гарантирует конкретный коммерческий
                    результат.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
