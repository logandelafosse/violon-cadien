import { SCHEMA_VERSION, parseProgress, emptyProgress, type Progress } from './progress'

export const BACKUP_APP = 'violon-cadien'
export interface Prefs { lang?: 'fr' | 'en'; theme?: string }
export interface Backup { app: typeof BACKUP_APP; version: number; exportedAt: string; progress: Progress; prefs: Prefs }
export type ImportError = 'json' | 'format' | 'future' | 'data'
export type ImportResult = { ok: true; progress: Progress; prefs: Prefs } | { ok: false; error: ImportError }

export function buildBackup(p: Progress, prefs: Prefs, now: Date = new Date()): Backup {
  return { app: BACKUP_APP, version: SCHEMA_VERSION, exportedAt: now.toISOString(), progress: { done: p.done, skipped: p.skipped }, prefs }
}

/**
 * Valide un fichier d'import sans rien modifier. Accepte le format actuel
 * ({app, version, progress, prefs}) et l'ancien export brut ({done, skipped}).
 * `themes` = liste des thèmes valides ; un thème inconnu est simplement ignoré.
 */
export function parseBackup(text: string, themes: readonly string[] = []): ImportResult {
  let raw: unknown
  try { raw = JSON.parse(text) } catch { return { ok: false, error: 'json' } }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, error: 'format' }
  const r = raw as Record<string, unknown>
  let prog: unknown, prefsRaw: unknown
  if ('progress' in r) {
    if (r.app !== BACKUP_APP) return { ok: false, error: 'format' }
    if (typeof r.version !== 'number' || !Number.isInteger(r.version) || r.version < 1) return { ok: false, error: 'format' }
    if (r.version > SCHEMA_VERSION) return { ok: false, error: 'future' }
    prog = r.progress; prefsRaw = r.prefs
  } else if ('done' in r) {
    if (r.version !== undefined) {
      if (typeof r.version !== 'number' || !Number.isInteger(r.version) || r.version < 0) return { ok: false, error: 'format' }
      if (r.version > SCHEMA_VERSION) return { ok: false, error: 'future' }
    }
    prog = r
  } else return { ok: false, error: 'format' }
  const progress = parseProgress(prog)
  if (!progress) return { ok: false, error: 'data' }
  const prefs: Prefs = {}
  if (prefsRaw && typeof prefsRaw === 'object' && !Array.isArray(prefsRaw)) {
    const q = prefsRaw as Record<string, unknown>
    if (q.lang === 'fr' || q.lang === 'en') prefs.lang = q.lang
    if (typeof q.theme === 'string' && themes.includes(q.theme)) prefs.theme = q.theme
  }
  return { ok: true, progress, prefs }
}

/** Fusion : pour chaque jour, on garde la complétion la plus récente (à égalité, celle qui a une note). */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const out = emptyProgress()
  const days = new Set([...Object.keys(a.done), ...Object.keys(b.done)].map(Number))
  for (const n of days) {
    const x = a.done[n], y = b.done[n]
    if (!x || !y) out.done[n] = { ...(x ?? y) }
    else if (x.date !== y.date) out.done[n] = { ...(x.date > y.date ? x : y) }
    else out.done[n] = { ...(y.rating ? y : x) }
  }
  out.skipped = [...new Set([...a.skipped, ...b.skipped])].filter((n) => !out.done[n]).sort((p, q) => p - q)
  return out
}
export const applyImport = (current: Progress, incoming: Progress, mode: 'merge' | 'replace'): Progress =>
  mode === 'replace' ? { done: { ...incoming.done }, skipped: [...incoming.skipped] } : mergeProgress(current, incoming)
