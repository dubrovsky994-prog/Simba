export type IdeaOption = { id: string; label: string; kind: 'fixed' | 'input'; placeholder?: string }

export const CUSTOM_OPTION_ID = 'custom'

export const PROJECT_TYPE_OPTIONS: IdeaOption[] = [
  { id: 'website', label: 'Сайт / сервис', kind: 'fixed' },
  { id: 'app', label: 'Мобильное приложение', kind: 'fixed' },
  { id: 'ai', label: 'AI-продукт', kind: 'fixed' },
  { id: 'automation', label: 'Автоматизацию', kind: 'fixed' },
  { id: 'unsure', label: 'Пока не знаю', kind: 'fixed' },
  { id: CUSTOM_OPTION_ID, label: 'Другое', kind: 'input', placeholder: 'Опишите идею своими словами' },
]

export const TARGET_AUDIENCE_OPTIONS: IdeaOption[] = [
  { id: 'my_clients', label: 'Для клиентов моего бизнеса', kind: 'fixed' },
  { id: 'industry_specialists', label: 'Для специалистов моей отрасли', kind: 'fixed' },
  { id: 'companies', label: 'Для компаний (B2B)', kind: 'fixed' },
  { id: 'mass_market', label: 'Массовый сервис', kind: 'fixed' },
  { id: 'hypothesis', label: 'Пока проверяю гипотезу', kind: 'fixed' },
  { id: CUSTOM_OPTION_ID, label: 'Другое', kind: 'input', placeholder: 'Кто будет этим пользоваться?' },
]

export const PROJECT_STAGE_OPTIONS: IdeaOption[] = [
  { id: 'idea_only', label: 'Только идея', kind: 'fixed' },
  { id: 'has_description', label: 'Уже есть описание', kind: 'fixed' },
  { id: 'has_prototype', label: 'Есть прототип', kind: 'fixed' },
  { id: 'has_business', label: 'Есть действующий бизнес', kind: 'fixed' },
  { id: 'has_product', label: 'Есть существующий продукт, хочу развить', kind: 'fixed' },
]

export function resolveOptionLabel(options: IdeaOption[], answer: { optionId: string | null; customText: string }): string {
  if (!answer.optionId) return ''
  if (answer.optionId === CUSTOM_OPTION_ID) return answer.customText.trim()
  return options.find((o) => o.id === answer.optionId)?.label ?? ''
}
