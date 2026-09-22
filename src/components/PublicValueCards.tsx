import { IconChart, IconGear, IconInbox, IconUsers } from './icons'

const CARDS = [
  {
    icon: IconInbox,
    tint: 'rose',
    title: 'Потерянные заявки',
    question: 'Сколько клиентов уходит к конкурентам?',
    note: 'Каждая потерянная заявка — это деньги.',
  },
  {
    icon: IconUsers,
    tint: 'blue',
    title: 'Упущенные повторные продажи',
    question: 'Сколько клиентов не возвращаются?',
    note: 'Лояльность приносит прибыль.',
  },
  {
    icon: IconGear,
    tint: 'amber',
    title: 'Ручная рутина',
    question: 'Сколько времени команда тратит на рутину вместо продаж?',
    note: 'Автоматизация освобождает людей для роста.',
  },
  {
    icon: IconChart,
    tint: 'aqua',
    title: 'Потенциал роста',
    question: 'На сколько может вырасти ваш бизнес?',
    note: 'Чёткие процессы = больше свободы.',
  },
] as const

export default function PublicValueCards() {
  return (
    <ul className="public-v2-value-cards" aria-label="Где бизнес теряет деньги">
      {CARDS.map(({ icon: Icon, tint, title, question, note }) => (
        <li key={title} className={`public-v2-value-card public-v2-value-card--${tint}`}>
          <span className="public-v2-value-card__icon">
            <Icon className="h-4 w-4" />
          </span>
          <h3>{title}</h3>
          <p>{question}</p>
          <span className="public-v2-note public-v2-note--tight">{note}</span>
        </li>
      ))}
    </ul>
  )
}
