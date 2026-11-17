/** Standard annuity monthly payment. */
export function monthlyPayment(principal: number, annualRate: number, months: number) {
  if (principal <= 0) return 0
  const r = annualRate / 12
  if (r === 0) return principal / months
  return (principal * r) / (1 - Math.pow(1 + r, -months))
}
