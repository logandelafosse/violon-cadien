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
