import { describe, expect, it } from 'vitest'
import { DAYS, ALL_EN } from './days'

describe('traduction anglaise', () => {
  it('chaque jour a une traduction avec le même nombre d’étapes', () => {
    for (const d of DAYS) {
      const e = ALL_EN[d.jour]
      expect(e, `jour ${d.jour}`).toBeDefined()
      expect(e.etapes.length).toBe(d.etapes.length)
      expect(e.ecoute.length).toBe(d.ecoute.length)
      expect(e.autoeval.length).toBe(d.autoeval.length)
    }
  })
})

import { position, majorScale, pentatonic } from '../theory/fiddle'
describe('contenu des 84 jours', () => {
  it('chaque jour dure entre 15 et 30 minutes et a au moins trois étapes', () => {
    for (const d of DAYS) {
      expect(d.minutes, `jour ${d.jour}`).toBeGreaterThanOrEqual(15)
      expect(d.minutes, `jour ${d.jour}`).toBeLessThanOrEqual(30)
      expect(d.etapes.length, `jour ${d.jour}`).toBeGreaterThanOrEqual(3)
    }
  })
  it('les gammes et notes affichées sont jouables en première position', () => {
    for (const d of DAYS) for (const s of d.etapes) {
      if (s.gamme) {
        const g = s.gamme
        const notes = g.type === 'pentatonique' ? pentatonic(g.cle, g.de, g.a) : majorScale(g.cle, g.de, g.a)
        for (const m of notes) expect(position(m, g.cle), `jour ${d.jour} gamme ${m}`).not.toBeNull()
      }
      if (s.notes) for (const m of s.notes.notes) expect(position(m, s.notes.cle), `jour ${d.jour} notes ${m}`).not.toBeNull()
      if (s.metro) { expect(s.metro.bpm).toBeGreaterThanOrEqual(40); expect(s.metro.bpm).toBeLessThanOrEqual(160) }
    }
  })
  it('le texte n’emploie jamais « cajun » en français', () => {
    for (const d of DAYS) expect(JSON.stringify(d).toLowerCase(), `jour ${d.jour}`).not.toContain('cajun')
  })
  it('les journées de repos hebdomadaires (7, 14, … 84) sont des révisions', () => {
    for (const d of DAYS) if (d.jour % 7 === 0) expect(d.type).toBe('revue')
  })
})
