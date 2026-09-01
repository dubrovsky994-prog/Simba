import { IconBot, IconChart, IconCheck, IconGear, IconInbox } from './icons'
import WaveLines from './WaveLines'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-9 pt-8 sm:pb-11 sm:pt-11">
      <div
        className="pointer-events-none absolute -top-24 right-[-5%] hidden h-80 w-80 rounded-full opacity-50 blur-3xl lg:block"
        style={{ background: 'radial-gradient(circle, var(--accent-soft), transparent 70%)' }}
      />
      <WaveLines
        className="pointer-events-none absolute -bottom-6 -right-10 hidden h-72 w-[500px] lg:block"
        style={{
          WebkitMaskImage: 'linear-gradient(315deg, transparent 0%, black 35%)',
          maskImage: 'linear-gradient(315deg, transparent 0%, black 35%)',
        }}
      />

      <div className="container-px relative grid items-center gap-8 sm:gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <span className="section-badge">Цифровая система продаж</span>

          <h1 className="mt-5 text-3xl font-bold leading-[1.15] text-text-main sm:text-5xl lg:text-[3.25rem]">
            Бесплатно покажем, где ваш бизнес <span className="text-accent">теряет заявки</span>
          </h1>

          <p className="section-subtitle">
            Проведём аудит ваших цифровых каналов и покажем точки роста продаж.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:mt-9 sm:flex-row">
            <a href="#audit" className="btn-primary">
              Получить бесплатный разбор
            </a>
            <a href="#features" className="btn-secondary">
              Узнать больше
            </a>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-12 sm:gap-8">
            <div>
              <div className="text-xl font-bold text-text-main sm:text-2xl">+57%</div>
              <div className="text-xs text-text-muted sm:text-sm">рост заявок у клиентов</div>
            </div>
            <div>
              <div className="text-xl font-bold text-text-main sm:text-2xl">2,5x</div>
              <div className="text-xs text-text-muted sm:text-sm">больше повторных продаж</div>
            </div>
            <div>
              <div className="text-xl font-bold text-text-main sm:text-2xl">24/7</div>
              <div className="text-xs text-text-muted sm:text-sm">обработка обращений</div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          {/* Laptop / dashboard mockup */}
          <div className="neu-panel relative p-3 sm:p-4">
            <div className="hidden items-center gap-1.5 pb-3 sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
            </div>

            <div className="rounded-2xl border border-[rgba(var(--accent-rgb),0.18)] bg-bg-section p-3 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-text-muted">Панель управления</div>
                  <div className="mt-1 text-sm font-semibold text-text-main">Симба · Продажи</div>
                </div>
                <div className="neu-chip flex h-8 w-8 items-center justify-center text-accent">
                  <IconChart className="h-4 w-4" />
                </div>
              </div>

              {/* fake chart */}
              <div className="mt-3 flex h-14 items-end gap-1.5 sm:mt-5 sm:h-28">
                {[40, 55, 35, 60, 50, 72, 58, 80, 66, 90].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-accent/25 to-accent"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 hidden text-[10px] text-text-muted sm:block">
                Источники заявок: сайт, реклама, бот
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-3">
                <div className="neu-card p-2.5 sm:p-3">
                  <div className="flex items-center gap-2 text-accent">
                    <IconInbox className="h-4 w-4" />
                    <span className="text-xs text-text-muted">Новые заявки</span>
                  </div>
                  <div className="mt-1.5 text-lg font-bold text-text-main">24</div>
                </div>
                <div className="neu-card p-2.5 sm:p-3">
                  <div className="flex items-center gap-2 text-accent">
                    <IconGear className="h-4 w-4" />
                    <span className="text-xs text-text-muted">Продажи</span>
                  </div>
                  <div className="mt-1.5 text-lg font-bold text-text-main">156</div>
                </div>
              </div>
            </div>

            {/* laptop base */}
            <div className="mx-auto -mt-1 hidden h-3 w-[70%] rounded-b-xl bg-black/5 sm:block" />
          </div>

          {/* floating stat card */}
          <div className="neu-card absolute -left-4 -top-6 hidden w-40 p-3 sm:-left-8 sm:-top-8 sm:block">
            <div className="text-xs text-text-muted">Повторные продажи</div>
            <div className="mt-1 text-lg font-bold text-accent-dark">+38%</div>
          </div>

          {/* phone with bot */}
          <div className="neu-panel absolute -bottom-8 -right-2 hidden w-[150px] p-2 sm:block sm:-right-6 sm:w-[170px]">
            <div className="rounded-[1.1rem] bg-bg-section p-2.5">
              <div className="flex items-center gap-1.5 border-b border-border pb-2">
                <div className="neu-chip flex h-6 w-6 items-center justify-center text-accent">
                  <IconBot className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] font-semibold text-text-main">Симба Бот</span>
              </div>

              <div className="mt-2 space-y-1.5">
                <div className="w-[85%] rounded-md rounded-tl-sm bg-bg-card-soft px-2 py-1.5 text-[9px] leading-snug text-text-muted">
                  Здравствуйте! Чем можем помочь вашему бизнесу?
                </div>
                <div className="ml-auto w-[70%] rounded-md rounded-tr-sm bg-accent px-2 py-1.5 text-[9px] leading-snug text-white">
                  Узнать цены
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <div className="rounded-md border border-accent/50 px-2 py-1 text-center text-[9px] text-accent-dark">
                  Услуги и цены
                </div>
                <div className="flex items-center justify-center gap-1 rounded-md bg-accent-soft px-2 py-1 text-center text-[9px] font-medium text-accent-dark">
                  <IconCheck className="h-2.5 w-2.5" />
                  Заявка сохранена
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
