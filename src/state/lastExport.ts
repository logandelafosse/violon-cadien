import { safeGet, safeSet } from './storage'

const KEY = 'cfd.lastExport'

/** Date ISO du dernier export, ou null s'il n'y en a jamais eu (ou si elle est illisible). */
export function getLastExport(): string | null {
  const s = safeGet(KEY)
  return s && !Number.isNaN(Date.parse(s)) ? s : null
}

export function setLastExport(d: Date = new Date()): void {
  safeSet(KEY, d.toISOString())
}

/** « 12 nov. » / « Nov 12 » selon la langue ; null si jamais exporté. */
export function formatLastExport(iso: string | null, lang: 'fr' | 'en'): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short' })
}
