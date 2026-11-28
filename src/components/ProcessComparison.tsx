import StepChain from './StepChain'

const BEFORE_STEPS = [
  'Реклама',
  'VK / Telegram / агрегатор / сайт',
  'Звонки и сообщения',
  'Ручная запись / заказ',
  'Excel / CRM / переписка',
  'Сотрудник всё связывает вручную',
]

const AFTER_STEPS = ['Реклама', 'Сайт / mini-app', 'Заказ / запись', 'Оплата', 'CRM / база клиентов', 'Бот + автоматизация', 'Повторная продажа']

export default function ProcessComparison() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-px">
        <div className="max-w-2xl">
          <span className="section-eyebrow">Почему это важно</span>
          <h2 className="section-title mt-4">
            Когда бизнес растёт, ручные процессы начинают тормозить продажи
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="neu-card p-5 sm:p-7">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Сейчас</span>
            <div className="mt-5">
              <StepChain steps={BEFORE_STEPS} tone="neutral" />
            </div>
          </div>

          <div className="neu-panel-accent p-5 sm:p-7">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-dark">С Simba</span>
            <div className="mt-5">
              <StepChain steps={AFTER_STEPS} tone="accent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
