import { IconBot, IconChart, IconCheck, IconGear, IconInbox } from './icons'

// Decorative dashboard + bot mockup — illustrative only, no real or implied
// metrics. Shared by BusinessAudit's start screen (its only home now).
export default function SimbaMockupPanel() {
  return (
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

          {/* decorative chart — illustrative shape only, not real data */}
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
            <div className="neu-card flex items-center gap-2 p-2.5 sm:p-3">
              <div className="neu-chip flex h-8 w-8 shrink-0 items-center justify-center text-accent">
                <IconInbox className="h-4 w-4" />
              </div>
              <span className="text-xs text-text-muted">Новые заявки</span>
            </div>
            <div className="neu-card flex items-center gap-2 p-2.5 sm:p-3">
              <div className="neu-chip flex h-8 w-8 shrink-0 items-center justify-center text-accent">
                <IconGear className="h-4 w-4" />
              </div>
              <span className="text-xs text-text-muted">Продажи</span>
            </div>
          </div>
        </div>

        {/* laptop base */}
        <div className="mx-auto -mt-1 hidden h-3 w-[70%] rounded-b-xl bg-black/5 sm:block" />
      </div>

      {/* phone with bot — in-flow and centered on mobile so it's actually visible there;
          floats as a corner overlay from sm: up. */}
      <div className="neu-panel relative mx-auto mt-5 w-[210px] p-2.5 sm:absolute sm:-bottom-8 sm:-right-6 sm:mx-0 sm:mt-0 sm:w-[170px] sm:p-2">
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
  )
}
