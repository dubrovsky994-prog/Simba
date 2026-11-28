import type { SbaState } from './state'
import { readCalculatorSessionSummary } from '../calculator/session'

export type SimulationFrame = {
  id: string
  // null keeps whatever event is already on screen — the EVENT layer only
  // changes when a genuinely new thing happens, not on every beat.
  event: string | null
  status: string
  result: string | null
  sbaState: SbaState
  durationMs?: number
  history?: { time: string; text: string }[]
  badge?: { label: string; text: string }
  // Marks where "Следующий пример" jumps to.
  scenarioStart?: boolean
}

const DEFAULT_MS = 2400
const OBSERVE_MS = 2800
const SIGNAL_MS = 1900
const HUMAN_MS = 3600

// Scenario A — REACT: a fresh lead arrives, SBA understands the context and
// prepares the next step by itself.
const SCENARIO_A: SimulationFrame[] = [
  { id: 'a-signal', scenarioStart: true, event: 'Новая заявка · Анна · кухня на заказ · 14:32', status: 'ПОЛУЧИЛ СИГНАЛ', result: null, sbaState: 'listening', durationMs: SIGNAL_MS },
  { id: 'a-check', event: null, status: 'ПРОВЕРЯЮ', result: 'Новый клиент · ответа ещё не было', sbaState: 'thinking' },
  { id: 'a-decide', event: null, status: 'РЕШЕНИЕ', result: 'Собрать размеры, бюджет и желаемый срок', sbaState: 'insight' },
  { id: 'a-act', event: null, status: 'БЕРУ НА СЕБЯ', result: 'Подготовлю заявку менеджеру', sbaState: 'action' },
  {
    id: 'a-done',
    event: null,
    status: 'ГОТОВО',
    result: 'Следующий шаг назначен',
    sbaState: 'done',
    history: [{ time: '14:32', text: 'Заявка принята' }, { time: '14:33', text: 'Следующий шаг подготовлен' }],
  },
]

// Scenario B — NOTICE (generic): SBA doesn't just react, it finds a pattern
// across several events.
const SCENARIO_B_GENERIC: SimulationFrame[] = [
  { id: 'b-signal', scenarioStart: true, event: '3 заявки без ответа более 40 минут', status: 'ПОЛУЧИЛ СИГНАЛ', result: null, sbaState: 'listening', durationMs: SIGNAL_MS },
  { id: 'b-check', event: null, status: 'ПРОВЕРЯЮ СВЯЗЬ', result: null, sbaState: 'thinking' },
  { id: 'b-insight', event: null, status: 'НАШЁЛ СВЯЗЬ', result: 'Все 3 обращения пришли после 18:00', sbaState: 'insight' },
  { id: 'b-decide', event: null, status: 'РЕШЕНИЕ', result: 'Принимать первичные обращения автоматически вечером', sbaState: 'action' },
  { id: 'b-done', event: null, status: 'ГОТОВО', result: 'Рекомендация сохранена', sbaState: 'done', history: [{ time: '18:47', text: 'Найдена вечерняя закономерность' }] },
]

// Scenario B — NOTICE (personalized): same beats, but grounded in the
// visitor's own completed diagnostic instead of a generic example.
function scenarioBPersonalized(missedCount: number): SimulationFrame[] {
  return [
    { id: 'b-signal-p', scenarioStart: true, event: 'На основе вашей диагностики', status: 'СОПОСТАВЛЯЮ ОТВЕТЫ', result: null, sbaState: 'listening', durationMs: SIGNAL_MS },
    { id: 'b-insight-p', event: null, status: 'ПО ВАШИМ ОТВЕТАМ', result: `Около ${missedCount} обращений в месяц находятся в зоне риска.`, sbaState: 'insight' },
    {
      id: 'b-decide-p',
      event: null,
      status: 'РЕШЕНИЕ',
      result: 'При вашем среднем чеке я бы первым подключил контроль входящих заявок.',
      sbaState: 'action',
      badge: { label: 'НАВЫК ДЛЯ ВАШЕГО SBA', text: 'Контроль заявок' },
    },
    { id: 'b-done-p', event: null, status: 'ГОТОВО', result: 'Навык добавлен в рекомендации', sbaState: 'done', history: [{ time: 'сегодня', text: 'Найдена персональная закономерность' }] },
  ]
}

// Scenario C — KNOW ITS BOUNDARY: SBA checks the rule and hands the decision
// to a human instead of guessing. This is the one that must never be skipped.
const SCENARIO_C: SimulationFrame[] = [
  { id: 'c-signal', scenarioStart: true, event: 'Клиент просит скидку 18%', status: 'ПОЛУЧИЛ СИГНАЛ', result: null, sbaState: 'listening', durationMs: SIGNAL_MS },
  { id: 'c-check', event: null, status: 'ПРОВЕРЯЮ ПРАВИЛА', result: null, sbaState: 'thinking' },
  {
    id: 'c-human',
    event: null,
    status: 'НУЖЕН ЧЕЛОВЕК',
    result: 'Скидка выходит за установленные правила',
    sbaState: 'humanRequired',
    durationMs: HUMAN_MS,
    history: [{ time: '16:05', text: 'Решение передано человеку' }],
  },
]

// Scenario D — CLOSE THE LOOP: an allowed action is taken and followed all
// the way to a visible result, not just a recommendation.
const SCENARIO_D: SimulationFrame[] = [
  { id: 'd-act', scenarioStart: true, event: 'Клиенту пора напомнить о записи', status: 'БЕРУ НА СЕБЯ', result: 'Напоминание отправлено', sbaState: 'action' },
  { id: 'd-wait', event: null, status: 'НАБЛЮДАЮ', result: 'Жду ответ клиента', sbaState: 'idle', durationMs: OBSERVE_MS },
  { id: 'd-signal', event: 'Клиент ответил', status: 'ПОЛУЧИЛ СИГНАЛ', result: null, sbaState: 'listening', durationMs: SIGNAL_MS },
  {
    id: 'd-done',
    event: null,
    status: 'ГОТОВО',
    result: 'Следующий шаг назначен',
    sbaState: 'done',
    history: [{ time: '15:10', text: 'Напоминание отправлено' }, { time: '15:26', text: 'Клиент ответил' }],
  },
]

function observe(id: string): SimulationFrame {
  // event: '' (not null) explicitly clears the event line — SBA has calmly
  // returned to watching, the previous event is resolved and gone. Not a
  // scenarioStart: "Следующий пример" should skip to the next actual
  // demonstration, not to an idle beat.
  return { id, event: '', status: 'НАБЛЮДАЮ', result: 'Новых важных событий пока нет.', sbaState: 'idle', durationMs: OBSERVE_MS }
}

// One continuous loop — observation beats between each demonstration keep it
// reading as a single ongoing intelligence rather than four separate cards.
export function buildSimulationFrames(): SimulationFrame[] {
  const summary = readCalculatorSessionSummary()
  const scenarioB = summary ? scenarioBPersonalized(summary.missedCount) : SCENARIO_B_GENERIC

  return [
    observe('observe-0'),
    ...SCENARIO_A,
    observe('observe-1'),
    ...scenarioB,
    observe('observe-2'),
    ...SCENARIO_C,
    observe('observe-3'),
    ...SCENARIO_D,
  ]
}

export function frameDuration(frame: SimulationFrame): number {
  return frame.durationMs ?? DEFAULT_MS
}
