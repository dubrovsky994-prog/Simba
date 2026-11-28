export type MasterIconName = 'home' | 'solutions' | 'cases' | 'cube' | 'ai' | 'book' | 'chart' | 'heart' | 'mail' | 'people' | 'leaf' | 'calculator' | 'flower' | 'search' | 'arrow' | 'flag' | 'pin' | 'clock' | 'diamond'

const paths: Record<MasterIconName, string> = {
  home: 'M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10',
  solutions: 'm9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h5l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  cases: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM7 7h2m5 0h3M7 12h2m5 0h3M7 17h2m5 0h3',
  cube: 'm12 2 9 5v10l-9 5-9-5V7ZM3 7l9 5 9-5m-9 5v10M7 4l10 6',
  ai: 'm12 2 2 6 6 4-6 4-2 6-2-6-6-4 6-4ZM20 2v5m-2-2h5M3 17v5m-2-2h5',
  book: 'M12 5C8 2 4 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v16',
  chart: 'M3 21V11h4v10m3 0V6h4v15m3 0V2h4v19',
  heart: 'M12 21 3 12C-2 5 7-1 12 6c5-7 14-1 9 6Z',
  mail: 'M3 5h18v14H3Zm0 0 9 8 9-8',
  people: 'M15 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 22v-3a8 8 0 0 1 16 0v3Zm14-19a4 4 0 0 1 0 8m3 3c3 1 3 5 3 8',
  leaf: 'M3 21C3 9 10 4 22 2c0 13-8 19-16 15M3 21 17 7',
  calculator: 'M5 2h14v20H5Zm3 3h8v4H8ZM8 13h1m3 0h1m3 0h1M8 17h1m3 0h1m3 0h1',
  flower: 'M12 22C3 20 1 13 2 8c5 0 7 3 10 8 3-5 5-8 10-8 1 5-1 12-10 14Zm0-6C7 11 7 6 12 2c5 4 5 9 0 14',
  search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 7 7',
  arrow: 'M3 12h18m-7-7 7 7-7 7',
  flag: 'M4 22V2m0 1c6-4 10 4 16 0v11c-6 4-10-4-16 0',
  pin: 'M12 22S4 14 4 8a8 8 0 1 1 16 0c0 6-8 14-8 14Zm3-14a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  clock: 'M12 3a9 9 0 1 1-9 9M12 3v9l5 3M3 8V3h5',
  diamond: 'm3 3-3 7 12 12 12-12-3-7Zm-3 7h24M8 3l-3 7 7 12 7-12-3-7M5 10l7-7 7 7',
}

export default function MasterIcon({ name, className = '' }: { name: MasterIconName; className?: string }) {
  return <svg className={`master-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
