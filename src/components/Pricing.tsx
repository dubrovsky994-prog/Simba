import { IconCheckSmall } from './icons'

type Plan = {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  featured?: boolean
}

const PLANS: Plan[] = [
  {
    name: 'Старт',
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

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
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
