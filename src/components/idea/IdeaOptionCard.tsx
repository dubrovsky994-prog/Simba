import { IconCheckSmall } from '../icons'

type IdeaOptionCardProps = {
  label: string
  selected: boolean
  onToggle: () => void
}

// Flat, low-chrome option row — same visual language as the rest of SIMBA's
// selectable cards: neutral fill at rest, light hover fill, teal fill + check
// mark when selected. Fixed min-height so selecting never shifts row size.
export default function IdeaOptionCard({ label, selected, onToggle }: IdeaOptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onToggle}
      className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 sm:px-5 ${
        selected ? 'border-accent/50 bg-accent/10' : 'border-transparent bg-black/[0.025] hover:bg-black/[0.05]'
      }`}
    >
      <span className={`text-sm sm:text-[15px] ${selected ? 'font-semibold text-accent-dark' : 'font-medium text-text-main'}`}>
        {label}
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 motion-reduce:transition-none ${
          selected ? 'border-accent bg-accent text-white' : 'border-[var(--line-neutral)] text-transparent'
        }`}
      >
        <IconCheckSmall className="h-3 w-3" />
      </span>
    </button>
  )
}
