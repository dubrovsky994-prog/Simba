const transitions = [
  ['Клиенты не теряются', 'Система собирает обращения и показывает следующий шаг.'],
  ['Меньше ручной работы', 'Повторяющиеся действия становятся понятным процессом.'],
  ['Видно, где деньги', 'Вместо догадок — точки роста, которые можно проверить.'],
];

export default function PublicTransition() {
  return <section className="public-v2-transition" aria-labelledby="public-transition-title">
    <div className="container-px public-v2-transition__inner">
      <div><p className="public-v2-kicker">Не очередной набор сервисов</p><h2 id="public-transition-title">Сначала убираем потери.<br />Потом строим рост.</h2></div>
      <div className="public-v2-transition__list">{transitions.map(([title, detail], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{detail}</p></div></article>)}</div>
    </div>
  </section>;
}
