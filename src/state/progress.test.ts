import { describe, it, expect, beforeEach } from 'vitest'
import { streak, today, fmtDate, isIsoDate, parseProgress, migrate, load, save, loadState, KEY, BACKUP_KEY, markDone, undoDone, setRating, nextDay, SCHEMA_VERSION } from './progress'
import { parseBackup, mergeProgress, applyImport, buildBackup } from './backup'

const mem = new Map<string, string>()
const g = globalThis as unknown as { localStorage: unknown }
beforeEach(() => {
  mem.clear()
  g.localStorage = {
    getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v),
    removeItem: (k: string) => void mem.delete(k),
  }
})
const P = (...ds: [number, string, number?][]) => ({ done: Object.fromEntries(ds.map(([n, date, rating]) => [n, rating ? { date, rating } : { date }])), skipped: [] as number[] })

describe('streak et dates locales', () => {
  it('compte les jours consécutifs, hier suffit', () => {
    const now = new Date(2025, 5, 10, 9)
    expect(streak(P([1, '2025-06-10'], [2, '2025-06-09'], [3, '2025-06-08']), now)).toBe(3)
    expect(streak(P([1, '2025-06-09'], [2, '2025-06-08']), now)).toBe(2)
    expect(streak(P([1, '2025-06-08']), now)).toBe(0)
    expect(streak(P([1, '2025-06-10'], [2, '2025-06-08']), now)).toBe(1)
    expect(streak(P(), now)).toBe(0)
  })
  it('traverse les fins de mois et d’année', () => {
    expect(streak(P([1, '2026-01-01'], [2, '2025-12-31'], [3, '2025-12-30']), new Date(2026, 0, 1, 23, 59))).toBe(3)
    expect(streak(P([1, '2024-03-01'], [2, '2024-02-29']), new Date(2024, 2, 1, 0, 1))).toBe(2)
  })
  it('résiste aux changements d’heure (mars et novembre)', () => {
    const run = (y: number, m: number, d: number, n: number) => {
      const days = Array.from({ length: n }, (_, i) => [i + 1, fmtDate(new Date(y, m, d - i, 12))] as [number, string])
      return streak(P(...days), new Date(y, m, d, 0, 30))
    }
    expect(run(2025, 2, 10, 5)).toBe(5)
    expect(run(2025, 2, 31, 5)).toBe(5)
    expect(run(2025, 10, 4, 6)).toBe(6)
    expect(run(2025, 9, 28, 6)).toBe(6)
  })
  it('today est en AAAA-MM-JJ local', () => {
    expect(today(new Date(2025, 0, 5, 23, 59))).toBe('2025-01-05')
    expect(today(new Date(2025, 0, 5, 0, 0))).toBe('2025-01-05')
  })
  it('isIsoDate rejette les dates impossibles', () => {
    expect(isIsoDate('2025-02-29')).toBe(false)
    expect(isIsoDate('2024-02-29')).toBe(true)
    expect(isIsoDate('2025-6-1')).toBe(false)
    expect(isIsoDate(20250601)).toBe(false)
  })
})

describe('mutations', () => {
  it('markDone / undoDone / setRating / nextDay', () => {
    let p = markDone(P(), 7, '2025-06-01')
    p = setRating(p, 7, 4); expect(p.done[7].rating).toBe(4)
    p = setRating(p, 7, 4); expect(p.done[7].rating).toBeUndefined()
    p = setRating(p, 7, 3); p = markDone(p, 7, '2025-06-02'); expect(p.done[7]).toEqual({ date: '2025-06-02', rating: 3 })
    expect(setRating(p, 8, 3)).toBe(p)
    expect(nextDay(p, 84)).toBe(1)
    expect(undoDone(p, 7).done[7]).toBeUndefined()
  })
})

describe('migration et chargement', () => {
  it('v0 sans version et v1 sont acceptés', () => {
    expect(migrate({ done: { 1: { date: '2025-01-01' } }, skipped: [2] }).status).toBe('ok')
    expect(migrate({ version: 1, done: {}, skipped: [] }).status).toBe('ok')
  })
  it('version future et invalides', () => {
    expect(migrate({ version: 2, done: {} })).toEqual({ status: 'future', version: 2 })
    expect(migrate({ version: 'x', done: {} }).status).toBe('invalid')
    expect(migrate(null).status).toBe('invalid')
    expect(migrate({ done: { 99: { date: '2025-01-01' } } }).status).toBe('invalid')
  })
  it('load lit l’ancien format puis save ajoute la version', () => {
    mem.set(KEY, JSON.stringify({ done: { 3: { date: '2025-01-03' } }, skipped: [] }))
    const p = load(); expect(p.done[3].date).toBe('2025-01-03')
    save(p); expect(JSON.parse(mem.get(KEY)!).version).toBe(SCHEMA_VERSION)
  })
  it('JSON corrompu : copie de secours, pas de crash', () => {
    mem.set(KEY, '{oups')
    expect(load()).toEqual({ done: {}, skipped: [] })
    expect(loadState()).toBe('corrupt'); expect(mem.get(BACKUP_KEY)).toBe('{oups')
  })
  it('version future : on n’écrase rien', () => {
    const s = JSON.stringify({ version: 9, done: {}, skipped: [] }); mem.set(KEY, s)
    load(); expect(loadState()).toBe('future')
    expect(save(P([1, '2025-01-01']))).toBe(false); expect(mem.get(KEY)).toBe(s)
  })
  it('stockage bloqué : aucune exception', () => {
    const boom = () => { throw new Error('x') }
    g.localStorage = { getItem: boom, setItem: boom, removeItem: boom }
    expect(load()).toEqual({ done: {}, skipped: [] }); expect(save(P())).toBe(false)
  })
})

