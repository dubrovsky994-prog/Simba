const moneyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 })

export function formatMoney(value: number): string {
  return moneyFormatter.format(Math.round(value))
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}
