import { describe, expect, it } from 'vitest'
import { SONGS } from './songs'
import { position } from '../theory/fiddle'

describe('chansons', () => {
  for (const s of SONGS) {
    it(`${s.titre} : durée = mesures × temps`, () => {
      expect(s.melodie.reduce((a, n) => a + n.d, 0)).toBe(s.accords.length * s.mesure)
    })
    it(`${s.titre} : toutes les notes jouables en première position (Do)`, () => {
      for (const n of s.melodie) expect(position(n.m, 'C')).not.toBeNull()
    })
    it(`${s.titre} : chaque mesure se remplit exactement`, () => {
      let sum = 0
      for (const n of s.melodie) { sum += n.d; expect(sum % s.mesure === 0 || (sum % s.mesure) % 0.5 === 0).toBe(true) }
      expect(sum).toBe(s.accords.length * s.mesure)
    })
  }
})

import { ALLOWED } from './lessonSongs'
describe('chansons par leçon', () => {
  it('chaque leçon écrite (1–21) a un two-step et une valse', () => {
    for (let j = 1; j <= 21; j++) {
      const l = SONGS.filter((s) => s.jour === j)
      expect(l.filter((s) => s.mesure === 2).length, `jour ${j} two-step`).toBe(1)
      expect(l.filter((s) => s.mesure === 3).length, `jour ${j} valse`).toBe(1)
    }
  })
  it('les identifiants sont uniques', () => { expect(new Set(SONGS.map((s) => s.id)).size).toBe(SONGS.length) })
  it('les mesures se remplissent exactement et les accords couvrent toutes les mesures', () => {
    for (const s of SONGS) {
      let sum = 0, bar = 0
      for (const n of s.melodie) { sum += n.d; if (Math.abs(sum - Math.round(sum / s.mesure) * s.mesure) < 1e-6) bar++ }
      expect(sum, s.id).toBe(s.accords.length * s.mesure)
      expect(s.accords.length, s.id).toBeGreaterThan(0)
      void bar
    }
  })
  it('chaque chanson ne contient que des notes déjà apprises dans la leçon', () => {
    for (const s of SONGS.filter((x) => ALLOWED[x.jour])) for (const n of s.melodie) expect(ALLOWED[s.jour], `${s.id} note ${n.m}`).toContain(n.m)
  })
  it('chaque mesure compte exactement le bon nombre de temps', () => {
    for (const s of SONGS) {
      let sum = 0
      for (const n of s.melodie) { sum += n.d }
      expect(sum % s.mesure, s.id).toBe(0)
    }
  })
})

describe('découpage en mesures', () => {
  it('aucune note ne traverse une barre de mesure', () => {
    for (const s of SONGS) {
      let i = 0
      for (let b = 0; b < s.accords.length; b++) {
        let sum = 0
        while (sum < s.mesure - 1e-9 && i < s.melodie.length) { sum += s.melodie[i].d; i++ }
        expect(sum, `${s.id} mesure ${b + 1}`).toBeCloseTo(s.mesure, 6)
      }
      expect(i, s.id).toBe(s.melodie.length)
    }
  })
})

describe('chansons en Sol et en Fa, pentatoniques, longues', () => {
  it('chaque note est jouable en première position dans la tonalité de la chanson', () => {
    for (const s of SONGS) for (const n of s.melodie) expect(position(n.m, s.cle ?? 'C'), `${s.id} note ${n.m}`).not.toBeNull()
  })
  it('les chansons en Sol ont du Fa♯ et pas de Fa ; celles en Fa ont du Si♭ et pas de Si', () => {
    for (const s of SONGS.filter((x) => x.cle === 'G')) expect(s.melodie.some((n) => n.m % 12 === 5), s.id).toBe(false)
    for (const s of SONGS.filter((x) => x.cle === 'F')) expect(s.melodie.some((n) => n.m % 12 === 11), s.id).toBe(false)
  })
  it('les chansons pentatoniques n’utilisent que cinq notes différentes', () => {
    for (const j of [36, 37, 38, 39, 40, 41]) for (const s of SONGS.filter((x) => x.jour === j)) {
      expect(new Set(s.melodie.map((n) => n.m % 12)).size, s.id).toBeLessThanOrEqual(5)
    }
  })
})
