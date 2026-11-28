type Product = { name: string; audience: string; result: string; tone: 'ink' | 'paper' | 'aqua' | 'purple'; marker: string };

const products: Product[] = [
  { name: 'SIMBA Systems', audience: 'Бизнесу, который теряет заявки между точками контакта.', result: 'Собирает продажи в понятный маршрут.', tone: 'ink', marker: '01 / основа' },
  { name: 'SIMBA Beauty', audience: 'Beauty-командам, которым нужен аккуратный цифровой контур.', result: 'Упрощает путь клиента от записи до возвращения.', tone: 'paper', marker: '02 / вертикаль' },
  { name: 'SIMBA AI', audience: 'Владельцу, который хочет видеть сигналы раньше проблем.', result: 'Помогает не терять заявки и снижать ручную работу.', tone: 'purple', marker: '03 / интеллект' },
  { name: 'SIMBA Partner', audience: 'Тем, кто хочет начать с малого и доказать результат.', result: 'Даёт путь к системе без лишнего риска.', tone: 'aqua', marker: '04 / рост' },
];

export default function ProductArchitecture() {
  return <section id="solutions" className="public-v2-products" aria-labelledby="public-products-title">
    <div className="container-px"><header className="public-v2-section-heading"><div><p className="public-v2-kicker">Семейство продуктов SIMBA</p><h2 id="public-products-title">Одна система.<br />Четыре понятных входа.</h2></div><p>Выбираем не технологию, а ближайшую бизнес-задачу — и собираем путь дальше.</p></header>
      <div className="public-v2-product-strip">{products.map((product) => <article className={`public-v2-product public-v2-product--${product.tone}`} key={product.name}><span>{product.marker}</span><h3>{product.name}</h3><p>{product.audience}</p><strong>{product.result}</strong><i aria-hidden="true">↗</i></article>)}</div>
    </div>
  </section>;
}
