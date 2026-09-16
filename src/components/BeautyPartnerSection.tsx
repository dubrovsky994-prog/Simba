import { useState } from 'react'
import BeautyCoreDemo from './BeautyCoreDemo'

export default function BeautyPartnerSection() {
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  return <section className="public-v2-beauty-partner" aria-label="SIMBA Beauty и SIMBA Partner"><div className="container-px public-v2-beauty-partner__grid"><article className="public-v2-beauty"><p className="public-v2-kicker">SIMBA Beauty</p><h2>Вертикальная система<br />для Beauty.</h2><p>Запись → клиент → напоминание → возврат → аналитика.</p><button type="button" onClick={() => setIsDemoOpen(true)} className="public-v2-button">Открыть Beauty demo <span>↗</span></button><small>Демо работает локально в текущей сессии.</small></article><article className="public-v2-partner"><p className="public-v2-kicker">SIMBA Partner</p><h2>Не нужно покупать<br />большую систему сразу.</h2><p>Начать с малого, доказать результат и расширять систему тогда, когда она уже помогает бизнесу.</p><ol><li>Начать</li><li>Доказать результат</li><li>Расширять</li></ol></article></div>{isDemoOpen && <BeautyCoreDemo onClose={() => setIsDemoOpen(false)} />}</section>;
}
