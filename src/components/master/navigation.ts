import type { MasterIconName } from './MasterIcon'

export type WorkspaceState = 'home' | 'solutions' | 'cases' | 'beauty' | 'ai' | 'library' | 'pricing' | 'about' | 'contacts' | 'diagnostics'
export const SIDEBAR_ITEMS: { id: WorkspaceState; label: string; icon: MasterIconName }[] = [
  { id: 'home', label: 'Главная', icon: 'home' },
  { id: 'solutions', label: 'Решения', icon: 'solutions' },
  { id: 'cases', label: 'Кейсы', icon: 'cases' },
  { id: 'beauty', label: 'Демо-ядра', icon: 'cube' },
  { id: 'ai', label: 'SIMBA AI', icon: 'ai' },
  { id: 'library', label: 'Библиотека', icon: 'book' },
  { id: 'pricing', label: 'Тарифы', icon: 'chart' },
  { id: 'about', label: 'О компании', icon: 'heart' },
  { id: 'contacts', label: 'Контакты', icon: 'mail' },
]
