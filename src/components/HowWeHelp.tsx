import { useState } from 'react'
import { IconChart, IconCheckSmall, IconChevronDown, IconInbox, IconUsers } from './icons'

type Stage = {
  id: string
  icon: typeof IconChart
  title: string
  hint: string
  problem: string
  actions: string[]
  result: string
}

const STAGES: Stage[] = [
  {
    id: 'audit',
    icon: IconChart,
    title: 'Разобрать бизнес',
    hint: 'С чего начинаем',
    problem:
      'Часто непонятно, где именно бизнес теряет клиентов: на сайте, в переписках, в рекламе или на этапе повторной покупки.',
    actions: [
      'Изучаем ваш бизнес, клиентов, конкурентов и то, как у вас сейчас покупают',
      'Проверяем все точки, откуда приходят обращения: сайт, соцсети, реклама, мессенджеры',
      'Находим, где заявки теряются и что мешает клиенту дойти до покупки',
    ],
    result: 'Понятную картину: что уже работает, что мешает продажам и с чего начать в первую очередь.',
  },
  {
    id: 'channel',
    icon: IconInbox,
    title: 'Собрать канал продаж',
    hint: 'Заявки в одном месте',
    problem: 'Заявки приходят из разных мест — сайт, соцсети, звонки, Telegram — и часть из них теряется.',
    actions: [
      'Настраиваем сайт или каталог с понятным следующим шагом для клиента',
      'Подключаем форму заявки или заказа и бота для быстрых ответов',
      'Собираем все обращения в одном месте, чтобы ни одна заявка не потерялась',
    ],
    result: 'Понятный путь клиента от первого касания до покупки и контроль над всеми заявками.',
  },
  {
    id: 'return',
    icon: IconUsers,
    title: 'Вернуть клиентов',
    hint: 'Рост и повторные продажи',
    problem: 'Клиент покупает один раз и пропадает — бизнес зависит от новой рекламы, а не от своей базы клиентов.',
    actions: [
      'Собираем клиентскую базу вместо того, чтобы терять покупателей в соцсетях и на маркетплейсах',
      'Настраиваем напоминания, статусы заказов и уведомления для повторных обращений',
      'Связываем рекламу, сайт и переписку в одну систему, которая работает на возврат клиентов',
    ],
    result: 'Клиенты возвращаются за повторной покупкой, а бизнес меньше зависит от новых вложений в рекламу.',
  },
]

const DEFAULT_STAGE_ID = STAGES[0].id

function StageDetails({ stage }: { stage: Stage }) {
  return (
    <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-3 lg:gap-8 lg:p-8">
      <div>
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
          <stage.icon className="h-4 w-4 text-accent" />
          Проблема
        </h3>
        <p className="mt-3 text-base leading-relaxed text-text-main">{stage.problem}</p>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Что делает SIMBA</h3>
        <ul className="mt-3 flex flex-col gap-2.5">
          {stage.actions.map((action) => (
            <li key={action} className="flex items-start gap-2 text-sm leading-relaxed text-text-main">
              <IconCheckSmall className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Что вы получаете</h3>
        <p className="mt-3 text-base leading-relaxed text-text-main">{stage.result}</p>
      </div>
    </div>
  )
}

export default function HowWeHelp() {
  const [activeId, setActiveId] = useState<string | null>(DEFAULT_STAGE_ID)
  const active = STAGES.find((stage) => stage.id === activeId) ?? STAGES[0]

  return (
    <section id="how-we-help" className="bg-bg-section py-12 sm:py-16">
      <div className="container-px">
        <div className="max-w-2xl">
          <span className="section-eyebrow">Как это работает</span>
          <h2 className="section-title mt-4">От разбора бизнеса до повторных продаж</h2>
          <p className="section-subtitle">
            Сначала разбираем именно ваш бизнес, а не предлагаем одинаковый набор всем.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:grid sm:grid-cols-3">
          {STAGES.map((stage, index) => {
            const isActive = stage.id === activeId
            return (
              <div key={stage.id}>
                <button
                  type="button"
                  id={`howwehelp-tab-${stage.id}`}
                  onClick={() => setActiveId(isActive ? null : stage.id)}
                  aria-pressed={isActive}
                  aria-expanded={isActive}
                  aria-controls={`howwehelp-panel-${stage.id}`}
                  className={`neu-card flex w-full items-center gap-3.5 p-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 ${
                    isActive ? 'border-2 border-accent/70 bg-white/85 sm:accent-glow' : 'sm:hover:-translate-y-1'
                  }`}
                >
                  <span
                    className={`neu-chip flex h-12 w-12 shrink-0 items-center justify-center text-sm font-bold ${
                      isActive ? 'text-accent' : 'text-accent-dark'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-text-main sm:text-base">{stage.title}</div>
                    <div className="mt-0.5 text-xs text-text-muted">{stage.hint}</div>
                  </div>
                  <IconChevronDown
                    className={`h-4 w-4 shrink-0 text-accent transition-transform duration-300 sm:hidden ${
                      isActive ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Mobile: answer expands right under its own tab, so there's no long scroll from click to result.
                    Re-clicking the active tab collapses it — the grid-rows height transition keeps this jump-free. */}
                <div
                  id={`howwehelp-panel-${stage.id}`}
                  role="region"
                  aria-labelledby={`howwehelp-tab-${stage.id}`}
                  className={`grid transition-all duration-300 ease-in-out sm:hidden ${
                    isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="neu-panel mt-3">
                      <StageDetails stage={stage} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop: shared panel below the row of tabs, unchanged. */}
        <div key={active.id} className="case-fade-in mt-6 hidden sm:block">
          <div className="neu-panel">
            <StageDetails stage={active} />
          </div>
        </div>
      </div>
    </section>
  )
}
