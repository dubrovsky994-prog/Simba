import { IconBot, IconChart, IconGear, IconInbox, IconSite, IconUsers } from './icons'

const FEATURES = [
  {
    icon: IconSite,
    title: 'Сайт или мини-магазин',
    text: 'Быстрый и понятный сайт, где клиент видит товар, услугу и может оставить заявку.',
  },
  {
    icon: IconBot,
    title: 'Telegram / MAX-бот',
    text: 'Приём заказов, ответы, уведомления и повторные касания с клиентами.',
  },
  {
    icon: IconInbox,
    title: 'Заявки в одном месте',
    text: 'Не теряете сообщения из разных каналов и быстрее отвечаете клиентам.',
  },
  {
    icon: IconUsers,
    title: 'Клиентская база',
    text: 'Покупатели остаются с вами, а не только на маркетплейсе или в соцсетях.',
  },
  {
    icon: IconGear,
    title: 'Автоматизация',
    text: 'Уведомления, акции, повторные продажи и меньше ручной рутины.',
  },
  {
    icon: IconChart,
    title: 'Аналитика',
    text: 'Понимаете, откуда приходят клиенты и что реально приносит деньги.',
  },
]

export default function WhatWeCreate() {
  return (
    <section id="features" className="py-12 sm:py-16">
      <div className="container-px">
        <div className="max-w-2xl">
          <span className="section-eyebrow">Возможности</span>
          <h2 className="section-title mt-4">Решения, которые увеличивают продажи</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="card card-hover p-4 sm:p-5">
              <div className="neu-chip flex h-12 w-12 items-center justify-center text-accent">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-text-main">{feature.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
