type CalculatorNumberFieldProps = {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  inputMode?: 'numeric' | 'decimal' | 'text'
}

export default function CalculatorNumberField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  inputMode = 'decimal',
}: CalculatorNumberFieldProps) {
  return (
    <div className="mt-3 animate-calc-expand">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-text-main">
        {label}
      </label>
      <div
        className={`flex h-[50px] items-center rounded-2xl border bg-white/70 transition-colors duration-200 focus-within:border-accent/60 ${
          error ? 'border-red-400' : 'border-black/10'
        }`}
      >
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className="h-full w-full rounded-2xl border-0 bg-transparent px-4 text-sm text-text-main placeholder:text-text-muted/70 outline-none"
        />
      </div>
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  )
}
