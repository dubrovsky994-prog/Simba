import { useState } from 'react'
import PaperMorphAvatar from '../avatar/PaperMorphAvatar'
import MasterIcon from './MasterIcon'
import { sbaAccent, sbaToPaperMorph, type SbaState } from '../../lib/sba/state'
import type { WorkspaceState } from './navigation'

const CAPABILITIES = ['Принимает и фиксирует заявки', 'Замечает потери', 'Напоминает клиентам', 'Предлагает следующий шаг']

type DemoStepId = 'listening' | 'analyzing' | 'suggesting' | 'acting'

const DEMO_STEPS: { id: DemoStepId; label: string; sba: SbaState; copy: string }[] = [
  { id: 'listening', label: 'Слушает', sba: 'listening', copy: 'SBA собирает контекст: заявки, клиентов, действия и важные события.' },
  { id: 'analyzing', label: 'Анализирует', sba: 'thinking', copy: 'Сопоставляет данные и ищет места, где теряются деньги, время или клиенты.' },
  { id: 'suggesting', label: 'Подсказывает', sba: 'insight', copy: '8 заявок за неделю остались без следующего действия.' },
  { id: 'acting', label: 'Действует', sba: 'action', copy: 'SBA может создать следующий шаг, напомнить, обновить данные или запустить подключённый сценарий.' },
]

export default function SbaPreview({ onSelect }: { onSelect: (state: WorkspaceState) => void }) {
  const [demoId, setDemoId] = useState<DemoStepId>('listening')
  const [overlayOpen, setOverlayOpen] = useState(false)
  const demo = DEMO_STEPS.find((step) => step.id === demoId) ?? DEMO_STEPS[0]
  const avatarState: SbaState = overlayOpen ? 'greeting' : demo.sba
  const accent = sbaAccent(avatarState)

  return (
    <div className="sba-preview">
      <div className="master-ai-preview">
        <div className={`sba-avatar-wrap master-ai-orbit`} data-sba-accent={accent ?? undefined}>
          <PaperMorphAvatar size={300} state={sbaToPaperMorph(avatarState)} onActivate={() => setOverlayOpen((v) => !v)} />
          <span>SBA · powered by SIMBA AI</span>
          {overlayOpen && (
            <div className="sba-overlay" role="dialog" aria-label="SBA">
              <p>Я SBA.<br />Хотите показать мне свой бизнес?</p>
              <button type="button" className="master-button" onClick={() => onSelect('diagnostics')}>
                Начать диагностику<MasterIcon name="arrow" />
              </button>
            </div>
          )}
        </div>
        <div>
          <span className="master-eyebrow">SBA · SMART BUSINESS ASSISTANT</span>
          <p className="sba-lead">Цифровой помощник, который понимает ваш бизнес, замечает важное и помогает с повторяющейся работой.</p>
          <p className="sba-main-phrase">SBA следит за рутиной. Вы подключаетесь только там, где действительно нужен человек.</p>
          <ul>
            {CAPABILITIES.map((text) => (
              <li key={text}><MasterIcon name="ai" />{text}</li>
            ))}
          </ul>
          <small>Демонстрация интерфейса. Подключение к данным и автоматические действия здесь не реализованы.</small>
        </div>
      </div>

      <div className="sba-demo">
        <div className="sba-demo-tabs" role="tablist" aria-label="Как работает SBA">
          {DEMO_STEPS.map((step, index) => (
            <button key={step.id} type="button" role="tab" aria-selected={demoId === step.id} onClick={() => setDemoId(step.id)}>
              {step.label}
              {index < DEMO_STEPS.length - 1 && <i aria-hidden="true">→</i>}
            </button>
          ))}
        </div>
        <div key={demo.id} className="sba-demo-panel case-fade-in">
          <p>{demo.copy}</p>
          {demo.id === 'suggesting' && <strong>Можно исправить.</strong>}
        </div>
        <p className="sba-demo-note">Здесь показан принцип работы SBA. При внедрении возможности подключаются под процессы конкретного бизнеса.</p>
      </div>
    </div>
  )
}
