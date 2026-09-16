const questions = [
  ['С чего начать?', 'С короткого разбора: посмотрим путь клиента, точки потерь и выберем один следующий шаг.'],
  ['Нужно сразу менять весь сайт?', 'Нет. Сначала определяем участок, где изменение даст наибольший эффект, и собираем работу вокруг него.'],
  ['SIMBA AI заменяет команду?', 'Нет. Это слой, который собирает сигналы и помогает владельцу держать решения и действия в фокусе.'],
  ['Можно начать с одной задачи?', 'Да. Разбор, упаковка услуги, маршрут заявки или Beauty Core могут стать отдельной точкой входа.'],
]

export default function PublicFaq() {
  return <section className="public-v2-faq" aria-labelledby="public-faq-title"><div className="container-px"><p className="public-v2-kicker">Вопросы / коротко</p><div className="public-v2-faq__head"><h2 id="public-faq-title">Сначала — ясность.<br />Потом — система.</h2><p>Без обязательства «переделать всё». Начинаем с места, где бизнесу важнее всего не терять клиентов.</p></div><div className="public-v2-faq__list">{questions.map(([question, answer], index) => <details key={question}><summary><span>0{index + 1}</span>{question}<i aria-hidden="true">+</i></summary><p>{answer}</p></details>)}</div></div></section>
}
