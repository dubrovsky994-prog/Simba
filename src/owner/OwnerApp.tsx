import { createContext, useContext, useEffect, useRef, useState, type ChangeEvent, type MouseEvent, type ReactNode } from 'react'
import simbaMark from '../assets/simba/brand/simba-mark-original.png'
import PaperMorphAvatar from '../components/avatar/PaperMorphAvatar'
import { daysFromToday, decisionLabels, demoData, getPulse, isOverdue, money, needsDecision, projectLabels, shortDate, skillLabels, syncProjectSkills, today, type ActionLog, type Decision, type DecisionStatus, type Opportunity, type OwnerData, type SkillItem } from './model'
import { localRepository, parseData, type DataMode } from './repository'
import { ownerModules } from './modules'
import RecordEditor, { type Editor, type SavedRecord } from './RecordEditor'
import SkillEditor from './SkillEditor'
import './owner.css'

const SectionContext = createContext('today')
const activeModules = ownerModules.filter(m => m.available)
const sectionFromHash = () => activeModules.find(m => `#${m.id}` === window.location.hash)?.id || 'today'

function Section({ id, eyebrow, title, action, children }: { id: string; eyebrow: string; title: string; action?: ReactNode; children: ReactNode }) {
  const activeSection = useContext(SectionContext)
  if (activeSection !== id) return null
  return <section id={id} className="owner-section" aria-labelledby={`${id}-title`}>
    <div className="owner-section-head"><div><p className="owner-eyebrow">{eyebrow}</p><h1 id={`${id}-title`} tabIndex={-1}>{title}</h1></div>{action}</div>{children}
  </section>
}
function Empty({ children }: { children: ReactNode }) { return <p className="owner-empty">{children}</p> }

