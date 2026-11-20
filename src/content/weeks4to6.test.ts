import { describe, expect, it } from 'vitest'
import { DAYS, ALL_EN } from './days'
import { SONGS } from './songs'
import { pentatonic } from '../theory/fiddle'

const range = DAYS.filter((d) => d.jour >= 22 && d.jour <= 42)

describe('semaines 4 à 6 : jours écrits à la main', () => {
  it('aucun texte d’étape n’est répété d’un jour à l’autre (hors accordage)', () => {
    const seen = new Map<string, number>()
    for (const d of range) for (const e of d.etapes) {
      if (e.cordes) continue
      expect(seen.has(e.texte), `jour ${d.jour} « ${e.titre} » répète le jour ${seen.get(e.texte)}`).toBe(false)
      seen.set(e.texte, d.jour)
    }
  })
  it('les textes anglais ne sont pas des copies du français', () => {
    for (const d of range) d.etapes.forEach((e, i) => { if (!e.cordes) expect(ALL_EN[d.jour].etapes[i].texte, `jour ${d.jour}`).not.toBe(e.texte) })
  })
  it('les jours en Sol mentionnent le Fa♯ et ceux en Fa le Si♭', () => {
    for (const d of range.filter((x) => x.jour >= 22 && x.jour <= 28)) expect(JSON.stringify(d), `jour ${d.jour}`).toContain('Fa♯')
    for (const d of range.filter((x) => x.jour >= 29 && x.jour <= 35)) expect(JSON.stringify(d), `jour ${d.jour}`).toContain('Si♭')
  })
  it('les pentatoniques sautent Fa et Si (Do), Do et Fa♯ (Sol), Si♭ et Mi (Fa)', () => {
    const skip: Record<string, number[]> = { C: [5, 11], G: [0, 6], F: [10, 4] }
    let n = 0
    for (const d of range) for (const e of d.etapes) {
      if (e.gamme?.type !== 'pentatonique') continue
      n++
      for (const m of pentatonic(e.gamme.cle, e.gamme.de, e.gamme.a)) expect(skip[e.gamme.cle], `jour ${d.jour} note ${m}`).not.toContain(m % 12)
    }
    expect(n).toBeGreaterThanOrEqual(5)
  })
  it('l’appel et réponse du jour 41 n’utilise que Do, Mi et Sol', () => {
    for (const s of SONGS.filter((x) => x.jour === 41)) for (const n of s.melodie) expect([0, 4, 7], s.id).toContain(n.m % 12)
  })
})
