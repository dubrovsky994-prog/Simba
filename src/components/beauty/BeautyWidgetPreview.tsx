export default function BeautyWidgetPreview() {
  return (
    <div className="public-v2-beauty-widget beauty-live-preview" aria-label="Предпросмотр Beauty Core">
      <header><span>LUMI Beauty Studio</span><i>LIVE DEMO</i></header>
      <div className="public-v2-beauty-widget__stats">
        <div className="public-v2-beauty-widget__stat">
          <span>Записей сегодня</span>
          <strong>8</strong>
        </div>
        <div className="public-v2-beauty-widget__stat">
          <span>Клиенты</span>
          <strong>CRM</strong>
        </div>
      </div>
      <div className="beauty-live-nearest"><span>Ближайшая запись</span><strong>10:00 · Окрашивание</strong><small>Демонстрационные данные без персональных записей</small></div>
      <div className="public-v2-beauty-widget__chips">
        {['Сайт', 'Администратор', 'Мастер', 'Клиент'].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}
