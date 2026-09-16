import { useEffect, useState } from 'react'
import BeautyCoreDemo from './BeautyCoreDemo'
import PaperMorphAvatar from './avatar/PaperMorphAvatar'
import WaveLines from './WaveLines'

type HomePath = {
  number: string
  title: string
  description: string
  href?: string
  opensDemo?: boolean
}

const HOME_PATHS = [
  {
    number: '01',
    title: 'Калькулятор потерь',
    description: 'Узнайте, где заявки и деньги уходят мимо.',
    href: '#business-audit',
  },
  {
    number: '02',
    title: 'Реализовать идею',
    description: 'Разберём идею, соберём MVP и план запуска.',
    href: '#idea',
  },
  {
    number: '03',
    title: 'Beauty Core · демо',
    description: 'Введите данные и попробуйте демо-версию.',
    opensDemo: true,
  },
] satisfies HomePath[]

function HomePathCard({ path, onOpenDemo }: { path: HomePath; onOpenDemo: () => void }) {
  const className = 'neu-card group flex min-h-[118px] items-start gap-3 p-3.5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:min-h-[148px] sm:flex-col sm:justify-between sm:p-4'
  const content = (
    <>
      <span className="neu-chip flex h-9 w-9 shrink-0 items-center justify-center text-[11px] font-bold text-accent-dark sm:h-8 sm:w-8">
        {path.number}
      </span>
      <span className="min-w-0 flex-1 sm:flex-initial">
        <span className="block text-sm font-bold leading-snug text-text-main sm:text-base">{path.title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-text-muted sm:mt-1.5">{path.description}</span>
      </span>
      <span aria-hidden="true" className="mt-1 text-lg leading-none text-accent transition-transform group-hover:translate-x-0.5 sm:hidden">
        ↗
      </span>
      <span aria-hidden="true" className="hidden self-end text-lg leading-none text-accent transition-transform group-hover:translate-x-0.5 sm:block">
        ↗
      </span>
    </>
  )

  if (path.opensDemo) {
    return (
      <button key={path.number} type="button" onClick={onOpenDemo} aria-haspopup="dialog" className={`${className} w-full`}>
        {content}
      </button>
    )
  }

  return <a key={path.number} href={path.href} className={className}>{content}</a>
}

export default function Hero() {
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [beautyDemoOpen, setBeautyDemoOpen] = useState(false)

  useEffect(() => {
    if (!assistantOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAssistantOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [assistantOpen])

  const toggleAssistant = () => setAssistantOpen((open) => !open)

  return (
    <section id="top" className="relative overflow-hidden pb-10 pt-8 sm:pb-12 sm:pt-10 lg:py-12">
      <div
        className="pointer-events-none absolute -right-20 -top-28 hidden h-[30rem] w-[30rem] rounded-full opacity-60 blur-3xl lg:block"
        style={{ background: 'radial-gradient(circle, var(--accent-soft), transparent 68%)' }}
      />
      <WaveLines
        className="pointer-events-none absolute -bottom-8 -right-10 hidden h-72 w-[500px] opacity-70 lg:block"
        style={{
          WebkitMaskImage: 'linear-gradient(315deg, transparent 0%, black 35%)',
          maskImage: 'linear-gradient(315deg, transparent 0%, black 35%)',
        }}
      />

      <div className="container-px relative">
        <div className="mx-auto grid max-w-7xl items-center gap-9 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="min-w-0">
            <span className="section-badge">SIMBA</span>

            <h1 className="mt-5 max-w-[760px] text-center text-3xl font-bold leading-[1.12] text-text-main sm:text-5xl lg:text-left xl:text-[3.5rem]">
              Цифровая система продаж для <span className="text-accent">вашего бизнеса</span>
            </h1>

            <p className="section-subtitle mx-auto lg:mx-0 lg:max-w-[700px] lg:text-left">
              Соединяем сайт, заявки, запись, заказы, оплату, клиентскую базу и автоматизацию в одну систему.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center lg:justify-start">
              <a href="#business-audit" className="btn-primary">
                Рассчитать потери бизнеса
              </a>
              <a href="#for-whom" className="btn-secondary">
                Посмотреть кейсы
              </a>
            </div>

            <div className="mt-8 sm:mt-10">
              <div className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted lg:text-left">
                Выберите направление
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
                {HOME_PATHS.map((path) => <HomePathCard key={path.number} path={path} onOpenDemo={() => setBeautyDemoOpen(true)} />)}
              </div>
            </div>
          </div>

          <aside className="relative z-10 mx-auto flex w-full max-w-[360px] flex-col items-center lg:mx-0 lg:justify-self-end">
            <div className="mb-1 flex items-center gap-2 rounded-full border border-accent/20 bg-white/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted shadow-soft backdrop-blur-sm">
              <span className={`h-1.5 w-1.5 rounded-full bg-accent ${assistantOpen ? 'animate-pulse' : ''}`} />
              {assistantOpen ? 'SIMBA активна' : 'SIMBA AI · рядом'}
            </div>

            <PaperMorphAvatar
              state={assistantOpen ? 'listening' : 'idle'}
              size={336}
              onActivate={toggleAssistant}
              className="cursor-pointer transition-transform duration-300 hover:scale-[1.025]"
            />

            <button
              type="button"
              onClick={toggleAssistant}
              aria-expanded={assistantOpen}
              aria-controls="simba-assistant-panel"
              className="btn-primary mt-1 min-h-12 w-full max-w-[280px] gap-2"
            >
              {assistantOpen ? 'Свернуть SIMBA' : 'Вызвать SIMBA AI'}
              <span aria-hidden="true" className="text-lg leading-none">{assistantOpen ? '−' : '↗'}</span>
            </button>

            {assistantOpen && (
              <div
                id="simba-assistant-panel"
                role="region"
                aria-label="Быстрые действия SIMBA AI"
                className="mt-4 w-full rounded-[22px] border border-accent/20 bg-white/80 p-4 shadow-soft backdrop-blur-xl sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-text-main">Привет! С чего начнём?</h2>
                    <p className="mt-1 text-xs leading-relaxed text-text-muted">Выберите сценарий — открою нужный раздел или демо.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAssistantOpen(false)}
                    aria-label="Закрыть панель SIMBA AI"
                    className="neu-chip flex h-8 w-8 shrink-0 items-center justify-center text-lg leading-none text-text-muted transition-colors hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-4 grid gap-2">
                  <a
                    href="#business-audit"
                    onClick={() => setAssistantOpen(false)}
                    className="flex min-h-10 items-center justify-between rounded-xl border border-border bg-white/60 px-3.5 py-2 text-left text-xs font-semibold text-text-main transition-colors hover:border-accent/40 hover:text-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                  >
                    Рассчитать потери <span aria-hidden="true" className="text-base leading-none text-accent">→</span>
                  </a>
                  <a
                    href="#idea"
                    onClick={() => setAssistantOpen(false)}
                    className="flex min-h-10 items-center justify-between rounded-xl border border-border bg-white/60 px-3.5 py-2 text-left text-xs font-semibold text-text-main transition-colors hover:border-accent/40 hover:text-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                  >
                    Реализовать идею <span aria-hidden="true" className="text-base leading-none text-accent">→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setAssistantOpen(false)
                      setBeautyDemoOpen(true)
                    }}
                    className="flex min-h-10 w-full items-center justify-between rounded-xl border border-border bg-white/60 px-3.5 py-2 text-left text-xs font-semibold text-text-main transition-colors hover:border-accent/40 hover:text-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                  >
                    Открыть Beauty Core <span aria-hidden="true" className="text-base leading-none text-accent">→</span>
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
      {beautyDemoOpen && <BeautyCoreDemo onClose={() => setBeautyDemoOpen(false)} />}
    </section>
  )
}
