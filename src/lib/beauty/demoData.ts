// Shared seed data for the Beauty Core demo modal (BeautyCoreDemo.tsx) and the
// standalone marketing preview (BeautyWidgetPreview.tsx) — extracted so both
// read the same real numbers instead of two hand-maintained copies drifting apart.
export type DemoAppointment = {
  id: number
  client: string
  service: string
  time: string
  price: number
}

export const SERVICES = [
  { name: 'Маникюр', duration: '1 ч 30 мин', price: 2800 },
  { name: 'Уход за лицом', duration: '1 ч', price: 4500 },
  { name: 'Окрашивание', duration: '2 ч', price: 7200 },
]

export const INITIAL_APPOINTMENTS: DemoAppointment[] = [
  { id: 1, client: 'Клиент 01', service: 'Маникюр', time: '10:00', price: 2800 },
  { id: 2, client: 'Клиент 02', service: 'Уход за лицом', time: '12:30', price: 4500 },
  { id: 3, client: 'Клиент 03', service: 'Окрашивание', time: '15:00', price: 7200 },
]
