import { safeGet, safeSet, safeRemove } from './storage'

export const KEY = 'cfd.v1'
export const BACKUP_KEY = 'cfd.v1.corrupt'
export const SCHEMA_VERSION = 1
export const MAX_DAY = 84

export interface Completion { date: string; rating?: number }
export interface Progress { done: Record<number, Completion>; skipped: number[] }
export const emptyProgress = (): Progress => ({ done: {}, skipped: [] })

const pad = (n: number) => String(n).padStart(2, '0')
/** AAAA-MM-JJ en heure locale (indépendant des réglages de langue du navigateur). */
export const fmtDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const today = (now: Date = new Date()) => fmtDate(now)

export function isIsoDate(s: unknown): s is string {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const [y, m, d] = s.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
}
export const isDayNum = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= MAX_DAY
export const isRating = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 5

/** Valide strictement un objet {done, skipped}. Renvoie null s'il est invalide. */
export function parseProgress(raw: unknown): Progress | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const r = raw as Record<string, unknown>
  if (!r.done || typeof r.done !== 'object' || Array.isArray(r.done)) return null
  const out = emptyProgress()
  for (const [k, v] of Object.entries(r.done as Record<string, unknown>)) {
    if (!/^\d+$/.test(k)) return null
    const n = Number(k)
    if (!isDayNum(n) || !v || typeof v !== 'object') return null
    const c = v as Record<string, unknown>
    if (!isIsoDate(c.date)) return null
    if (c.rating !== undefined && !isRating(c.rating)) return null
    out.done[n] = c.rating === undefined ? { date: c.date } : { date: c.date, rating: c.rating as number }
  }
  const sk = r.skipped ?? []
  if (!Array.isArray(sk) || !sk.every(isDayNum)) return null
  out.skipped = [...new Set(sk as number[])].filter((n) => !out.done[n]).sort((a, b) => a - b)
  return out
}

/** Migre un objet stocké (de n'importe quelle version) vers la version courante. */
export type Migrated = { status: 'ok'; progress: Progress } | { status: 'future'; version: number } | { status: 'invalid' }
export function migrate(raw: unknown): Migrated {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { status: 'invalid' }
  const r = raw as Record<string, unknown>
  // v0 : ancien format sans champ « version » (même forme que la v1).
  const version = r.version === undefined ? 0 : r.version
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 0) return { status: 'invalid' }
  if (version > SCHEMA_VERSION) return { status: 'future', version }
  const p = parseProgress(r)
  return p ? { status: 'ok', progress: p } : { status: 'invalid' }
}

export type LoadState = 'ok' | 'corrupt' | 'future'
let state: LoadState = 'ok'
export const loadState = () => state

export function load(): Progress {
  state = 'ok'
  const s = safeGet(KEY)
  if (s === null) return emptyProgress()
  let raw: unknown
  try { raw = JSON.parse(s) } catch { raw = undefined }
  const m = migrate(raw)
  if (m.status === 'ok') return m.progress
  // Ne jamais écraser des données illisibles ou plus récentes : on les met de côté.
  state = m.status === 'future' ? 'future' : 'corrupt'
  if (state === 'corrupt') safeSet(BACKUP_KEY, s)
  return emptyProgress()
}
export const serialize = (p: Progress) => JSON.stringify({ version: SCHEMA_VERSION, done: p.done, skipped: p.skipped })
/** Sauvegarde ; renvoie false si le stockage échoue ou si les données sur disque sont d'une version plus récente. */
export function save(p: Progress): boolean {
  if (state === 'future') return false
  state = 'ok'
  return safeSet(KEY, serialize(p))
}
export function clear(): boolean { state = 'ok'; return safeRemove(KEY) }

export function nextDay(p: Progress, total: number) {
  for (let d = 1; d <= total; d++) if (!p.done[d] && !p.skipped.includes(d)) return d
  return total
}

/** Série de jours consécutifs (hier compte si aujourd'hui n'est pas encore fait). Dates locales : sûr aux changements d'heure. */
export function streak(p: Progress, now: Date = new Date()) {
  const dates = new Set(Object.values(p.done).map((x) => x.date))
  const y = now.getFullYear(), m = now.getMonth()
  let d = now.getDate()
  const at = () => fmtDate(new Date(y, m, d, 12)) // midi : évite les décalages de minuit lors des changements d'heure
  if (!dates.has(at())) d--
  let n = 0
  while (dates.has(at())) { n++; d-- }
  return n
}

export function markDone(p: Progress, n: number, date = today()): Progress {
  const prev = p.done[n]
  return { ...p, done: { ...p.done, [n]: { date, ...(prev?.rating ? { rating: prev.rating } : {}) } } }
}
export function undoDone(p: Progress, n: number): Progress {
  const done = { ...p.done }
  delete done[n]
  return { ...p, done }
}
/** Note de 1 à 5 sur un jour fait ; rating null (ou la même note) l'efface. */
export function setRating(p: Progress, n: number, rating: number | null): Progress {
  const c = p.done[n]
  if (!c) return p
  const next: Completion = { date: c.date }
  if (rating !== null && isRating(rating) && rating !== c.rating) next.rating = rating
  return { ...p, done: { ...p.done, [n]: next } }
}
