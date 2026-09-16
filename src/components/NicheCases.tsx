import { useState } from 'react'
import { IconCheckSmall } from './icons'
import CaseGallery, { type CaseScreenshot } from './CaseGallery'
import { trackAuditEvent } from '../lib/audit/analytics'

type ProjectCase = {
  id: string
  title: string
  category: string
  tag: string
  shortText: string
  description: string
  highlights: string[]
  screenshots: CaseScreenshot[]
  projectUrl?: string
}

const projectCases: ProjectCase[] = [
  {
    id: 'sweet-mommy',
    title: 'Sweet Mommy',
    category: 'Сладкие подарки и зефир',
    tag: 'Система заказов',
    shortText:
      'Цифровая система продаж для бренда сладких подарков: витрина, оплата, доставка, бот и мобильное приложение.',
    description:
      'Sweet Mommy — локальный бренд сладких подарков и зефира. Для проекта мы собрали не просто онлайн-витрину, а полноценную цифровую систему продаж: клиент может посмотреть продукцию, выбрать подарок, оформить заказ, оплатить онлайн и выбрать доставку с учётом времени на производство.',
    highlights: [
      'Витрина, заказ и оплата на сайте — без лишних переписок',
      'Доставка учитывает время на производство, поэтому бизнесу проще планировать нагрузку',
      'Своя база клиентов вместо потерь в соцсетях',
      'PWA-приложение и бот со встроенным мини-приложением для приёма заказов',
      'Основа для акций, уведомлений и повторных продаж',
    ],
    screenshots: [
      { src: '/cases/sweet-mommy/screen-1.jpg', alt: 'Главный экран Sweet Mommy' },
      { src: '/cases/sweet-mommy/screen-2.jpg', alt: 'Каталог продукции Sweet Mommy' },
      { src: '/cases/sweet-mommy/screen-3.jpg', alt: 'Карточка товара Sweet Mommy' },
    ],
    projectUrl: 'https://zefir58.ru',
  },
  {
    id: 'kirmebel',
    title: 'Кирмебель',
    category: 'Мебельное производство',
    tag: 'Запись на замер',
    shortText: 'Сайт-каталог для мебельного производства с главным действием — записью на замер.',
    description:
      'Кирмебель — сайт-каталог для мебельного производства, где главный сценарий ведёт клиента к заявке и записи на замер. Посетитель может посмотреть направления, примеры мебели, понять формат работы и быстро оставить заявку на расчёт или замер.',
    highlights: [
      'Каталог мебели с разделами, карточками изделий и примерами работ',
      'Главное действие — запись на замер, плюс форма заявки на расчёт',
      'Кнопки быстрой связи и адаптивная мобильная версия',
      'Готова структура под трафик из Яндекс, VK и Telegram',
      'Появляется база для дальнейшей автоматизации',
    ],
    screenshots: [
      { src: '/cases/kirmebel/screen-1.jpg', alt: 'Главный экран Кирмебель' },
      { src: '/cases/kirmebel/screen-2.jpg', alt: 'Каталог мебели Кирмебель' },
      { src: '/cases/kirmebel/screen-3.jpg', alt: 'Форма заявки Кирмебель' },
    ],
    projectUrl: 'https://kirmebelpenza.ru',
  },
  {
    id: 'shashlyk-jan',
    title: 'Шашлык Джан',
    category: 'Еда, доставка и самовывоз',
    tag: 'Автоматическая доставка',
    shortText:
      'Доставка еды, где заказ, подтверждение и статус проходят автоматически — без ручной проверки каждого заказа.',
    description:
      'Шашлык Джан — цифровая система для доставки еды и самовывоза. Клиент видит меню, собирает заказ в понятной корзине и оплачивает онлайн, а подтверждение и статус заказа проходят автоматически, без ручной проверки каждого обращения.',
    highlights: [
      'Онлайн-меню, понятная корзина и оформление заказа на доставку или самовывоз',
      'Онлайн-оплата — покупка быстрее и без звонка',
      'Заказ подтверждается и получает статус автоматически, без ручной проверки каждого обращения',
      'PWA-приложение — повторный заказ делается быстрее',
      'Бизнес меньше зависит от агрегаторов доставки',
    ],
    screenshots: [
      { src: '/cases/shashlyk-jan/screen-1.jpg', alt: 'Главный экран Шашлык Джан' },
      { src: '/cases/shashlyk-jan/screen-2.jpg', alt: 'Меню Шашлык Джан' },
      { src: '/cases/shashlyk-jan/screen-3.jpg', alt: 'Заказ Шашлык Джан' },
    ],
  },
  {
    id: 'aura',
    title: 'Аура',
    category: 'Мобильное приложение под заказ',
    tag: 'Android / iPhone',
    shortText:
      'Полноценное мобильное приложение для Android и iPhone, а не просто сайт или экран. Превращает текст и голос в задачи, события, привычки и проекты.',
    description:
      'Aura — полноценное мобильное приложение для Android и iPhone, созданное под заказ частного клиента. Это органайзер, который превращает обычные фразы пользователя в структурированные записи: задачи, события, привычки, напоминания, заметки и проекты. Вводить данные можно текстом или голосом.',
    highlights: [
      'Полноценное мобильное приложение для Android и iPhone — не сайт и не экран',
      'Текст или голос превращаются в задачи, события, привычки, заметки и проекты',
      'Пользователю не нужно вручную раскладывать мысли по разделам',
      'Сценарий создан под конкретного частного клиента',
      'Основа для развития: ИИ-помощник, уведомления, синхронизация',
    ],
    screenshots: [
      { src: '/cases/aura/screen-1.jpg', alt: 'Главный экран приложения Аура' },
      { src: '/cases/aura/screen-2.jpg', alt: 'Интерфейс приложения Аура' },
      { src: '/cases/aura/screen-3.jpg', alt: 'Функции приложения Аура' },
    ],
  },
  {
    id: 'laila-maalul',
    title: 'Лилия Маалул',
    category: 'Персональный бренд · услуги',
    tag: 'Онлайн-запись',
    shortText:
      'Сайт для косметолога-эстетиста, который объединяет личный бренд специалиста и удобную онлайн-запись.',
    description:
      'Лилия Маалул — косметолог-эстетист. Для проекта мы собираем систему, где клиент быстро понимает услуги специалиста, проникается доверием благодаря личному бренду и записывается на приём онлайн, а данные о визитах и клиентах остаются в одной системе.',
    highlights: [
      'Сайт, который представляет специалиста и его услуги',
      'Онлайн-запись без звонков и переписки',
      'Напоминания о записи и поводы для повторного визита',
      'История клиента и визитов в одном месте',
      'Основа для доверия к личному бренду и повторных обращений',
    ],
    screenshots: [
      { src: '/cases/laila-maalul/screen-1.jpg', alt: 'Главный экран сайта Лилии Маалул' },
      { src: '/cases/laila-maalul/screen-2.jpg', alt: 'Услуги и онлайн-запись на сайте Лилии Маалул' },
    ],
  },
  {
    id: 'frame58',
    title: 'FRAME58',
    category: 'Видео-продакшн · бриф · управление проектами',
    tag: 'Приём заявок',
    shortText:
      'Система для видеопродакшна: понятный бриф на сайте помогает превратить обращение в оформленный проект.',
    description:
      'FRAME58 — видеопродакшн. Для проекта мы собираем систему, где клиент видит специализацию студии и заполняет пошаговый бриф с деталями задачи, а обращение проходит через понятные этапы — от заявки до готового проекта — без потерь и лишних созвонов.',
    highlights: [
      'Пошаговый бриф вместо долгих созвонов для сбора задачи',
      'Заявка приходит уже структурированной, с целями и деталями',
      'Проект проходит через понятные этапы: бриф, съёмка, монтаж, правки, финал',
      'История переписки и материалов сохраняется по каждому проекту',
      'Меньше потерянных обращений на входе',
    ],
    screenshots: [{ src: '/cases/frame58/screen-1.jpg', alt: 'Пошаговый бриф проекта на сайте FRAME58' }],
  },
]

