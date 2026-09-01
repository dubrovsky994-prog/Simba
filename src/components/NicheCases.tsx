import { useState } from 'react'
import { IconCheckSmall } from './icons'
import CaseGallery, { type CaseScreenshot } from './CaseGallery'

type ProjectCase = {
  id: string
  title: string
  category: string
  tag: string
  shortText: string
  description: string
  implemented: string[]
  benefits: string[]
  benefitsHeading: string
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
    implemented: [
      'Онлайн-витрина для продукции',
      'Категории и карточки товаров',
      'Оформление заказа на сайте',
      'Онлайн-оплата',
      'Полноценная доставка',
      'Заказы с учётом времени на производство',
      'Своя база клиентов',
      'PWA-приложение для мобильных',
      'Полноценный бот',
      'Встроенное мини-приложение в боте',
      'Основа для повторных продаж',
    ],
    benefitsHeading: 'Как это помогает бизнесу',
    benefits: [
      'Клиент может выбрать, заказать и оплатить без лишних переписок',
      'Заказы учитывают время на производство, поэтому бизнесу проще планировать нагрузку',
      'Доставка становится понятной частью покупки',
      'Покупатели остаются в собственной базе, а не теряются в соцсетях',
      'PWA-приложение удобно открывать с телефона как обычное приложение',
      'Бот и мини-приложение помогают принимать заказы и возвращать клиентов',
      'Есть основа для акций, уведомлений и повторных продаж',
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
    implemented: [
      'Сайт-каталог для мебельного производства',
      'Разделы под разные виды мебели',
      'Карточки изделий и направлений',
      'Блок преимуществ компании',
      'Форма заявки на расчёт',
      'Запись на замер',
      'Кнопки быстрой связи',
      'Адаптивная мобильная версия',
      'Подготовка структуры под рекламу',
    ],
    benefitsHeading: 'Как это помогает бизнесу',
    benefits: [
      'Клиент быстрее понимает, какую мебель можно заказать',
      'Проще показать примеры работ и направления',
      'Главное действие на сайте — записаться на замер',
      'Заявки на расчёт и замер собираются в понятном формате',
      'Можно вести трафик из Яндекс, VK и Telegram',
      'Сайт работает как онлайн-презентация производства',
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
    tag: 'Доставка и оплата',
    shortText: 'Система доставки еды с понятной корзиной, онлайн-оплатой, автоматизацией и PWA-приложением.',
    description:
      'Шашлык Джан — цифровая система для доставки еды и самовывоза. Клиент видит меню, собирает заказ в понятной корзине, оплачивает онлайн и отправляет заказ в работу без лишних звонков и переписок.',
    implemented: [
      'Онлайн-меню с категориями',
      'Карточки блюд',
      'Понятная корзина',
      'Оформление заказа на доставку и самовывоз',
      'Онлайн-оплата',
      'Полностью автоматизированная доставка',
      'Адаптация под мобильные устройства',
      'PWA-приложение для быстрого доступа',
      'Подготовка к Telegram / MAX-боту',
      'Основа для повторных заказов',
      'Структура под рекламу и QR-коды',
    ],
    benefitsHeading: 'Как это помогает бизнесу',
    benefits: [
      'Клиент быстро выбирает блюда и оформляет заказ без звонка',
      'Понятная корзина снижает путаницу в заказах',
      'Онлайн-оплата делает покупку быстрее и удобнее',
      'Автоматизация помогает не терять заказы в час пик',
      'PWA-приложение удобно сохранить на телефон',
      'Повторный заказ можно сделать быстрее',
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
      'Мобильный органайзер для Android и iPhone, который превращает текст и голос в задачи, события, привычки и проекты.',
    description:
      'Aura — полноценное мобильное приложение для Android и iPhone, созданное под заказ частного клиента. Это органайзер, который превращает обычные фразы пользователя в структурированные записи: задачи, события, привычки, напоминания, заметки и проекты. Вводить данные можно текстом или голосом.',
    implemented: [
      'Полноценное мобильное приложение для Android и iPhone',
      'Интерфейс мобильного органайзера',
      'Текстовый ввод обычными фразами',
      'Голосовой ввод задач и заметок',
      'Преобразование фраз в структурированные записи',
      'Создание задач, событий и напоминаний',
      'Создание привычек, заметок и проектов',
      'Пользовательский сценарий под частного клиента',
      'Основные экраны приложения',
      'Основа для дальнейшего развития продукта',
    ],
    benefitsHeading: 'Как это помогает',
    benefits: [
      'Пользователю не нужно вручную раскладывать мысли по разделам',
      'Обычная фраза превращается в понятную задачу, событие или напоминание',
      'Голосовой ввод помогает быстро фиксировать идеи на ходу',
      'Задачи, привычки, заметки и проекты собираются в одной системе',
      'Приложение создаётся под конкретный сценарий клиента',
      'Есть база для добавления ИИ, уведомлений и синхронизации',
      'Проект показывает, что Симба может делать не только сайты, но и полноценные приложения',
    ],
    screenshots: [
      { src: '/cases/aura/screen-1.jpg', alt: 'Главный экран приложения Аура' },
      { src: '/cases/aura/screen-2.jpg', alt: 'Интерфейс приложения Аура' },
      { src: '/cases/aura/screen-3.jpg', alt: 'Функции приложения Аура' },
    ],
  },
]

const DEFAULT_ACTIVE_ID = 'sweet-mommy'

export default function NicheCases() {
  const [activeId, setActiveId] = useState(DEFAULT_ACTIVE_ID)
  const activeCase = projectCases.find((project) => project.id === activeId) ?? projectCases[0]

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
            {projectCases.map((project) => {
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
                <p className="mt-2 text-base font-medium text-accent-dark">{activeCase.shortText}</p>
                <p className="mt-4 text-base leading-relaxed text-text-muted">{activeCase.description}</p>

                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Что реализовано</h4>
                  <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {activeCase.implemented.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-main">
                        <IconCheckSmall className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">
                    {activeCase.benefitsHeading}
                  </h4>
                  <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {activeCase.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-text-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#audit" className="btn-primary">
                    Хочу похожую систему
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
                    <a href="#audit" className="btn-secondary">
                      Обсудить проект
                    </a>
                  )}
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
          <a href="#audit" className="btn-primary shrink-0">
            Получить бесплатный разбор
          </a>
        </div>
      </div>
    </section>
  )
}
