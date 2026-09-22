import { INITIAL_APPOINTMENTS, SERVICES } from '../../lib/beauty/demoData'

const MODULE_LABELS = ['Онлайн-запись', 'CRM клиентов', 'Напоминания и рассылки', 'Аналитика и рост']

const clientCount = new Set(INITIAL_APPOINTMENTS.map((a) => a.client)).size

// Read-only preview — sources the same seed data as the BeautyCoreDemo modal,
// but never mutates it, so this marketing preview can't drift out of sync
// with (or accidentally reset) whatever a visitor did inside the real demo.
// Shows only numbers the demo actually computes — no repeat-rate or other
// figure that isn't real anywhere in the codebase.
export default function BeautyWidgetPreview() {
  return (
    <div className="public-v2-beauty-widget" aria-label="Предпросмотр Beauty Core">
      <div className="public-v2-beauty-widget__stats">
        <div className="public-v2-beauty-widget__stat">
          <span>Записей сегодня</span>
          <strong>{INITIAL_APPOINTMENTS.length}</strong>
        </div>
        <div className="public-v2-beauty-widget__stat">
          <span>Клиентов в базе</span>
          <strong>{clientCount}</strong>
        </div>
      </div>

      <ul className="public-v2-beauty-widget__list">
        {INITIAL_APPOINTMENTS.map((appointment) => (
          <li key={appointment.id}>
            <span>{appointment.time} · {appointment.client}</span>
            <span>{appointment.service}</span>
          </li>
        ))}
      </ul>

      <ul className="public-v2-beauty-widget__list" aria-label="Услуги">
        {SERVICES.map((service) => (
          <li key={service.name}>
            <span>{service.name}</span>
            <span>{service.duration}</span>
          </li>
        ))}
      </ul>

      <div className="public-v2-beauty-widget__chips">
        {MODULE_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}
