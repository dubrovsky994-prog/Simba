import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { INITIAL_APPOINTMENTS, SERVICES } from '../lib/beauty/demoData'

type DemoTab = 'schedule' | 'clients' | 'services'

const CURRENCY = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })

export default function BeautyCoreDemo({ onClose }: { onClose: () => void }) {
  const onCloseRef = useRef(onClose)
  const mainRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  onCloseRef.current = onClose
  const [activeTab, setActiveTab] = useState<DemoTab>('schedule')
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS)
  const [showForm, setShowForm] = useState(false)
  const [client, setClient] = useState('')
  const [service, setService] = useState(SERVICES[0].name)
  const [time, setTime] = useState('16:00')
  const [price, setPrice] = useState(String(SERVICES[0].price))
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  useEffect(() => {
    if (!showForm) return
    const frame = window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [showForm])

  const clients = useMemo(() => [...new Set(appointments.map((appointment) => appointment.client))], [appointments])
  const total = appointments.reduce((sum, appointment) => sum + appointment.price, 0)
  const today = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(new Date())

  const addAppointment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanClient = client.trim()
    const numericPrice = Number(price)
    if (!cleanClient || !time || !Number.isFinite(numericPrice) || numericPrice < 0) return

    setAppointments((current) => [
      ...current,
      { id: Date.now(), client: cleanClient, service, time, price: numericPrice },
    ].sort((a, b) => a.time.localeCompare(b.time)))
    setClient('')
    setNotice('Запись добавлена в демо-расписание.')
    setShowForm(false)
  }

  const chooseService = (name: string) => {
    setService(name)
    const selected = SERVICES.find((item) => item.name === name)
    if (selected) setPrice(String(selected.price))
  }

  const openBookingForm = (selectedService = service) => {
    chooseService(selectedService)
    setActiveTab('schedule')
    setShowForm(true)
    setNotice('')
  }

  return createPortal(
    <div
      style={{ zIndex: 90 }}
      role="dialog"
      aria-modal="true"
      aria-label="Демо Beauty Core"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-slate-950/50 p-2 backdrop-blur-sm sm:items-center sm:p-5"
    >
      <div
        style={{ height: 'min(94dvh, 820px)', maxHeight: '94dvh' }}
        className="flex min-h-0 w-full max-w-6xl flex-col overflow-hidden rounded-[26px] border border-white/60 bg-[#f5f8f7] shadow-[0_28px_90px_rgba(8,28,30,0.28)] sm:rounded-[30px] md:flex-row"
      >
        <aside className="flex shrink-0 flex-col bg-[#172729] px-4 py-3 text-white md:w-[220px] md:px-5 md:py-6">
          <div className="flex items-center justify-between gap-3 md:block">
            <div>
              <div className="text-sm font-bold tracking-wide">Beauty Core</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-white/45">интерактивное демо</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть демо"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xl text-white/75 transition hover:bg-white/10 hover:text-white md:hidden"
            >
              ×
            </button>
          </div>

          <nav aria-label="Разделы демо" className="mt-3 flex gap-2 overflow-x-auto md:mt-9 md:flex-col md:overflow-visible">
            {[
              { id: 'schedule' as const, label: 'Расписание', mark: 'Р' },
              { id: 'clients' as const, label: 'Клиенты', mark: 'К' },
              { id: 'services' as const, label: 'Услуги', mark: 'У' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id)
                  setShowForm(false)
                  setNotice('')
                }}
                aria-current={activeTab === item.id ? 'page' : undefined}
                className={`flex min-h-10 shrink-0 items-center gap-2.5 rounded-xl px-3 text-left text-xs font-semibold transition sm:min-h-11 sm:text-sm ${
                  activeTab === item.id ? 'bg-white/12 text-white' : 'text-white/60 hover:bg-white/[0.07] hover:text-white/90'
                }`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] ${activeTab === item.id ? 'bg-accent/20 text-accent' : 'bg-white/[0.08] text-white/55'}`}>
                  {item.mark}
                </span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto hidden rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-[11px] leading-relaxed text-white/55 md:block">
            Тестовые данные живут только в этой демо-сессии и удаляются при закрытии.
          </div>
        </aside>

        <main ref={mainRef} style={{ minHeight: 0, flex: '1 1 0%', overflowY: 'auto' }} className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <header className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-accent-dark">
                  Демо-режим
                </span>
                <span className="text-xs capitalize text-text-muted">{today}</span>
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-text-main sm:text-3xl">
                {activeTab === 'schedule' ? 'Расписание' : activeTab === 'clients' ? 'Клиенты' : 'Услуги'}
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                {activeTab === 'schedule' ? 'Записи и загрузка студии в одном месте.' : activeTab === 'clients' ? 'Клиентская база вашей студии.' : 'Список услуг и стоимость приёма.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть демо"
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-xl text-text-muted transition hover:border-accent/35 hover:text-text-main md:flex"
            >
              ×
            </button>
          </header>

          {activeTab === 'schedule' && (
            <>
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-7 sm:grid-cols-3 sm:gap-3">
                {[
                  { label: 'Записей сегодня', value: String(appointments.length) },
                  { label: 'Плановая выручка', value: `${CURRENCY.format(total)} ₽` },
                  { label: 'Клиентов в демо', value: String(clients.length) },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border/80 bg-white/70 p-3 sm:p-4">
                    <div className="text-[10px] leading-snug text-text-muted sm:text-xs">{stat.label}</div>
                    <div className="mt-1.5 text-lg font-bold leading-tight text-text-main sm:text-xl">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.82fr)]">
                <section className="rounded-2xl border border-border/80 bg-white/70 p-4 sm:p-5" aria-label="Демо-расписание">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-text-main">Сегодня</h3>
                    <button
                      type="button"
                      onClick={() => openBookingForm()}
                      className="rounded-full bg-accent/10 px-3 py-2 text-[11px] font-bold text-accent-dark transition hover:bg-accent/15"
                    >
                      + Новая запись
                    </button>
                  </div>
                  <ul className="mt-3 divide-y divide-border/70">
                    {appointments.map((appointment) => (
                      <li key={appointment.id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
                        <span className="w-12 shrink-0 text-xs font-bold tabular-nums text-accent-dark">{appointment.time}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-text-main">{appointment.client}</span>
                          <span className="mt-0.5 block truncate text-[11px] text-text-muted">{appointment.service}</span>
                        </span>
                        <span className="shrink-0 text-xs font-semibold tabular-nums text-text-main">{CURRENCY.format(appointment.price)} ₽</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-border/80 bg-white/70 p-4 sm:p-5" aria-label="Добавить запись в демо">
                  {showForm ? (
                    <form ref={formRef} onSubmit={addAppointment}>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-text-main">Новая запись</h3>
                        <button type="button" onClick={() => setShowForm(false)} className="text-xs font-semibold text-text-muted hover:text-text-main">
                          Отмена
                        </button>
                      </div>
                      <label className="mt-3 block text-[11px] font-semibold text-text-muted" htmlFor="beauty-demo-client">Имя клиента</label>
                      <input
                        id="beauty-demo-client"
                        value={client}
                        onChange={(event) => setClient(event.target.value)}
                        required
                        maxLength={48}
                        placeholder="Например, Анна"
                        className="mt-1.5 h-10 w-full rounded-xl border border-border bg-white px-3 text-xs text-text-main outline-none transition focus:border-accent/55 focus:ring-2 focus:ring-accent/15"
                      />

                      <div className="mt-3 grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-text-muted" htmlFor="beauty-demo-service">Услуга</label>
                          <select
                            id="beauty-demo-service"
                            value={service}
                            onChange={(event) => chooseService(event.target.value)}
                            className="mt-1.5 h-10 w-full rounded-xl border border-border bg-white px-2.5 text-xs text-text-main outline-none focus:border-accent/55"
                          >
                            {SERVICES.map((item) => <option key={item.name}>{item.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-text-muted" htmlFor="beauty-demo-time">Время</label>
                          <input
                            id="beauty-demo-time"
                            type="time"
                            value={time}
                            onChange={(event) => setTime(event.target.value)}
                            required
                            className="mt-1.5 h-10 w-full rounded-xl border border-border bg-white px-2 text-xs text-text-main outline-none focus:border-accent/55"
                          />
                        </div>
                      </div>

                      <label className="mt-3 block text-[11px] font-semibold text-text-muted" htmlFor="beauty-demo-price">Стоимость, ₽</label>
                      <input
                        id="beauty-demo-price"
                        type="number"
                        min="0"
                        step="100"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        required
                        className="mt-1.5 h-10 w-full rounded-xl border border-border bg-white px-3 text-xs text-text-main outline-none focus:border-accent/55"
                      />
                      <button type="submit" className="btn-primary mt-4 min-h-10 w-full px-4 text-xs">Добавить в демо</button>
                    </form>
                  ) : (
                    <div className="flex h-full min-h-[210px] flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-accent-dark">Попробуйте сами</span>
                        <h3 className="mt-2 text-lg font-bold leading-snug text-text-main">Добавьте клиента и посмотрите, как обновится расписание</h3>
                        <p className="mt-2 text-xs leading-relaxed text-text-muted">Можно изменить услугу, время и стоимость. Это демо-данные, они не уходят с устройства.</p>
                      </div>
                      <button type="button" onClick={() => openBookingForm()} className="btn-secondary mt-5 min-h-10 w-full px-4 text-xs">
                        Создать демо-запись
                      </button>
                    </div>
                  )}
                </section>
              </div>
              {notice && <p role="status" className="mt-3 text-xs font-semibold text-accent-dark">{notice}</p>}
            </>
          )}

          {activeTab === 'clients' && (
            <section className="mt-6 rounded-2xl border border-border/80 bg-white/70 p-4 sm:p-5" aria-label="Демо-клиенты">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-text-main">Клиенты из записей</h3>
                  <p className="mt-1 text-xs text-text-muted">Список меняется, когда вы добавляете демо-записи.</p>
                </div>
                <span className="neu-chip flex h-10 w-10 items-center justify-center text-sm font-bold text-accent-dark">{clients.length}</span>
              </div>
              <ul className="mt-4 divide-y divide-border/70">
                {clients.map((name, index) => (
                  <li key={name} className="flex items-center gap-3 py-3 first:pt-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent-dark">{String(index + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text-main">{name}</span>
                    <span className="text-xs text-text-muted">{appointments.filter((item) => item.client === name).length} визит(а)</span>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => openBookingForm()} className="btn-secondary mt-4 min-h-10 w-full px-4 text-xs sm:w-auto">Добавить запись</button>
            </section>
          )}

          {activeTab === 'services' && (
            <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Демо-услуги">
              {SERVICES.map((item) => (
                <article key={item.name} className="rounded-2xl border border-border/80 bg-white/70 p-4 sm:p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-sm font-bold text-accent-dark">B</div>
                  <h3 className="mt-4 text-sm font-bold text-text-main">{item.name}</h3>
                  <p className="mt-1 text-xs text-text-muted">{item.duration}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-text-main">{CURRENCY.format(item.price)} ₽</span>
                    <button type="button" onClick={() => openBookingForm(item.name)} className="rounded-full border border-accent/25 px-3 py-2 text-[11px] font-bold text-accent-dark transition hover:bg-accent/10">
                      Записать
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}

          <p className="mt-5 text-[10px] leading-relaxed text-text-muted md:hidden">Тестовые данные живут только в этой демо-сессии и удаляются при закрытии.</p>
        </main>
      </div>
    </div>,
    document.body,
  )
}
