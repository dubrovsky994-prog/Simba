/* eslint-env node */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildSync } from 'esbuild'
import { runInNewContext } from 'node:vm'
import { fileURLToPath } from 'node:url'

function load(name, storage = new Map()) {
  const result = buildSync({ entryPoints: [fileURLToPath(new URL(`../src/owner/${name}.ts`, import.meta.url))], bundle: true, write: false, format: 'cjs', platform: 'node' })
  const module = { exports: {} }
  const localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  }
  let uuid = 0
  runInNewContext(result.outputFiles[0].text, { module, localStorage, crypto: { randomUUID: () => `test-${++uuid}` } })
  return module.exports
}
const model = load('model')

test('pulse distinguishes received money, remaining budget, overdue and completed projects', () => {
  const data = model.demoData()
  data.projects.push({ ...data.projects[0], id: 'overpaid-done', status: 'done', due: '2020-01-01', budget: 100, received: 500 })
  const pulse = model.getPulse(data)
  assert.equal(pulse.received, 55500)
  assert.equal(pulse.remaining, 95000)
  assert.equal(pulse.overdue, 1)
  assert.equal(pulse.active, 3)
  assert.equal(pulse.blocked, 1)
})

test('deferred decisions re-enter the queue on their due date', () => {
  const item = { ...model.demoData().decisions[0], status: 'deferred' }
  assert.equal(model.needsDecision({ ...item, due: model.daysFromToday(1) }), false)
  assert.equal(model.needsDecision({ ...item, due: model.today() }), true)
  assert.equal(model.needsDecision({ ...item, status: 'approved' }), false)
})

test('personal and demo stores are isolated and survive reload', () => {
  const storage = new Map()
  const repo = load('repository', storage)
  repo.localRepository.save('demo', model.demoData(), null)
  assert.equal(repo.localRepository.load('personal').data.projects.length, 0)
  assert.equal(load('repository', storage).localRepository.load('demo').data.projects.length, 3)
})

test('stale writes are rejected without overwriting another tab', () => {
  const storage = new Map()
  const { localRepository } = load('repository', storage)
  const saved = localRepository.save('personal', model.demoData(), null)
  assert.throws(() => localRepository.save('personal', model.emptyData(), null), /другой вкладке/)
  assert.equal(localRepository.load('personal').raw, saved.raw)
})

test('corrupt storage is retained for recovery and a valid backup can replace it explicitly', () => {
  const storage = new Map([['simba.owner.v1.personal', '{broken']])
  const { localRepository } = load('repository', storage)
  const current = localRepository.load('personal')
  assert.ok(current.error)
  assert.equal(current.raw, '{broken')
  assert.equal(storage.get('simba.owner.v1.personal'), '{broken')
  assert.equal(localRepository.save('personal', model.demoData(), current.raw).data.projects.length, 3)
})

test('invalid imported amounts, duplicate IDs, dates, versions and unsupported facts are rejected', () => {
  const { parseData } = load('repository')
  const cases = [
    d => { d.projects[0].budget = -10 },
    d => { d.projects[0].progress = 101 },
    d => { d.projects[0].due = '2026-02-30' },
    d => { d.projects.push(d.projects[0]) },
    d => { d.version = 2 },
    d => { d.opportunities[0].kind = 'fact'; d.opportunities[0].source = '' },
  ]
  for (const mutate of cases) {
    const data = model.demoData(); mutate(data)
    assert.throws(() => parseData(JSON.stringify(data)))
  }
  assert.throws(() => parseData(' '.repeat(2_000_001)), /слишком большой/)
  assert.equal(parseData(JSON.stringify(model.demoData())).version, 1)
})

test('unavailable or full storage reports failure rather than claiming data was saved', () => {
  const storage = { get: () => { throw new Error('denied') } }
  assert.ok(load('repository', storage).localRepository.load('personal').error)
  const full = { get: () => null, set: () => { throw new Error('quota') } }
  assert.throws(() => load('repository', full).localRepository.save('personal', model.emptyData(), null), /Не удалось сохранить/)
})

test('project skills merge into Skill Box without case-insensitive duplicates', () => {
  const data = model.emptyData()
  const project = { id: 'p1', name: 'Beauty', next: 'Принимать запись', status: 'active', due: '', progress: 20, budget: 0, received: 0, skills: ['Онлайн-запись', '  онлайн-ЗАПИСЬ  ', 'Бот заявок'] }
  const first = model.syncProjectSkills(data, project)
  assert.equal(first.length, 2)
  assert.equal(first.find(item => item.name === 'Онлайн-запись').status, 'building')
  const ready = model.syncProjectSkills({ ...data, skills: first }, { ...project, status: 'done', name: 'Beauty 2', skills: ['онлайн-запись'] })
  assert.equal(ready.length, 2)
  assert.equal(ready.find(item => item.name === 'Онлайн-запись').status, 'ready')
  assert.deepEqual(Array.from(ready.find(item => item.name === 'Онлайн-запись').sourceProjects), ['Beauty', 'Beauty 2'])
})