const DEFAULT_ACTIVE_ID = 'sweet-mommy'
const FEATURED_CASE_IDS = new Set(['sweet-mommy', 'shashlyk-jan', 'kirmebel', 'aura'])
const featuredCases = projectCases.filter((project) => FEATURED_CASE_IDS.has(project.id))

export default function NicheCases() {
  const [activeId, setActiveId] = useState(DEFAULT_ACTIVE_ID)
  const activeCase = featuredCases.find((project) => project.id === activeId) ?? featuredCases[0]

  return (
    <section id="for-whom" className="bg-bg-section py-12 sm:py-16">
      <div className="container-px">
        <div className="max-w-2xl">
          <span className="section-eyebrow">Кейсы</span>
          <h2 className="section-title mt-4">Примеры систем под разные бизнесы</h2>
          <p className="section-subtitle">
            Показываем на примерах систем, как сайт, каталог, заявки, бот и автоматизация превращаются в
            понятную систему продаж.
          </p>
        </div>

        <div className="relative -mx-5 mt-8 sm:mx-0">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-5 px-5 py-3 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:px-0 sm:py-0">
            {featuredCases.map((project) => {
              const isActive = project.id === activeId
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={(e) => {
                    setActiveId(project.id)
                    // On mobile the tab strip scrolls horizontally — selecting a
                    // peeking card must bring it fully into view, or it stays
                    // half off-screen while showing as "active". No-ops on
                    // desktop, where the grid is already fully visible.
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
                  }}
                  aria-pressed={isActive}
                  className={`neu-card w-[clamp(260px,78vw,320px)] shrink-0 snap-start p-4 text-left backdrop-blur-sm transition-all duration-300 sm:w-auto sm:min-w-0 ${
                    isActive
                      ? 'border-2 border-accent/70 bg-white/85 shadow-[0_8px_18px_rgba(0,183,200,0.18)] sm:border-0 sm:bg-transparent sm:accent-glow sm:-translate-y-1'
                      : 'sm:hover:-translate-y-1'
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                      isActive ? 'text-accent' : 'text-accent-dark'
                    }`}
                  >
                    {project.tag}
                  </span>
                  <h3 className="mt-1.5 text-base font-semibold text-text-main">{project.title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-text-muted">{project.category}</p>
                </button>
              )
            })}
          </div>

          {/* Edge fades hint that the strip scrolls — sized to exactly match the
              scroll gutter (px-5/scroll-pl-5) so they never overlap card pixels. */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-bg-section to-transparent sm:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-bg-section to-transparent sm:hidden" />
        </div>

        <div key={activeCase.id} className="case-fade-in mt-8">
          <div className="neu-panel relative overflow-hidden p-5 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {activeCase.category} · {activeCase.tag}
                </span>

                <h3 className="mt-5 text-2xl font-bold leading-tight text-text-main sm:text-3xl">
                  {activeCase.title}
                </h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Контекст</h4>
                    <p className="mt-2 text-base font-medium text-accent-dark">{activeCase.shortText}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Что изменилось</h4>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">{activeCase.description}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Что сделали</h4>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {activeCase.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-main">
                        <IconCheckSmall className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#business-audit" className="btn-primary">
                    Посчитать потери
                  </a>
                  {activeCase.projectUrl ? (
                    <a
                      href={activeCase.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      Посмотреть пример
                    </a>
                  ) : (
                    <a href="#business-audit" className="btn-secondary">
                      Посчитать потери
                    </a>
                  )}
                  <a
                    href="#business-audit"
                    onClick={() => trackAuditEvent('niche_audit_click')}
                    className="inline-flex items-center px-2 text-sm font-semibold text-accent-dark underline underline-offset-2 hover:text-accent"
                  >
                    Узнать, где теряются клиенты
                  </a>
                </div>
              </div>

              <CaseGallery screenshots={activeCase.screenshots} resetKey={activeCase.id} />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[24px] bg-[#1f252b] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h3 className="text-xl font-bold text-white sm:text-2xl">Хотите похожую систему под свой бизнес?</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
              Покажем, как можно упаковать вашу нишу: сайт, заявки, каталог, бот, клиентская база и повторные
              продажи.
            </p>
          </div>
          <a href="#business-audit" className="btn-primary shrink-0">
            Посчитать потери
          </a>
        </div>
      </div>
    </section>
  )
}
