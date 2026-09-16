function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

type LossFlowDiagramProps = {
  // 'idle' = slow ambient pulse (intro screen). 'active' = faster pulse and a
  // highlighted leak synced with the calculating captions.
  variant?: 'idle' | 'active'
  activeLeak?: 0 | 1 | 2 | null
  className?: string
}

const NODES: { x: number; lines: string[] }[] = [
  { x: 30, lines: ['Обращение'] },
  { x: 210, lines: ['Ответ'] },
  { x: 390, lines: ['Заказ'] },
  { x: 570, lines: ['Повторная', 'продажа'] },
]

const LEAKS = [
  { x: 120, label: 'Не успели ответить' },
  { x: 300, label: 'Не завершили заказ' },
  { x: 480, label: 'Ручная работа' },
]

// Decorative-only funnel metaphor — not a data visualization. Pure SVG, no
// animation library; the traveling dot is SMIL (<animate>), which CSS's
// prefers-reduced-motion can't pause directly, so it's simply not rendered
// when the user has that preference set.
export default function LossFlowDiagram({ variant = 'idle', activeLeak = null, className = '' }: LossFlowDiagramProps) {
  return (
    <svg
      viewBox="0 0 600 168"
      className={`w-full ${className}`}
      role="img"
      aria-label="Путь заявки: обращение, ответ, заказ, повторная продажа — с точками, где бизнес теряет клиентов и время"
    >
      <defs>
        <linearGradient id="flowLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      <line x1="30" y1="70" x2="570" y2="70" stroke="url(#flowLine)" strokeWidth="2" />

      {LEAKS.map((leak, i) => (
        <g key={leak.label} className="text-text-muted">
          <path
            d={`M ${leak.x} 70 Q ${leak.x + 26} 100 ${leak.x + 30} 128`}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity={activeLeak === i ? 0.9 : 0.4}
            strokeWidth={activeLeak === i ? 2 : 1.5}
            className="transition-[stroke-opacity,stroke-width] duration-300 motion-reduce:transition-none"
          />
          <circle
            cx={leak.x + 30}
            cy="128"
            r={activeLeak === i ? 4.5 : 3.5}
            fill="var(--accent)"
            fillOpacity={activeLeak === i ? 1 : 0.6}
            className="transition-[r,fill-opacity] duration-300 motion-reduce:transition-none"
          />
          <text
            x={leak.x + 30}
            y="146"
            textAnchor="middle"
            fontSize="11"
            fill="currentColor"
            className={activeLeak === i ? 'font-semibold text-accent-dark' : 'text-text-muted'}
          >
            {leak.label}
          </text>
        </g>
      ))}

      {NODES.map((node) => (
        <g key={node.lines.join(' ')}>
          <circle cx={node.x} cy="70" r="5" fill="var(--accent-dark)" />
          <text x={node.x} y={node.lines.length > 1 ? 22 : 30} textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor" className="text-text-main">
            {node.lines.map((line, i) => (
              <tspan key={line} x={node.x} dy={i === 0 ? 0 : 13}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      ))}

      {!prefersReducedMotion() && (
        <circle r="5" fill="var(--accent)" cy="70">
          <animate attributeName="cx" values="30;570" dur={variant === 'active' ? '1.1s' : '3.4s'} repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.08;0.92;1"
            dur={variant === 'active' ? '1.1s' : '3.4s'}
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  )
}
