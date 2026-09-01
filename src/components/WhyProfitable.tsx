import WaveLines from './WaveLines'

const BENEFITS = [
  {
    number: '01',
    title: 'Больше заявок',
    text: 'Клиенту проще понять предложение и оставить заявку.',
  },
  {
    number: '02',
    title: 'Меньше потерянных клиентов',
    text: 'Все обращения собираются в системе.',
  },
  {
    number: '03',
    title: 'Больше повторных продаж',
    text: 'Клиентская база, уведомления, акции и бот помогают возвращать покупателей.',
  },
  {
    number: '04',
    title: 'Меньше зависимости от площадок',
    text: 'Маркетплейсы, соцсети и агрегаторы остаются источниками трафика, но база клиентов постепенно становится вашей.',
  },
]

export default function WhyProfitable() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-px">
        <div className="max-w-2xl">
          <span className="section-eyebrow">Результат</span>
          <h2 className="section-title mt-4">
            Главная задача — не просто запустить сайт, а увеличить продажи
          </h2>
          <p className="section-subtitle">
            Система нужна не ради сайта, а ради заявок, порядка и повторных продаж.
          </p>
        </div>

        <div className="neu-panel relative mt-10 overflow-hidden p-6 sm:p-8 lg:p-6">
          <WaveLines
            className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-1/4 lg:block"
            style={{ opacity: 0.3 }}
          />
          <div className="relative z-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-[var(--line-neutral)]">
            {BENEFITS.map((benefit) => (
              <div key={benefit.number} className="lg:px-6 lg:first:pl-1 lg:last:pr-1">
                <div className="text-4xl font-extrabold leading-none text-accent/25">{benefit.number}</div>
                <div className="mt-2 h-0.5 w-8 rounded-full bg-accent" />
                <h3 className="mt-4 text-lg font-semibold text-text-main">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
