const pad = (n: number) => String(n).padStart(2, '0')

/** Local calendar date as "YYYY-MM-DD" (`toISOString()` would shift it to UTC). */
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1)
}
