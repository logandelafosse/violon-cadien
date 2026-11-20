import { beforeEach, describe, expect, it } from 'vitest'
import { formatLastExport, getLastExport, setLastExport } from './lastExport'

const mem = new Map<string, string>()
beforeEach(() => {
  mem.clear()
  ;(globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, v),
    removeItem: (k: string) => void mem.delete(k),
  }
})

describe('dernier export', () => {
  it('jamais exporté par défaut', () => {
    expect(getLastExport()).toBeNull()
    expect(formatLastExport(null, 'fr')).toBeNull()
  })
  it('garde la date du dernier export', () => {
    setLastExport(new Date('2026-11-12T10:00:00Z'))
    expect(getLastExport()).toBe('2026-11-12T10:00:00.000Z')
  })
  it('ignore une valeur illisible', () => {
    mem.set('cfd.lastExport', 'pas une date')
    expect(getLastExport()).toBeNull()
    expect(formatLastExport('pas une date', 'fr')).toBeNull()
  })
  it('formate court selon la langue', () => {
    const iso = '2026-11-12T12:00:00Z'
    expect(formatLastExport(iso, 'fr')).toMatch(/12/)
    expect(formatLastExport(iso, 'fr')).toMatch(/nov/i)
    expect(formatLastExport(iso, 'en')).toMatch(/Nov/)
  })
})
