import type { CalculationInputs, CalculationResult } from './types'

const AVG_WEEKS_PER_MONTH = 4.33

// Pure formulas only — intermediate values are never rounded, only the
// final numbers shown to the user are (in the formatter, not here).
export function calculateLoss(inputs: CalculationInputs): CalculationResult {
  const missedShare = inputs.missedRate / 100
  const conversionShare = inputs.conversionRate / 100
  const cancelShare = inputs.cancelRate / 100

  const lostLeads = inputs.inquiries * missedShare * conversionShare * inputs.avgCheck
  const bookings = inputs.inquiries * (1 - missedShare) * conversionShare
  const cancellationLoss = bookings * cancelShare * inputs.avgCheck
  const manualCost = inputs.manualHours * inputs.hourValue * AVG_WEEKS_PER_MONTH
  const cashLoss = lostLeads + cancellationLoss
  const totalBurden = cashLoss + manualCost

  const conservative = lostLeads * 0.3 + cancellationLoss * 0.25 + manualCost * 0.4
  const realistic = lostLeads * 0.45 + cancellationLoss * 0.35 + manualCost * 0.55
  const potential = lostLeads * 0.6 + cancellationLoss * 0.5 + manualCost * 0.7

  return {
    lostLeads,
    bookings,
    cancellationLoss,
    manualCost,
    cashLoss,
    totalBurden,
    conservative,
    realistic,
    potential,
  }
}
