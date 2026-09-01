import { IconApp, IconBot, IconGear, IconSite } from './icons'

const STATUS_ITEMS = [
  { icon: IconSite, title: 'Сайт', text: 'Анализ и рост конверсии' },
  { icon: IconBot, title: 'Бот', text: 'Квалификация и заявки 24/7' },
  { icon: IconApp, title: 'Мини-приложение', text: 'Вовлечение и продажи' },
  { icon: IconGear, title: 'Автоматизация', text: 'Экономия времени и рост ROI' },
]

export default function StatusBar() {
  return (
    <section className="pb-8 sm:pb-12">
      <div className="container-px">
        <div className="neu-panel grid grid-cols-1 gap-x-6 gap-y-3 p-4 sm:grid-cols-2 sm:gap-y-6 sm:p-6 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-[var(--line-neutral)] lg:p-5">
          {STATUS_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex min-h-[76px] items-center gap-3.5 lg:px-6 lg:first:pl-1 lg:last:pr-1"
            >
              <span className="neu-chip flex h-12 w-12 shrink-0 items-center justify-center text-accent">
                <item.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-sm font-bold text-text-main sm:text-base">
                  <span>{item.title}</span>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                </div>
                <div className="mt-1 text-xs leading-snug text-text-muted sm:text-sm">{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
