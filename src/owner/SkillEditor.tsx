import { useEffect, useRef, useState, type FormEvent } from 'react'
import { skillLabels, type Project, type SkillItem } from './model'

export default function SkillEditor({ value, projects, onClose, onSave }: {
  value?: SkillItem
  projects: Project[]
  onClose: () => void
  onSave: (skill: SkillItem) => boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '').trim()
    const purpose = String(form.get('purpose') || '').trim()
    const source = String(form.get('source') || '').trim()
    if (!name || !purpose) { setError('Укажите название и назначение навыка.'); return }
    const now = new Date().toISOString()
    if (onSave({
      id: value?.id || crypto.randomUUID(), name, purpose,
      status: String(form.get('status')) as SkillItem['status'],
      sourceProjects: source ? Array.from(new Set([...(value?.sourceProjects || []), source])) : value?.sourceProjects || [],
      createdAt: value?.createdAt || now, updatedAt: now,
    })) onClose()
  }
  return <dialog ref={ref} className="owner-dialog" onCancel={onClose} aria-labelledby="skill-editor-title">
    <div className="owner">
      <div className="owner-section-head"><h2 id="skill-editor-title">{value ? 'Изменить навык' : 'Добавить навык'}</h2><button type="button" onClick={onClose} aria-label="Закрыть окно">✕</button></div>
      <form className="owner-form" onSubmit={submit}>
        <label>Название<input name="name" required maxLength={160} autoFocus defaultValue={value?.name} /></label>
        <label>Для чего нужен<textarea name="purpose" required maxLength={2000} rows={3} defaultValue={value?.purpose} /></label>
        <label>Состояние<select name="status" defaultValue={value?.status || 'planned'}>{Object.entries(skillLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        <label>Добавить проект-источник<select name="source" defaultValue=""><option value="">Без нового источника</option>{projects.map(project => <option key={project.id} value={project.name}>{project.name}</option>)}</select></label>
        {value?.sourceProjects.length ? <p className="owner-muted">Уже связан: {value.sourceProjects.join(' · ')}</p> : null}
        {error && <p role="alert" className="owner-warning">{error}</p>}
        <div className="owner-actions"><button className="owner-primary" type="submit">Сохранить</button><button type="button" onClick={onClose}>Отмена</button></div>
      </form>
    </div>
  </dialog>
}
