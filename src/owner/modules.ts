export const ownerModules = [
  { id: 'today', name: 'Сегодня', shortName: 'Сегодня', icon: '◷', available: true },
  { id: 'decisions', name: 'Требует решения', shortName: 'Решения', icon: '◇', available: true },
  { id: 'pulse', name: 'Business Pulse', shortName: 'Пульс', icon: '↗', available: true },
  { id: 'projects', name: 'Проекты', shortName: 'Проекты', icon: '▤', available: true },
  { id: 'skills', name: 'Skill Box', shortName: 'Скиллы', icon: '⬡', available: true },
  { id: 'opportunities', name: 'Tactical Opportunities', shortName: 'Рост', icon: '◎', available: true },
  { id: 'ai', name: 'SIMBA AI', shortName: 'AI', icon: '✧', available: true },
  ...['Sales', 'Execution Control', 'Finance', 'Leads Radar', 'Product Lab', 'Decision Journal'].map(name => ({
    id: name.toLowerCase().replace(/ /g, '-'), name, shortName: name, icon: '+', available: false,
  })),
]
