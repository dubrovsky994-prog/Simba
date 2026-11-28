import { useState } from 'react'
import { IconCheckSmall, IconChevronDown } from './icons'

type Plan = {
  name: string
  tagline: string
  price: string
  description: string
  features: string[]
  cta: string
  featured?: boolean
}

const PLANS: Plan[] = [
  {
    name: 'Старт',
    tagline: 'Собрать входящий поток',
    price: '29 900 ₽',
    description: 'Для мастеров, небольших услуг и микробизнеса.',
    features: [
      'Сайт-визитка или каталог',
      'Форма заявки',
      'QR-код',
      'Связь с вами',
      'Базовая настройка',
      'Запуск под ключ',
    ],
    cta: 'Начать со Старта',
  },
  {
    name: 'Продажи',
    tagline: 'Система продаж',
    price: '49 900 ₽',
    description: 'Для бизнеса, которому нужны заявки, заказы и повторные продажи.',
    features: [
      'Всё из тарифа «Старт»',
      'Telegram / MAX-бот',
      'Сбор клиентской базы',
      'Уведомления и акции',
      'Аналитика заказов',
      'Подготовка к рекламе',
    ],
    cta: 'Хочу больше заявок',
    featured: true,
  },
  {
    name: 'Система',
    tagline: 'Полная цифровая система',
    price: 'от 79 900 ₽',
    description: 'Для бизнеса, которому нужна полноценная цифровая среда.',
    features: [
      'Всё из тарифа «Продажи»',
      'Интеграции',
      'Автоматизация процессов',
      'ИИ-помощники',
      'Расширенная аналитика',
      'Доработка под бизнес-процессы',
    ],
    cta: 'Собрать систему',
  },
]

export default function Pricing() {
  const [openPlan, setOpenPlan] = useState<string | null>(null)

  return (
    <section id="pricing" className="py-12 sm:py-16">
      <div className="container-px">
        <div className="max-w-2xl">
          <span className="section-eyebrow">Тарифы</span>
          <h2 className="section-title mt-4">Выберите систему под задачи вашего бизнеса</h2>
          <p className="section-subtitle">
            Можно начать с простой точки заявок и постепенно добавить бота, клиентскую базу и автоматизацию.
          </p>
        </div>

        {/* Below 768px: compact rows — closed shows name/price/description, tap to expand full plan. */}
        <div className="mt-8 flex flex-col gap-3 md:hidden">
          {PLANS.map((plan) => {
            const isOpen = openPlan === plan.name
            return (
              <div
                key={plan.name}
                className={`overflow-hidden rounded-[20px] transition-all duration-300 ${
                  plan.featured ? 'border-2 border-accent/70 accent-glow' : 'neu-card'
                }`}
              >
                <button
                  type="button"
                  id={`plan-tab-${plan.name}`}
                  onClick={() => setOpenPlan(isOpen ? null : plan.name)}
                  aria-expanded={isOpen}
                  aria-controls={`plan-panel-${plan.name}`}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-text-main">{plan.name}</h3>
                      {plan.featured && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Популярный
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-accent-dark">{plan.tagline}</p>
                    <p className="mt-0.5 truncate text-xs text-text-muted">{plan.description}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5">
                    <span className="text-lg font-bold text-text-main">{plan.price}</span>
                    <IconChevronDown
                      className={`h-4 w-4 shrink-0 text-accent transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                <div
                  id={`plan-panel-${plan.name}`}
                  role="region"
                  aria-labelledby={`plan-tab-${plan.name}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4">
                      <ul className="space-y-2 border-t border-[var(--line-neutral)] pt-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm text-text-main">
                            <IconCheckSmall className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#audit"
                        className={`mt-4 w-full text-center ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        {plan.cta}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 768px and up: unchanged three full cards side by side. */}
        <div className="mt-8 hidden gap-4 md:grid md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-[24px] p-6 sm:p-7 ${
                plan.featured
                  ? 'accent-glow border-2 border-accent/90 bg-[rgba(255,255,255,0.65)] lg:-translate-y-3'
                  : 'neu-card'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-white shadow-neu-sm">
                  Популярный выбор
                </span>
              )}

              <h3 className="text-xl font-semibold text-text-main">{plan.name}</h3>
              <p className="mt-1 text-sm font-semibold text-accent-dark">{plan.tagline}</p>
              <div className="mt-3 text-3xl font-bold text-text-main sm:text-4xl">{plan.price}</div>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">{plan.description}</p>

              <ul className="mt-5 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-text-main">
                    <IconCheckSmall className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#audit"
                className={`mt-6 w-full text-center ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
