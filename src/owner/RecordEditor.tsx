import { useEffect, useRef, useState, type FormEvent } from 'react'
import { projectLabels, today, type Decision, type Opportunity, type Project } from './model'

export type Editor = { kind: 'project'; value?: Project } | { kind: 'decision'; value?: Decision } | { kind: 'opportunity'; value?: Opportunity }
export type SavedRecord = { kind: 'project'; value: Project } | { kind: 'decision'; value: Decision } | { kind: 'opportunity'; value: Opportunity }

export default function RecordEditor({ editor, onClose, onSave }: {
  editor: Editor; onClose: () => void; onSave: (record: SavedRecord) => boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const field = (name: string) => String(form.get(name) || '').trim()
    const id = editor.value?.id || crypto.randomUUID()
    if (!field('title')) { setError('Укажите название.'); return }
    let record: SavedRecord
    if (editor.kind === 'project') {
      record = { kind: 'project', value: {
        id, name: field('title'), next: field('next'), due: field('due'),
        status: field('status') as Project['status'], progress: field('status') === 'done' ? 100 : Number(field('progress')),
        budget: Number(field('budget')), received: Number(field('received')),
        skills: field('skills').split(/[\n,;]/).map(item => item.trim()).filter(Boolean).slice(0, 50),
      } }
    } else if (editor.kind === 'decision') {
      record = { kind: 'decision', value: {
        id, title: field('title'), context: field('context'), due: field('due'),
        priority: field('priority') as Decision['priority'], status: editor.value?.status || 'pending',
      } }
    } else {
      if (field('kind') === 'fact' && (!field('source') || !field('observed'))) {
        setError('Для факта нужны источник и дата наблюдения.'); return
      }
      record = { kind: 'opportunity', value: {
        id, title: field('title'), kind: field('kind') as Opportunity['kind'], source: field('source'),
        observed: field('observed'), test: field('test'), status: editor.value?.status || 'new', projectId: editor.value?.projectId,
      } }
    }
    if (onSave(record)) onClose()
    else setError('Запись не сохранена. Проверьте сообщение хранилища на странице после закрытия окна.')
  }
  return <dialog ref={ref} className="owner-dialog" onCancel={onClose} aria-labelledby="owner-editor-title">
    <div className="owner">
      <div className="owner-section-head"><h2 id="owner-editor-title">{editor.value ? 'Редактировать' : 'Добавить'} {editor.kind === 'project' ? 'проект' : editor.kind === 'decision' ? 'решение' : 'возможность'}</h2><button type="button" onClick={onClose} aria-label="Закрыть окно">✕</button></div>
      <form onSubmit={submit} className="owner-form">
        <label>Название<input name="title" maxLength={160} required autoFocus defaultValue={editor.kind === 'project' ? editor.value?.name : editor.value?.title} /></label>
        {editor.kind === 'project' && <>
          <label>Следующий шаг<textarea name="next" maxLength={2000} rows={2} defaultValue={editor.value?.next} /></label>
          <div className="owner-form-pair"><label>Статус<select name="status" defaultValue={editor.value?.status || 'planned'}>{Object.entries(projectLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label><label>Срок<input name="due" type="date" defaultValue={editor.value?.due} /></label></div>
          <label>Готовность, %<input name="progress" type="number" min="0" max="100" step="1" required defaultValue={editor.value?.progress || 0} /></label>
          <label htmlFor="project-skills">Навыки и решения проекта</label><textarea id="project-skills" name="skills" aria-describedby="project-skills-help" maxLength={2000} rows={3} placeholder="Например: онлайн-запись, квалификация заявки ботом" defaultValue={editor.value?.skills.join('\n')} /><span id="project-skills-help" className="owner-muted">Каждый навык — с новой строки или через запятую. После сохранения он автоматически попадёт в Skill Box.</span>
          <div className="owner-form-pair"><label>Бюджет, ₽<input name="budget" type="number" min="0" max="1000000000000" step="0.01" required defaultValue={editor.value?.budget || 0} /></label><label>Получено, ₽<input name="received" type="number" min="0" max="1000000000000" step="0.01" required defaultValue={editor.value?.received || 0} /></label></div>
          <p className="owner-muted">Суммы вводятся вручную. Это учёт по проектам за всё время.</p>
        </>}
        {editor.kind === 'decision' && <>
          <label>Контекст решения<textarea name="context" maxLength={2000} rows={3} defaultValue={editor.value?.context} /></label>
          <div className="owner-form-pair"><label>Приоритет<select name="priority" defaultValue={editor.value?.priority || 'normal'}><option value="normal">Обычный</option><option value="high">Высокий</option></select></label><label>Срок<input name="due" type="date" defaultValue={editor.value?.due || today()} /></label></div>
        </>}
        {editor.kind === 'opportunity' && <>
          <div className="owner-form-pair"><label>Тип сигнала<select name="kind" defaultValue={editor.value?.kind || 'hypothesis'}><option value="hypothesis">Гипотеза</option><option value="fact">Наблюдаемый факт</option></select></label><label>Дата наблюдения<input name="observed" type="date" defaultValue={editor.value?.observed || today()} /></label></div>
          <label>Источник<input name="source" maxLength={1000} placeholder="Ссылка или описание наблюдения" defaultValue={editor.value?.source} /></label>
          <label>Маленький проверочный тест<textarea name="test" maxLength={2000} rows={3} required defaultValue={editor.value?.test} /></label>
        </>}
        {error && <p role="alert" className="owner-warning">{error}</p>}
        <div className="owner-actions"><button className="owner-primary" type="submit">Сохранить</button><button type="button" onClick={onClose}>Отмена</button></div>
      </form>
    </div>
  </dialog>
}
