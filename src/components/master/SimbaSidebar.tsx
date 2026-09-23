import lionMark from '../../assets/simba/brand/simba-mark-original.png'
import MasterIcon from './MasterIcon'
import { SIDEBAR_ITEMS, type WorkspaceState } from './navigation'

export default function SimbaSidebar({ active, onSelect }: { active: WorkspaceState; onSelect: (state: WorkspaceState) => void }) {
  return <aside className="master-sidebar">
    <button className="master-brand" onClick={() => onSelect('home')} aria-label="SIMBA — на главную"><img src={lionMark} alt="" /><strong>SIMBA</strong><span>СИСТЕМЫ<br />РОСТА БИЗНЕСА</span></button>
    <nav aria-label="Навигация SIMBA">{SIDEBAR_ITEMS.map(item => <button key={item.id} aria-current={active === item.id ? 'page' : undefined} onClick={() => onSelect(item.id)}><MasterIcon name={item.icon} /><span>{item.label}</span></button>)}</nav>
    <div className="master-sidebar-bottom"><p>Больше<br />клиентов.<br />Больше свободы.<br />Больше жизни.</p><span className="master-sidebar-rule" /><small>A RICHER YOU.</small><div className="master-location"><MasterIcon name="pin" /><span>Пенза, Россия<br />Работаем по всей России</span></div></div>
  </aside>
}