export default function OwnerApp() {
  const [mode, setMode] = useState<DataMode>('personal')
  const [snapshot, setSnapshot] = useState(() => localRepository.load('personal'))
  const [notice, setNotice] = useState('')
  const [editor, setEditor] = useState<Editor | null>(null)
  const [skillEditor, setSkillEditor] = useState<SkillItem | 'new' | null>(null)
  const [projectFilter, setProjectFilter] = useState('all')
  const [decisionFilter, setDecisionFilter] = useState('pending')
  const [search, setSearch] = useState('')
  const [brief, setBrief] = useState(false)
  const [skillFilter, setSkillFilter] = useState('all')
  const [moreOpen, setMoreOpen] = useState(false)
  const [section, setSection] = useState(sectionFromHash)
  const focusPage = useRef(false)
  const [, refreshClock] = useState(0)
  const importRef = useRef<HTMLInputElement>(null)
  const restoreRef = useRef<HTMLDialogElement>(null)
  const [restoreData, setRestoreData] = useState<OwnerData | null>(null)
  const data = snapshot.data
  const activity = data.activity || []
  const skillInventory = data.skills || []
  const pulse = getPulse(data)
  const [focusDraft, setFocusDraft] = useState(data.focus)

  useEffect(() => {
    document.title = 'Кабинет владельца · SIMBA'
    const meta = document.createElement('meta')
    meta.name = 'robots'; meta.content = 'noindex, nofollow'; document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => refreshClock(value => value + 1), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const dialog = restoreRef.current
    if (restoreData) dialog?.showModal()
    return () => dialog?.close()
  }, [restoreData])

  useEffect(() => {
    const syncRoute = () => { focusPage.current = true; setSection(sectionFromHash()) }
    window.addEventListener('popstate', syncRoute)
    window.addEventListener('hashchange', syncRoute)
    return () => {
      window.removeEventListener('popstate', syncRoute)
      window.removeEventListener('hashchange', syncRoute)
    }
  }, [])

  useEffect(() => {
    document.title = `${activeModules.find(m => m.id === section)?.name} · Кабинет SIMBA`
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (focusPage.current) {
      document.getElementById(`${section}-title`)?.focus({ preventScroll: true })
      focusPage.current = false
    }
  }, [section])

  function navigate(event: MouseEvent<Element>) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null
    const next = activeModules.find(m => link?.getAttribute('href') === `#${m.id}`)
    if (!next) return
    event.preventDefault()
    if (next.id !== section) {
      window.history.pushState(null, '', `#${next.id}`)
      focusPage.current = true
      setSection(next.id)
      setNotice('')
    } else window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function persist(next: OwnerData, message = 'Сохранено в этом браузере', restoring = false, kind: ActionLog['kind'] = 'data') {
    if (snapshot.error && !restoring) { setNotice('Запись остановлена. Сначала восстановите доступ к хранилищу.'); return false }
    try {
      const logged: OwnerData = { ...next, activity: [{ id: crypto.randomUUID(), at: new Date().toISOString(), title: message, kind }, ...(next.activity || [])].slice(0, 500) }
      const saved = localRepository.save(mode, logged, snapshot.raw)
      setSnapshot(saved); setNotice(message); return true
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Не удалось сохранить данные.'); return false }
  }
  function changeMode() {
    const next = mode === 'personal' ? 'demo' : 'personal'
    const loaded = localRepository.load(next)
    if (next === 'demo' && !loaded.error) {
      const seed = demoData()
      if (!loaded.raw) loaded.data = seed
      else if (!loaded.data.skills.length) loaded.data = {
        ...loaded.data,
        projects: loaded.data.projects.map(project => ({ ...project, skills: project.skills.length ? project.skills : seed.projects.find(item => item.id === project.id)?.skills || [] })),
        skills: seed.skills,
      }
    }
    setMode(next); setSnapshot(loaded); setFocusDraft(loaded.data.focus); setBrief(false); setNotice(''); setSearch('')
  }
  function saveRecord(record: SavedRecord) {
    if (record.kind === 'project') {
      const projects = [...data.projects.filter(p => p.id !== record.value.id), record.value]
      return persist({ ...data, projects, skills: syncProjectSkills(data, record.value) }, `Проект «${record.value.name}» сохранён. Skill Box обновлён.`)
    }
    if (record.kind === 'decision') return persist({ ...data, decisions: [...data.decisions.filter(p => p.id !== record.value.id), record.value] }, `Решение «${record.value.title}» сохранено.`, false, 'decision')
    return persist({ ...data, opportunities: [...data.opportunities.filter(p => p.id !== record.value.id), record.value] }, `Возможность «${record.value.title}» сохранена.`)
  }
  function saveSkill(skill: SkillItem) {
    const duplicate = skillInventory.find(item => item.id !== skill.id && item.name.localeCompare(skill.name, 'ru', { sensitivity: 'base' }) === 0)
    if (duplicate) {
      setNotice(`Навык «${duplicate.name}» уже есть. Откройте его и добавьте источник.`)
      return false
    }
    return persist({ ...data, skills: [...skillInventory.filter(item => item.id !== skill.id), skill].sort((a, b) => a.name.localeCompare(b.name, 'ru')) }, `Навык «${skill.name}» сохранён.`)
  }
  function decide(item: Decision, status: DecisionStatus) {
    persist({ ...data,
      decisions: data.decisions.map(d => d.id === item.id ? { ...d, status, due: status === 'deferred' ? daysFromToday(1) : d.due } : d),
      journal: [{ id: crypto.randomUUID(), at: new Date().toISOString(), title: item.title, from: item.status, to: status }, ...data.journal].slice(0, 1000),
    }, status === 'deferred' ? 'Отложено до завтра. Решение вернётся в очередь автоматически.' : `${decisionLabels[status]}. Запись добавлена в историю.`, false, 'decision')
  }
  function startTest(item: Opportunity) {
    if (item.projectId) { setNotice('Проект для этой возможности уже создан.'); return }
    const projectId = crypto.randomUUID()
    persist({ ...data,
      projects: [...data.projects, { id: projectId, name: item.title, next: item.test, status: 'planned', due: '', progress: 0, budget: 0, received: 0, skills: [] }],
      opportunities: data.opportunities.map(o => o.id === item.id ? { ...o, status: 'testing', projectId } : o),
    }, 'Создан проект проверки. Следующий шаг перенесён из гипотезы.')
  }
  function exportData() {
    const raw = snapshot.error && snapshot.raw ? snapshot.raw : JSON.stringify(data, null, 2)
    const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }))
    const link = document.createElement('a'); link.href = url; link.download = `simba-owner-${mode}-${today()}.json`; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice('Резервная копия подготовлена для скачивания.')
  }
  async function importData(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return
    try {
      if (file.size > 2_000_000) throw new Error('Файл слишком большой (максимум 2 МБ).')
      setRestoreData(parseData(await file.text()))
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Не удалось импортировать файл.') }
    input.value = ''
  }
  const decisions = data.decisions.filter(d => decisionFilter === 'all' || (decisionFilter === 'pending' ? needsDecision(d) : d.status === 'deferred' && !needsDecision(d)))
    .sort((a, b) => Number(b.priority === 'high') - Number(a.priority === 'high') || (a.due || '9999').localeCompare(b.due || '9999'))
  const projects = data.projects.filter(p => (projectFilter === 'all' || p.status === projectFilter) && `${p.name} ${p.next}`.toLocaleLowerCase('ru').includes(search.toLocaleLowerCase('ru')))
  const priorityProjects = data.projects.filter(p => p.status !== 'done').sort((a, b) => Number(b.status === 'blocked') - Number(a.status === 'blocked') || (a.due || '9999').localeCompare(b.due || '9999'))
  const actionsToday = activity.filter(item => item.at.slice(0, 10) === today()).length
  const adminSignals = pulse.decisions + pulse.blocked + pulse.overdue
  const latestActivity = activity.slice(0, 4)
  const filteredSkills = skillInventory.filter(skill => skillFilter === 'all' || skill.status === skillFilter)
  const skillCounts = Object.fromEntries(Object.keys(skillLabels).map(status => [status, skillInventory.filter(skill => skill.status === status).length])) as Record<keyof typeof skillLabels, number>

  return <SectionContext.Provider value={section}><div className="owner owner-shell" onClick={navigate}>
    <a className="owner-skip" href="#owner-main">Перейти к содержимому</a>
    <aside className="owner-sidebar">
      <a className="owner-brand" href="/" aria-label="На публичный сайт SIMBA"><img src={simbaMark} alt="" /><span>SIMBA<small>SYSTEMS</small></span></a>
      <p className="owner-sidebar-label">ПРОСТРАНСТВО ВЛАДЕЛЬЦА</p>
      <nav aria-label="Разделы кабинета">{ownerModules.filter(m => m.available).map(m => <a key={m.id} href={`#${m.id}`} className={section === m.id ? 'is-active' : ''} aria-current={section === m.id ? 'page' : undefined} ><span aria-hidden="true">{m.icon}</span>{m.name}{m.id === 'decisions' && pulse.decisions > 0 && <b>{pulse.decisions}</b>}</a>)}</nav>
      <details className="owner-future"><summary>Дальше в системе <span>06</span></summary>{ownerModules.filter(m => !m.available).map(m => <div key={m.id}>{m.name}<small>Позже</small></div>)}</details>
      <div className="owner-sidebar-bottom"><span className="owner-profile">В</span><div><strong>Владимир</strong><small>Владелец SIMBA</small></div><a href="/" aria-label="Открыть публичный сайт">↗</a></div>
    </aside>
    <main id="owner-main" className="owner-main">
      <header className="owner-topbar"><span>SIMBA <span className="owner-muted">/ Кабинет владельца</span></span><div><span className="owner-local-dot" />Локальный MVP<button onClick={changeMode}>{mode === 'demo' ? 'Мои данные' : 'Показать демо'}</button></div></header>
      <div className={`owner-mode-note ${mode === 'demo' ? 'is-demo' : ''}`}><strong>{mode === 'demo' ? 'Демо · вымышленные примеры' : 'Мои данные · только в этом браузере'}</strong><span>{mode === 'demo' ? 'Можно пробовать действия. Ваши записи хранятся отдельно.' : 'Без синхронизации и входа. Скачивайте резервную копию важных записей.'}</span></div>
      {(snapshot.error || notice) && <div role="status" className="owner-notice">{snapshot.error || notice}<button onClick={() => setNotice('')} aria-label="Скрыть сообщение" disabled={!!snapshot.error}>✕</button></div>}
      {section === 'today' && <><section id="today" className="owner-today" aria-labelledby="today-title">
        <div className="owner-greeting"><p className="owner-eyebrow">СЕГОДНЯ · {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' })}</p><h1 id="today-title" tabIndex={-1}>Владимир,<br />держим курс<span>.</span></h1><p className="owner-intro">Главное о бизнесе. Решения, которые двигают вперёд.</p><div className="owner-actions"><a href="#decisions" className="owner-primary" >К решениям <span>↗</span></a><button onClick={() => setEditor({ kind: 'project' })}>+ Новый проект</button></div></div>
        <div className="owner-focus"><p className="owner-eyebrow">01 / ФОКУС ДНЯ</p><h2>Что продвинем сегодня?</h2><form onSubmit={e => { e.preventDefault(); persist({ ...data, focus: focusDraft.trim() }, 'Фокус дня сохранён.') }}><label className="sr-only" htmlFor="owner-focus">Фокус дня</label><textarea id="owner-focus" maxLength={2000} rows={3} placeholder="Один результат, который сделает день полезным…" value={focusDraft} onChange={e => setFocusDraft(e.target.value)} /><button type="submit">Сохранить фокус <span>↗</span></button></form></div>
      </section>
      <div className="owner-stat-strip"><div><span>Требует решения</span><strong>{pulse.decisions.toString().padStart(2, '0')}</strong><small>действий владельца</small></div><div><span>Открытые проекты</span><strong>{pulse.active.toString().padStart(2, '0')}</strong><small>{pulse.overdue ? `${pulse.overdue} со сроком в прошлом` : 'нет просроченных сроков'}</small></div><div><span>Получено по проектам</span><strong>{data.projects.length ? money(pulse.received) : '—'}</strong><small>вручную · за всё время</small></div><div><span>Проверяем возможности</span><strong>{pulse.tests.toString().padStart(2, '0')}</strong><small>гипотез и наблюдений</small></div></div>
      <section className="owner-admin-summary" aria-labelledby="admin-summary-title">
        <div className="owner-admin-head"><div><p className="owner-eyebrow">SIMBA AI · АДМИНИСТРАТОР</p><h2 id="admin-summary-title">Система под наблюдением</h2></div><span className="owner-admin-state"><i />Локально активен</span></div>
        <div className="owner-admin-layout">
          <div className="owner-admin-analytics" aria-label="Аналитика администратора">
            <div><strong>{actionsToday.toString().padStart(2, '0')}</strong><span>действий сегодня</span></div>
            <div><strong>{adminSignals.toString().padStart(2, '0')}</strong><span>сигналов внимания</span></div>
            <div><strong>{activity.filter(item => item.kind === 'ai').length.toString().padStart(2, '0')}</strong><span>сводок собрано</span></div>
          </div>
          <div className="owner-admin-journal"><div className="owner-admin-journal-head"><strong>Журнал действий</strong><a href="#ai">Открыть SIMBA AI ↗</a></div>{latestActivity.length ? latestActivity.map(item => <p key={item.id}><span className={`owner-activity-kind is-${item.kind}`} aria-hidden="true">{item.kind === 'ai' ? '✧' : item.kind === 'decision' ? '◇' : '·'}</span><span>{item.title}</span><time>{new Date(item.at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</time></p>) : <p className="owner-muted">Пока нет действий. Сохраните фокус, проект или решение — запись появится здесь.</p>}</div>
        </div>
      </section>
      </>}
      <Section id="decisions" eyebrow="02 / ВАШЕ УЧАСТИЕ" title="Требует решения" action={<button onClick={() => setEditor({ kind: 'decision' })}>+ Добавить</button>}>
        <div className="owner-tabs" aria-label="Фильтр решений">{[['pending', 'Сейчас'], ['deferred', 'Отложенные'], ['all', 'Все решения']].map(([id, label]) => <button key={id} aria-pressed={decisionFilter === id} onClick={() => setDecisionFilter(id)}>{label}</button>)}</div>
        <div className="owner-decisions">{decisions.length ? decisions.map(d => <article key={d.id} className="owner-decision"><div className={`owner-priority ${d.priority === 'high' ? 'is-high' : ''}`} aria-hidden="true">◇</div><div className="owner-decision-body"><div className="owner-meta"><span className={d.priority === 'high' ? 'owner-urgent' : ''}>{d.priority === 'high' ? 'Высокий приоритет' : 'Решение владельца'}</span><span>{shortDate(d.due)}</span><span>{decisionLabels[d.status]}</span></div><h3>{d.title}</h3><p>{d.context || 'Контекст пока не добавлен.'}</p><div className="owner-actions">{needsDecision(d) || d.status === 'deferred' ? <><button className="owner-primary" onClick={() => decide(d, 'approved')}>Одобрить</button><button onClick={() => decide(d, 'rejected')}>Отклонить</button><button onClick={() => decide(d, 'deferred')}>На завтра</button></> : <button onClick={() => decide(d, 'pending')}>Вернуть в очередь</button>}<button className="owner-text-button" onClick={() => setEditor({ kind: 'decision', value: d })}>Изменить</button></div></div></article>) : <Empty>{decisionFilter === 'pending' ? 'Здесь спокойно. Добавьте вопрос, по которому нужно ваше решение.' : 'В этой категории пока нет решений.'}</Empty>}</div>
        {data.journal.length > 0 && <details className="owner-history"><summary>История решений · {data.journal.length}</summary>{data.journal.slice(0, 10).map(j => <p key={j.id}><time>{new Date(j.at).toLocaleString('ru-RU')}</time><span>{j.title}</span><strong>{decisionLabels[j.to]}</strong></p>)}<small>Показаны последние 10 событий; резервная копия содержит до 1 000.</small></details>}
      </Section>
      <Section id="pulse" eyebrow="03 / СОСТОЯНИЕ БИЗНЕСА" title="Business Pulse" action={<span className="owner-muted">По вашим записям · за всё время</span>}>
        <div className="owner-pulse-grid"><div className="owner-finance"><div><span>Получено</span><strong>{data.projects.length ? money(pulse.received) : 'Нет данных'}</strong></div><div><span>Остаток до бюджета</span><strong>{data.projects.length ? money(pulse.remaining) : '—'}</strong></div><p>Остаток = сумма положительных разниц между бюджетом и полученным по каждому проекту. Не прогноз выручки.</p></div><div className="owner-health"><h3>Что держать в поле зрения</h3><p><span className={pulse.blocked ? 'owner-urgent' : ''}>●</span><strong>{pulse.blocked}</strong> проектов заблокировано</p><p><span className={pulse.overdue ? 'owner-urgent' : ''}>●</span><strong>{pulse.overdue}</strong> проектов просрочено</p><p><span>●</span><strong>{data.projects.filter(p => p.status === 'done').length}</strong> проектов завершено</p><small>Продажи, лиды и банковские операции ещё не подключены.</small></div></div>
      </Section>
      <Section id="projects" eyebrow="04 / ОТ ЗАМЫСЛА К РЕЗУЛЬТАТУ" title="Проекты" action={<button onClick={() => setEditor({ kind: 'project' })}>+ Новый проект</button>}>
        <div className="owner-project-tools"><label><span className="sr-only">Поиск проектов</span><input placeholder="Найти проект или следующий шаг" value={search} onChange={e => setSearch(e.target.value)} /></label><label><span className="sr-only">Статус проектов</span><select value={projectFilter} onChange={e => setProjectFilter(e.target.value)}><option value="all">Все статусы</option>{Object.entries(projectLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label></div>
        <div className="owner-projects">{projects.length ? projects.map((p, i) => <article key={p.id} className="owner-project"><div className="owner-project-top"><span className="owner-project-index">{String(i + 1).padStart(2, '0')}</span><span className={`owner-status status-${p.status}`}>{projectLabels[p.status]}</span><button className="owner-text-button" aria-label={`Редактировать проект ${p.name}`} onClick={() => setEditor({ kind: 'project', value: p })}>↗</button></div><h3>{p.name}</h3><p className="owner-project-next">{p.next || 'Добавьте следующий шаг'}</p><div className="owner-progress-label"><span>Готовность</span><strong>{p.progress}%</strong></div><progress value={p.progress} max="100" aria-label={`Готовность ${p.name}`} /><div className="owner-project-bottom"><span className={p.status !== 'done' && isOverdue(p.due) ? 'owner-urgent' : ''}>{p.status !== 'done' && isOverdue(p.due) ? 'Просрочен · ' : ''}{shortDate(p.due)}</span><strong>{money(p.budget)}</strong></div></article>) : <Empty>{data.projects.length ? 'По этому запросу ничего не найдено. Измените фильтр или поиск.' : 'Создайте первый проект: цель, следующий шаг, срок и бюджет.'}</Empty>}</div>
      </Section>
      <Section id="skills" eyebrow="05 / НАКОПЛЕННЫЕ ВОЗМОЖНОСТИ" title="Skill Box" action={<button onClick={() => setSkillEditor('new')}>+ Добавить навык</button>}>
        <div className="owner-skill-intro"><div><h2>Библиотека того, что умеет SIMBA</h2><p>Каждый навык хранит назначение и проекты, где он появился. Навыки из поля проекта попадают сюда автоматически.</p></div><div className="owner-skill-counts">{Object.entries(skillLabels).map(([status, label]) => <button key={status} aria-pressed={skillFilter === status} onClick={() => setSkillFilter(skillFilter === status ? 'all' : status)}><strong>{skillCounts[status as keyof typeof skillLabels]}</strong><span>{label}</span></button>)}</div></div>
        <div className="owner-tabs" aria-label="Фильтр навыков"><button aria-pressed={skillFilter === 'all'} onClick={() => setSkillFilter('all')}>Все</button>{Object.entries(skillLabels).map(([status, label]) => <button key={status} aria-pressed={skillFilter === status} onClick={() => setSkillFilter(status)}>{label}</button>)}</div>
        <div className="owner-skills">{filteredSkills.length ? filteredSkills.map(skill => <article key={skill.id} className="owner-skill-card"><div className="owner-meta"><span className={`owner-status skill-${skill.status}`}>{skillLabels[skill.status]}</span><span>Обновлён {new Date(skill.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span></div><h3>{skill.name}</h3><p>{skill.purpose || 'Назначение пока не описано.'}</p><div className="owner-skill-sources"><small>ПРОЕКТЫ-ИСТОЧНИКИ</small>{skill.sourceProjects.length ? <div>{skill.sourceProjects.map(source => <span key={source}>{source}</span>)}</div> : <p>Добавлен вручную · проект пока не связан</p>}</div><button className="owner-text-button" onClick={() => setSkillEditor(skill)}>Изменить ↗</button></article>) : <Empty>{skillInventory.length ? 'В этом состоянии навыков пока нет.' : 'Skill Box пуст. Добавьте навык вручную или укажите навыки в карточке проекта.'}</Empty>}</div>
      </Section>
      <Section id="opportunities" eyebrow="06 / СЛЕДУЮЩАЯ ТОЧКА РОСТА" title="Tactical Opportunities" action={<button onClick={() => setEditor({ kind: 'opportunity' })}>+ Возможность</button>}>
        <p className="owner-section-description">Сигнал → небольшой тест → решение. Факты и гипотезы отмечаем отдельно.</p>
        <div className="owner-opportunities">{data.opportunities.filter(o => o.status !== 'archived').map(o => <article key={o.id} className="owner-opportunity"><div className="owner-meta"><span className="owner-tag">{o.kind === 'fact' ? 'Наблюдаемый факт' : 'Гипотеза'}</span><span>{o.status === 'testing' ? 'На проверке' : 'Новый сигнал'}</span><span>{shortDate(o.observed)}</span></div><h3>{o.title}</h3><p className="owner-source">Источник: {o.source || 'Не указан'}</p><div className="owner-test"><small>СЛЕДУЮЩИЙ ТЕСТ</small><p>{o.test || 'Тест пока не определён.'}</p></div><div className="owner-actions">{o.projectId ? <a href="#projects">К проектам ↗</a> : <button onClick={() => startTest(o)}>Создать проект проверки ↗</button>}<button className="owner-text-button" onClick={() => setEditor({ kind: 'opportunity', value: o })}>Изменить</button><button className="owner-text-button" onClick={() => persist({ ...data, opportunities: data.opportunities.map(item => item.id === o.id ? { ...item, status: 'archived' } : item) }, 'Возможность перенесена в архив.')}>В архив</button></div></article>)}</div>
        {!data.opportunities.some(o => o.status !== 'archived') && <Empty>Запишите наблюдение или гипотезу и один способ её проверить.</Empty>}
        {data.opportunities.some(o => o.status === 'archived') && <details className="owner-history"><summary>Архив возможностей</summary>{data.opportunities.filter(o => o.status === 'archived').map(o => <p key={o.id}><span>{o.title}</span><button onClick={() => persist({ ...data, opportunities: data.opportunities.map(item => item.id === o.id ? { ...item, status: item.projectId ? 'testing' : 'new' } : item) })}>Восстановить</button></p>)}</details>}
      </Section>
      <Section id="ai" eyebrow="07 / ПОМОЩНИК ВЛАДЕЛЬЦА" title="SIMBA AI" action={<span className="owner-tag">Локальная сводка</span>}>
        <div className="owner-ai"><div className="owner-ai-visual"><PaperMorphAvatar size={230} state={brief ? 'answering' : 'idle'} /><span>Рядом, чтобы видеть главное.</span></div><div className="owner-ai-content"><h3>С чего начать?</h3><p>Соберу приоритеты из записей кабинета. Сейчас это сводка по правилам: модель AI, поиск в интернете и выполнение задач ещё не подключены.</p><button className="owner-primary" onClick={() => { setBrief(true); persist({ ...data }, 'SIMBA AI сформировала локальную сводку.', false, 'ai') }}>Собрать план дня <span>✧</span></button>{brief && <div className="owner-brief" role="status"><strong>По текущим данным{mode === 'demo' ? ' · демо' : ''}</strong><ol><li>{pulse.decisions ? `Разобрать решений: ${pulse.decisions}. Сначала вопросы с высоким приоритетом.` : 'Очередь решений свободна. Добавьте вопрос, если он требует вашего участия.'}</li><li>{priorityProjects.length ? `${priorityProjects[0].name}: ${priorityProjects[0].next || 'определить следующий шаг'}.` : 'Создать первый проект и указать следующий шаг.'}</li><li>{data.opportunities.some(o => o.status === 'new') ? `Проверить гипотезу «${data.opportunities.find(o => o.status === 'new')!.title}» небольшим тестом.` : 'Зафиксировать один новый сигнал роста с источником и тестом.'}</li></ol><small>Действия выполняете вы. Автоматические поручения не отправлялись.</small></div>}</div></div>
        <div className="owner-ai-journal"><div className="owner-section-head"><div><p className="owner-eyebrow">АНАЛИТИКА И КОНТРОЛЬ</p><h2>Журнал администратора</h2></div><span className="owner-muted">Последние {Math.min(activity.length, 20)} из {activity.length}</span></div><div className="owner-ai-metrics"><div><strong>{actionsToday}</strong><span>действий сегодня</span></div><div><strong>{adminSignals}</strong><span>сигналов внимания</span></div><div><strong>{activity.filter(item => item.kind === 'ai').length}</strong><span>локальных сводок</span></div></div>{activity.length ? <div className="owner-activity-list">{activity.slice(0, 20).map(item => <p key={item.id}><span className={`owner-activity-kind is-${item.kind}`} aria-hidden="true">{item.kind === 'ai' ? '✧' : item.kind === 'decision' ? '◇' : '·'}</span><span>{item.title}</span><time>{new Date(item.at).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</time></p>)}</div> : <Empty>Действия появятся после сохранения фокуса, проектов, решений и сводок.</Empty>}</div>
      </Section>
      <footer className="owner-footer"><div><strong>SIMBA / Ваш бизнес в фокусе</strong><p>Локальный MVP · данные не отправляются на сервер</p></div><div className="owner-actions"><button onClick={exportData}>Скачать копию</button><button onClick={() => importRef.current?.click()}>Восстановить</button><input ref={importRef} hidden type="file" accept="application/json,.json" aria-label="Резервная копия кабинета" onChange={importData} /></div></footer>
    </main>
    <nav className="owner-bottom-nav" aria-label="Нижняя навигация">
      {activeModules.filter(m => ['today', 'decisions', 'projects', 'skills'].includes(m.id)).map(m => <a key={m.id} href={`#${m.id}`} aria-current={section === m.id ? 'page' : undefined}>
        <span className="owner-bottom-icon" aria-hidden="true">{m.icon}{m.id === 'decisions' && pulse.decisions > 0 && <b>{pulse.decisions > 99 ? '99+' : pulse.decisions}</b>}</span>
        <span>{m.shortName}</span>
      </a>)}
      <button type="button" aria-expanded={moreOpen} aria-controls="owner-more-menu" aria-current={['pulse', 'opportunities', 'ai'].includes(section) ? 'page' : undefined} onClick={() => setMoreOpen(value => !value)}><span className="owner-bottom-icon" aria-hidden="true">•••</span><span>Ещё</span></button>
    </nav>
    {moreOpen && <div className="owner-more-backdrop" onClick={() => setMoreOpen(false)}><div id="owner-more-menu" className="owner-more-menu" role="dialog" aria-label="Другие разделы" onClick={event => event.stopPropagation()}><div><strong>Другие разделы</strong><button onClick={() => setMoreOpen(false)} aria-label="Закрыть меню">✕</button></div>{activeModules.filter(m => ['pulse', 'opportunities', 'ai'].includes(m.id)).map(m => <a key={m.id} href={`#${m.id}`} aria-current={section === m.id ? 'page' : undefined} onClick={event => { setMoreOpen(false); navigate(event) }}><span aria-hidden="true">{m.icon}</span><span><strong>{m.shortName}</strong><small>{m.id === 'pulse' ? 'Состояние бизнеса' : m.id === 'opportunities' ? 'Точки и гипотезы роста' : 'Администратор и журнал'}</small></span><b>↗</b></a>)}</div></div>}
    {editor && <RecordEditor editor={editor} onClose={() => setEditor(null)} onSave={saveRecord} />}
    {skillEditor && <SkillEditor value={skillEditor === 'new' ? undefined : skillEditor} projects={data.projects} onClose={() => setSkillEditor(null)} onSave={saveSkill} />}
    {restoreData && <dialog ref={restoreRef} className="owner-dialog" aria-labelledby="restore-title" onCancel={() => setRestoreData(null)}>
      <div className="owner owner-form">
        <h2 id="restore-title">Восстановить копию?</h2>
        <p>Будут заменены {mode === 'demo' ? 'демо-данные' : 'ваши личные записи'} в этом браузере. Сначала скачайте текущую копию, если хотите сохранить её.</p>
        <p>В файле: проектов — {restoreData.projects.length}, решений — {restoreData.decisions.length}, возможностей — {restoreData.opportunities.length}.</p>
        <div className="owner-actions"><button autoFocus onClick={() => setRestoreData(null)}>Отмена</button><button className="owner-primary" onClick={() => {
          if (persist(restoreData, 'Резервная копия восстановлена.', true)) {
            setFocusDraft(restoreData.focus); setRestoreData(null)
          }
        }}>Заменить данные</button></div>
        {notice && <p role="status">{notice}</p>}
      </div>
    </dialog>}
  </div></SectionContext.Provider>
}