describe('import', () => {
  const themes = ['bayou', 'minuit']
  const good = (o: object = {}) => JSON.stringify({ app: 'violon-cadien', version: 1, exportedAt: 'x', progress: { done: { 7: { date: '2025-01-07', rating: 5 } }, skipped: [3] }, prefs: { lang: 'en', theme: 'bayou' }, ...o })
  it('accepte l’export complet et l’ancien export brut', () => {
    const r = parseBackup(good(), themes); expect(r.ok && r.prefs).toEqual({ lang: 'en', theme: 'bayou' })
    const old = parseBackup(JSON.stringify({ done: { 1: { date: '2025-01-01' } }, skipped: [] }), themes)
    expect(old.ok && old.progress.done[1].date).toBe('2025-01-01')
  })
  it('refuse ce qui est invalide', () => {
    const err = (s: string) => { const r = parseBackup(s, themes); return r.ok ? 'ok' : r.error }
    expect(err('pas du json')).toBe('json')
    expect(err('[]')).toBe('format'); expect(err('{"a":1}')).toBe('format')
    expect(err(good({ app: 'autre' }))).toBe('format')
    expect(err(good({ version: 2 }))).toBe('future')
    expect(err(good({ version: 'a' }))).toBe('format')
    const bad = (done: object, skipped: unknown = []) => err(good({ progress: { done, skipped } }))
    expect(bad({ 0: { date: '2025-01-01' } })).toBe('data')
    expect(bad({ 85: { date: '2025-01-01' } })).toBe('data')
    expect(bad({ 1.5: { date: '2025-01-01' } })).toBe('data')
    expect(bad({ 1: { date: '2025-13-01' } })).toBe('data')
    expect(bad({ 1: { date: '01/02/2025' } })).toBe('data')
    expect(bad({ 1: { date: '2025-01-01', rating: 6 } })).toBe('data')
    expect(bad({ 1: { date: '2025-01-01', rating: 2.5 } })).toBe('data')
    expect(bad({ 1: null })).toBe('data')
    expect(bad({}, [0])).toBe('data'); expect(bad({}, 'x')).toBe('data')
  })
  it('ignore un thème inconnu', () => {
    const r = parseBackup(good({ prefs: { lang: 'de', theme: 'zzz' } }), themes); expect(r.ok && r.prefs).toEqual({})
  })
  it('l’export contient la langue et le thème', () => {
    const b = buildBackup(P([1, '2025-01-01']), { lang: 'fr', theme: 'minuit' }, new Date(0))
    const r = parseBackup(JSON.stringify(b), themes); expect(r.ok && r.prefs).toEqual({ lang: 'fr', theme: 'minuit' })
  })
})

describe('fusion', () => {
  it('garde la complétion la plus récente par jour', () => {
    const a = P([1, '2025-01-01'], [2, '2025-03-01'])
    const b = P([2, '2025-02-01', 4], [3, '2025-01-03'])
    const m = mergeProgress(a, b)
    expect(m.done[1].date).toBe('2025-01-01'); expect(m.done[2]).toEqual({ date: '2025-03-01' }); expect(m.done[3].date).toBe('2025-01-03')
  })
  it('égalité : la note est conservée', () => {
    expect(mergeProgress(P([7, '2025-01-01']), P([7, '2025-01-01', 3])).done[7].rating).toBe(3)
    expect(mergeProgress(P([7, '2025-01-01', 3]), P([7, '2025-01-01'])).done[7].rating).toBe(3)
  })
  it('sautés : union, sans les jours faits', () => {
    const a = { ...P([1, '2025-01-01']), skipped: [2, 5] }; const b = { ...P(), skipped: [1, 5, 6] }
    expect(mergeProgress(a, b).skipped).toEqual([2, 5, 6])
  })
  it('replace remplace tout, merge ne modifie pas les entrées', () => {
    const a = P([1, '2025-01-01']), b = P([2, '2025-01-02'])
    expect(Object.keys(applyImport(a, b, 'replace').done)).toEqual(['2'])
    applyImport(a, b, 'merge'); expect(Object.keys(a.done)).toEqual(['1']); expect(Object.keys(b.done)).toEqual(['2'])
  })
  it('parseProgress trie et dédoublonne skipped', () => {
    expect(parseProgress({ done: {}, skipped: [5, 2, 5] })!.skipped).toEqual([2, 5])
  })
})
