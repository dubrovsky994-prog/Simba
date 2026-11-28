export type ProjectStatus = 'planned' | 'active' | 'blocked' | 'done'
export type DecisionStatus = 'pending' | 'approved' | 'rejected' | 'deferred'
export type Project = {
  id: string; name: string; next: string; status: ProjectStatus
  due: string; progress: number; budget: number; received: number; skills: string[]
}
export type Decision = {
  id: string; title: string; context: string; due: string
  status: DecisionStatus; priority: 'normal' | 'high'
}
export type Opportunity = {
  id: string; title: string; kind: 'fact' | 'hypothesis'; source: string
  observed: string; test: string; status: 'new' | 'testing' | 'archived'; projectId?: string
}
export type JournalEntry = {
  id: string; at: string; title: string; from: DecisionStatus; to: DecisionStatus
}
export type ActionLog = {
  id: string; at: string; title: string; kind: 'data' | 'decision' | 'ai' | 'system'
}
export type SkillStatus = 'ready' | 'building' | 'planned'
export type SkillItem = {
  id: string; name: string; purpose: string; status: SkillStatus
  sourceProjects: string[]; createdAt: string; updatedAt: string
}
export type OwnerData = {
  version: 1; focus: string; projects: Project[]; decisions: Decision[]
  opportunities: Opportunity[]; journal: JournalEntry[]; activity: ActionLog[]; skills: SkillItem[]
}
export const projectLabels: Record<ProjectStatus, string> = {
  planned: 'В планах', active: 'В работе', blocked: 'Заблокирован', done: 'Завершён',
}
export const decisionLabels: Record<DecisionStatus, string> = {
  pending: 'Ожидает решения', approved: 'Одобрено', rejected: 'Отклонено', deferred: 'Отложено',
}
export const skillLabels: Record<SkillStatus, string> = {
  ready: 'Готово', building: 'Создаётся', planned: 'Запланировано',
}
export const money = (n: number) => new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', maximumFractionDigits: 0,
}).format(n)
export function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export function daysFromToday(days: number) {
  const d = new Date(`${today()}T12:00:00`)
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export const shortDate = (date: string) => date
  ? new Date(`${date}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : 'Без срока'
export const isOverdue = (date: string) => !!date && date < today()
export const needsDecision = (d: Decision) => d.status === 'pending' || (d.status === 'deferred' && (!d.due || d.due <= today()))
export const emptyData = (): OwnerData => ({ version: 1, focus: '', projects: [], decisions: [], opportunities: [], journal: [], activity: [], skills: [] })
export const skillStatusFromProject = (status: ProjectStatus): SkillStatus => status === 'done' ? 'ready' : status === 'planned' ? 'planned' : 'building'
export function syncProjectSkills(data: OwnerData, project: Project): SkillItem[] {
  const now = new Date().toISOString()
  const result = (data.skills || []).map(item => ({ ...item, sourceProjects: [...item.sourceProjects] }))
  for (const rawName of project.skills) {
    const name = rawName.trim().replace(/\s+/g, ' ')
    if (!name) continue
    const found = result.find(item => item.name.localeCompare(name, 'ru', { sensitivity: 'base' }) === 0)
    if (found) {
      const sourceProjects = Array.from(new Set([...found.sourceProjects, project.name]))
      const nextStatus = skillStatusFromProject(project.status)
      Object.assign(found, { sourceProjects, status: found.status === 'ready' ? 'ready' : nextStatus, updatedAt: now })
    } else result.push({ id: crypto.randomUUID(), name, purpose: project.next, status: skillStatusFromProject(project.status), sourceProjects: [project.name], createdAt: now, updatedAt: now })
  }
  return result.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
}
export function getPulse(data: OwnerData) {
  return {
    active: data.projects.filter(p => p.status !== 'done').length,
    blocked: data.projects.filter(p => p.status === 'blocked').length,
    overdue: data.projects.filter(p => p.status !== 'done' && isOverdue(p.due)).length,
    received: data.projects.reduce((sum, p) => sum + p.received, 0),
    remaining: data.projects.reduce((sum, p) => sum + Math.max(0, p.budget - p.received), 0),
    decisions: data.decisions.filter(needsDecision).length,
    tests: data.opportunities.filter(o => o.status === 'testing').length,
  }
}
export function demoData(): OwnerData {
  return {
    version: 1, focus: 'Согласовать следующий шаг по сайту и проверить одну гипотезу роста.',
    projects: [
      { id: 'demo-site', name: 'Сайт локального бренда', next: 'Согласовать первый экран', status: 'active', due: daysFromToday(2), progress: 65, budget: 80000, received: 40000, skills: ['Конверсионный первый экран'] },
      { id: 'demo-beauty', name: 'Beauty · пилот записи', next: 'Получить обратную связь от мастера', status: 'blocked', due: daysFromToday(-1), progress: 35, budget: 45000, received: 15000, skills: ['Онлайн-запись мастера'] },
      { id: 'demo-bot', name: 'Бот для заявок', next: 'Подготовить сценарий', status: 'planned', due: daysFromToday(7), progress: 10, budget: 25000, received: 0, skills: ['Квалификация заявки ботом'] },
    ],
    decisions: [
      { id: 'demo-design', title: 'Выбрать направление первого экрана', context: 'Учебный пример: согласовать вариант перед следующим этапом.', due: today(), status: 'pending', priority: 'high' },
      { id: 'demo-interview', title: 'Запустить интервью с beauty-мастерами', context: 'Учебный пример: провести 3 интервью о потерянных записях.', due: daysFromToday(1), status: 'pending', priority: 'normal' },
    ],
    opportunities: [
      { id: 'demo-beauty-test', title: 'Свободные окна beauty-мастеров', kind: 'hypothesis', source: 'Демо-сценарий, внешней проверки нет', observed: today(), test: 'Провести 3 интервью и проверить интерес к заполнению свободных окон.', status: 'new' },
      { id: 'demo-leads', title: 'Быстрый ответ на входящие заявки', kind: 'hypothesis', source: 'Демо-сценарий, внешней проверки нет', observed: today(), test: 'На одном тестовом сценарии сравнить ручной ответ и бота.', status: 'testing' },
    ], journal: [], activity: [], skills: [
      { id: 'demo-skill-hero', name: 'Конверсионный первый экран', purpose: 'Быстро объяснять ценность продукта и вести к целевому действию.', status: 'building', sourceProjects: ['Сайт локального бренда'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'demo-skill-booking', name: 'Онлайн-запись мастера', purpose: 'Показывать свободные окна и принимать запись без переписки.', status: 'building', sourceProjects: ['Beauty · пилот записи'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'demo-skill-bot', name: 'Квалификация заявки ботом', purpose: 'Собирать вводные до разговора с владельцем.', status: 'planned', sourceProjects: ['Бот для заявок'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
  }
}
