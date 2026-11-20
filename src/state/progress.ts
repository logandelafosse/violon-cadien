const KEY = 'cfd.v1'
export interface Progress { done: Record<number, { date: string; rating?: number }>; skipped: number[] }
const empty = (): Progress => ({ done: {}, skipped: [] })

export function load(): Progress {
  try { return { ...empty(), ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return empty() }
}
export function save(p: Progress) { try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* ignoré */ } }
export const today = () => new Date().toLocaleDateString('sv') // AAAA-MM-JJ local

export function nextDay(p: Progress, total: number) {
  for (let d = 1; d <= total; d++) if (!p.done[d] && !p.skipped.includes(d)) return d
  return total
}
export function streak(p: Progress) {
  const dates = new Set(Object.values(p.done).map((x) => x.date))
  const d = new Date()
  const fmt = (x: Date) => x.toLocaleDateString('sv')
  if (!dates.has(fmt(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (dates.has(fmt(d))) { n++; d.setDate(d.getDate() - 1) }
  return n
}
