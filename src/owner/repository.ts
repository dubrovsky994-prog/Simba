import { emptyData, type OwnerData } from './model'

export type DataMode = 'personal' | 'demo'
export type Snapshot = { data: OwnerData; raw: string | null; error: string }
export const storageKey = (mode: DataMode) => `simba.owner.v1.${mode}`
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
const str = (v: unknown) => typeof v === 'string' && v.length <= 4000
const text = (v: unknown) => str(v) && (v as string).trim().length > 0
const date = (v: unknown) => v === '' || (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v)) && new Date(`${v}T12:00:00Z`).toISOString().slice(0, 10) === v)
const num = (v: unknown, max: number) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= max
const one = (v: unknown, options: string[]) => typeof v === 'string' && options.includes(v)
const list = (v: unknown, check: (item: Record<string, unknown>) => boolean) => Array.isArray(v) && v.length <= 5000 &&
  new Set(v.map(i => object(i) ? i.id : null)).size === v.length && v.every(i => object(i) && text(i.id) && check(i))

/** Validate at the persistence boundary; malformed backups never replace current data. */
export function parseData(raw: string): OwnerData {
  if (raw.length > 2_000_000) throw new Error('Файл слишком большой (максимум 2 МБ).')
  const d: unknown = JSON.parse(raw)
  if (!object(d) || d.version !== 1 || !str(d.focus) ||
    !list(d.projects, p => text(p.name) && str(p.next) && date(p.due) && num(p.progress, 100) &&
      num(p.budget, 1e12) && num(p.received, 1e12) && one(p.status, ['planned', 'active', 'blocked', 'done']) &&
      (p.skills === undefined || (Array.isArray(p.skills) && p.skills.length <= 50 && p.skills.every(text)))) ||
    !list(d.decisions, p => text(p.title) && str(p.context) && date(p.due) && one(p.status, ['pending', 'approved', 'rejected', 'deferred']) && one(p.priority, ['normal', 'high'])) ||
    !list(d.opportunities, p => text(p.title) && str(p.source) && date(p.observed) && str(p.test) && one(p.kind, ['fact', 'hypothesis']) &&
      one(p.status, ['new', 'testing', 'archived']) && (p.projectId === undefined || text(p.projectId)) &&
      (p.kind !== 'fact' || (text(p.source) && text(p.observed)))) ||
    !list(d.journal, p => text(p.title) && typeof p.at === 'string' && !isNaN(Date.parse(p.at)) &&
      one(p.from, ['pending', 'approved', 'rejected', 'deferred']) && one(p.to, ['pending', 'approved', 'rejected', 'deferred'])) ||
    (d.activity !== undefined && !list(d.activity, p => text(p.title) && typeof p.at === 'string' && !isNaN(Date.parse(p.at)) &&
      one(p.kind, ['data', 'decision', 'ai', 'system']))) ||
    (d.skills !== undefined && !list(d.skills, p => text(p.name) && str(p.purpose) && one(p.status, ['ready', 'building', 'planned']) &&
      Array.isArray(p.sourceProjects) && p.sourceProjects.length <= 100 && p.sourceProjects.every(text) &&
      typeof p.createdAt === 'string' && !isNaN(Date.parse(p.createdAt)) && typeof p.updatedAt === 'string' && !isNaN(Date.parse(p.updatedAt))))) {
    throw new Error('Не удалось прочитать данные кабинета: неверный формат или версия.')
  }
  return {
    ...d,
    projects: (d.projects as Array<Record<string, unknown>>).map(project => ({ ...project, skills: Array.isArray(project.skills) ? project.skills : [] })),
    activity: Array.isArray(d.activity) ? d.activity : [],
    skills: Array.isArray(d.skills) ? d.skills : [],
  } as OwnerData
}
export interface OwnerRepository {
  load(mode: DataMode): Snapshot
  save(mode: DataMode, data: OwnerData, expectedRaw: string | null): Snapshot
}
export const localRepository: OwnerRepository = {
  load(mode) {
    let raw: string | null = null
    try {
      raw = localStorage.getItem(storageKey(mode))
      return { data: raw ? parseData(raw) : emptyData(), raw, error: '' }
    } catch {
      return { data: emptyData(), raw, error: 'Хранилище недоступно или повреждено. Запись остановлена; существующие данные не заменены.' }
    }
  },
  save(mode, data, expectedRaw) {
    const raw = JSON.stringify(data)
    parseData(raw)
    if (localStorage.getItem(storageKey(mode)) !== expectedRaw) {
      throw new Error('Данные изменились в другой вкладке. Обновите страницу перед сохранением.')
    }
    try { localStorage.setItem(storageKey(mode), raw) } catch {
      throw new Error('Не удалось сохранить. Проверьте доступ к хранилищу и свободное место.')
    }
    return { data, raw, error: '' }
  },
}
