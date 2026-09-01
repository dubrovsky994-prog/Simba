import { useState } from 'react'
import { IconCheck, IconChevronDown } from './icons'

const QUESTIONS = [
  {
    q: 'Вы просто делаете сайты?',
    lead: 'Нет. Мы выстраиваем путь клиента.',
    a: 'Сайт — только точка входа. Мы связываем её с заявками, заказами, клиентской базой и повторными продажами, чтобы каждый следующий шаг работал на бизнес.',
  },
  {
    q: 'Подойдёт ли это моей нише?',
    lead: 'Скорее всего — если у вас есть обращения клиентов.',
    a: 'На разборе мы не продаём одинаковый набор всем. Смотрим, как люди выбирают и покупают именно у вас, затем оставляем только те модули, которые решают реальные задачи.',
  },
  {
    q: 'Можно начать с малого?',
    lead: 'Да. И чаще всего это самый разумный старт.',
    a: 'Сначала запускаем минимальный рабочий контур: понятное предложение, точку заявки и учёт обращений. Бота, аналитику и автоматизацию добавляем тогда, когда они действительно нужны.',
  },
  {
    q: 'Нужно ли мне самому разбираться в технологиях?',
    lead: 'Нет. От вас — бизнес, от нас — технология.',
    a: 'Вы говорите о клиентах, продажах и процессах привычными словами. Мы сами подбираем инструменты, настраиваем связки и объясняем решения без технического тумана.',
  },
  {
    q: 'Что будет после запуска?',
    lead: 'Мы не исчезаем после кнопки «Опубликовать».',
    a: 'Проверяем путь заявки, смотрим данные, устраняем узкие места и постепенно развиваем систему — добавляем рекламу, новые сценарии и автоматизацию по мере роста.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-20">
      <div className="container-px">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="section-eyebrow">Без сложных слов</span>
            <h2 className="section-title mt-4">Вопросы, которые обычно остаются за кадром</h2>
            <p className="section-subtitle max-w-md">
              Нажмите на вопрос — ответим так же, как на первой встрече: коротко, честно и по делу.
            </p>
            <div className="mt-7 hidden items-center gap-3 text-sm font-medium text-accent-dark lg:flex">
              <span className="h-px w-10 bg-accent/70" />
              <span>Симба объясняет просто</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
          {QUESTIONS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={item.q}
                className={`w-full overflow-hidden rounded-[22px] transition-all duration-300 ${
                  isOpen
                    ? 'border border-accent/70 bg-[rgba(255,255,255,0.82)] shadow-glow'
                    : 'border border-[var(--line-neutral)] bg-[rgba(255,255,255,0.58)] shadow-neu hover:-translate-y-0.5 hover:border-accent/35'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors duration-300 ${
                      isOpen ? 'bg-accent text-white' : 'bg-accent/10 text-accent-dark'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1 break-words text-base font-semibold text-text-main sm:text-lg">
                    {item.q}
                  </span>
                  <span className="neu-chip flex h-9 w-9 shrink-0 items-center justify-center">
                    <IconChevronDown
                      className={`h-4 w-4 text-accent transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="mx-5 mb-5 rounded-2xl border border-accent/20 bg-accent/[0.06] p-5 sm:mx-6 sm:p-6">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                          <IconCheck className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-semibold leading-relaxed text-text-main">{item.lead}</p>
                          <p className="mt-2 text-sm leading-7 text-text-muted sm:text-[15px]">{item.a}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}
