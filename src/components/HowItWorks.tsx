const STEPS = [
  { title: 'Реклама / QR / соцсети', text: 'Человек видит вас' },
  { title: 'Сайт', text: 'Понимает предложение' },
  { title: 'Заявка', text: 'Оставляет контакт' },
  { title: 'Бот', text: 'Получает ответ' },
  { title: 'Клиентская база', text: 'Не теряется' },
  { title: 'Повторная продажа', text: 'Возвращается снова' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-bg-section py-12 sm:py-16">
      <div className="container-px">
        <div className="max-w-2xl">
          <span className="section-eyebrow">Как работает система</span>
          <h2 className="section-title mt-4">Путь клиента от первого касания до повторной покупки</h2>
        </div>

        {/* Mobile: vertical timeline, steps not boxed as separate cards */}
        <div className="relative mt-10 lg:hidden">
          <div className="absolute bottom-6 left-6 top-6 border-l-2 border-dashed border-[var(--line-brand)]" />
          <div className="flex flex-col gap-6">
            {STEPS.map((step, index) => (
              <div key={step.title} className="relative flex items-start gap-4">
                <span className="neu-chip relative z-10 flex h-12 w-12 shrink-0 items-center justify-center text-sm font-bold text-accent">
                  {index + 1}
                </span>
                <div className="pt-2.5">
                  <div className="text-sm font-semibold text-text-main">{step.title}</div>
                  <div className="mt-0.5 text-xs text-text-muted">{step.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: single horizontal chain */}
        <div className="mt-10 hidden lg:flex lg:items-stretch">
          {STEPS.map((step, index) => (
            <div key={step.title} className="contents">
              <div className="neu-card flex flex-1 flex-col items-center gap-2 px-5 py-6 text-center">
                <span className="neu-chip flex h-12 w-12 shrink-0 items-center justify-center text-sm font-bold text-accent">
                  {index + 1}
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-base font-semibold text-text-main">{step.title}</span>
                  <span className="mt-0.5 block text-xs text-text-muted">{step.text}</span>
                </div>
              </div>

              {index < STEPS.length - 1 && (
                <div className="flex w-8 shrink-0 items-center justify-center">
                  <span className="h-px w-full border-t-2 border-dashed border-[var(--line-brand)]" />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-base text-text-muted">
          Мы соединяем точки, где бизнес обычно теряет клиентов.
        </p>
      </div>
    </section>
  )
}
