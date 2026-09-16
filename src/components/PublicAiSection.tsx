import PaperMorphAvatar from './avatar/PaperMorphAvatar'

const flow = ['Сигнал', 'Анализ', 'Рекомендация', 'Действие', 'Контроль']

export default function PublicAiSection() {
  return <section id="public-simba-ai" className="public-v2-ai-section" aria-labelledby="public-ai-title"><div className="container-px public-v2-ai-section__grid"><div><p className="public-v2-kicker">SIMBA AI / интеллектуальный слой</p><h2 id="public-ai-title">Не чат.<br /><span>AI-администратор</span><br />бизнеса.</h2><p>Собирает сигналы, показывает где теряются клиенты, предлагает следующий шаг и держит важные действия в поле зрения.</p><div className="public-v2-ai-section__flow" aria-label="Как работает SIMBA AI">{flow.map((item, index) => <span key={item}>{item}{index < flow.length - 1 && <i aria-hidden="true">→</i>}</span>)}</div></div><div className="public-v2-ai-section__avatar"><span>SIMBA AI <i /> в контуре</span><PaperMorphAvatar state="idle" size={420} /></div></div></section>;
}
