/** Formats input as +998 XX XXX XX XX */
export function formatUzPhone(raw: string) {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('998')) d = d.slice(3)
  d = d.slice(0, 9)
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean)
  return '+998' + (parts.length ? ' ' + parts.join(' ') : '')
}

export const isValidUzPhone = (v: string) => v.replace(/\D/g, '').length === 12
