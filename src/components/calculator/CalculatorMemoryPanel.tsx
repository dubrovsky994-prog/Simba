import type { MemoryItem } from '../../lib/calculator/memory'

type CalculatorMemoryPanelProps = {
  items: MemoryItem[]
  insight: { title: string; text: string } | null
}

function pluralizeThings(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return 'вещь'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'вещи'
  return 'вещей'
}

function MemoryList({ items, insight }: CalculatorMemoryPanelProps) {
  return (
    <ul className="calc-memory-list">
      {items.map((item) => (
        <li key={item.id} className="calc-memory-item">
          <span className="calc-memory-item__label">{item.label}</span>
          <span className="calc-memory-item__value">{item.value}</span>
        </li>
      ))}
      {insight && (
        <li key="insight" className="calc-memory-item calc-memory-item--insight">
          <span className="calc-memory-item__label">{insight.title}</span>
          <span className="calc-memory-item__note">{insight.text}</span>
        </li>
      )}
    </ul>
  )
}

// "Что я уже понял" — replaces the static explainer aside once the diagnostic
// starts (spec item 9). Desktop shows the growing list plainly; mobile keeps
// it out of the way as a collapsible card (spec item 16).
export default function CalculatorMemoryPanel({ items, insight }: CalculatorMemoryPanelProps) {
  if (items.length === 0) return null
  const count = items.length + (insight ? 1 : 0)

  return (
    <aside className="public-v2-calc-shell__explainer calc-memory-panel" aria-label="Что SBA уже понял о вашем бизнесе">
      <span className="public-v2-kicker">SBA</span>
      <h4 className="calc-memory-panel__desktop-title">Что я уже понял</h4>
      <details className="calc-memory-panel__mobile">
        <summary>
          SBA уже понял {count} {pluralizeThings(count)} <i aria-hidden="true">↑</i>
        </summary>
        <MemoryList items={items} insight={insight} />
      </details>
      <div className="calc-memory-panel__desktop">
        <MemoryList items={items} insight={insight} />
      </div>
    </aside>
  )
}
