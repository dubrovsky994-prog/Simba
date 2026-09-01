import { IconMail, IconPhone, IconTelegram } from './icons'
import WaveLines from './WaveLines'
import simbaMark from '../assets/simba/brand/simba-mark-original.png'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF, CONTACT_TELEGRAM, CONTACT_TELEGRAM_URL } from '../legal/content'

const CONTACTS = [
  { icon: IconPhone, label: 'Телефон', value: CONTACT_PHONE_DISPLAY, href: CONTACT_PHONE_HREF },
  { icon: IconMail, label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: IconTelegram, label: 'Telegram', value: CONTACT_TELEGRAM, href: CONTACT_TELEGRAM_URL },
]

const NAV_LINKS = [
  { label: 'Возможности', href: '#features' },
  { label: 'Для кого', href: '#for-whom' },
  { label: 'Тарифы', href: '#pricing' },
  { label: 'Как работает', href: '#how-it-works' },
]

const DOC_LINKS = [
  { label: 'Политика обработки персональных данных', href: '/privacy' },
  { label: 'Согласие на обработку персональных данных', href: '/consent' },
  { label: 'Условия использования сайта', href: '/terms' },
  { label: 'Политика cookies', href: '/cookies' },
]

export default function Footer() {
  return (
    <footer id="contacts" className="relative overflow-hidden border-t border-border bg-bg-section">
      <WaveLines className="pointer-events-none absolute -bottom-10 -left-10 hidden h-56 w-80 lg:block" />
      <div className="container-px relative py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.8fr_0.9fr_1.1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="neu-chip flex h-14 w-14 items-center justify-center p-1.5">
                <img src={simbaMark} alt="" className="h-full w-full object-contain" />
              </span>
              <span className="text-2xl font-bold text-text-main">SIMBA</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              Цифровые системы продаж для малого и среднего бизнеса.
            </p>
            <a href="#audit" className="btn-primary mt-6">
              Получить бесплатный разбор
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Навигация</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-text-main transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Контакты</h3>
            <ul className="mt-5 flex flex-col gap-3.5">
              {CONTACTS.map((contact) => (
                <li key={contact.label} className="flex items-center gap-2.5 text-sm text-text-main">
                  <span className="neu-chip flex h-8 w-8 shrink-0 items-center justify-center text-accent-dark">
                    <contact.icon className="h-3.5 w-3.5" />
                  </span>
                  <a href={contact.href} className="transition-colors duration-200 hover:text-accent-dark">
                    {contact.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Документы</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {DOC_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-text-main transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-text-muted">
            Информация на сайте не является публичной офертой. Окончательные условия фиксируются в договоре,
            брифе или техническом задании.
          </p>
          <div className="mt-4 flex flex-col gap-3 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} SIMBA. Все права защищены.</span>
            <span>Цифровые системы продаж для малого и среднего бизнеса</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
