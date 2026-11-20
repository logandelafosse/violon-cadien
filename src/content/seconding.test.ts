import { describe, expect, it } from 'vitest'
import { DOUBLING, CHORD_KEY, STYLES, strokes } from './seconding'
import { OUTLINE, WEEKS } from './curriculum'
import { DAYS } from './days'
import { GLOSSARY } from './glossary'
import { position } from '../theory/fiddle'

describe('doublings (livret Balfa)', () => {
  it('Do = Do + Mi ; Sol = Sol + Si ; Si♭ = Si♭ + Ré', () => {
    expect(DOUBLING.C).toEqual([60, 64]); expect(DOUBLING.G).toEqual([67, 71]); expect(DOUBLING.Bb).toEqual([58, 62])
  })
  it('chaque doubling est jouable en première position', () => {
    for (const [a, [x, y]] of Object.entries(DOUBLING)) {
      const k = CHORD_KEY[a as keyof typeof CHORD_KEY]
      expect(position(x, k), a).not.toBeNull(); expect(position(y, k), a).not.toBeNull()
    }
  })
  it('doigtés du livret : Do sur corde de Fa doigt 4 impossible en 1re position mais Mi = corde de Do doigt 2', () => {
    expect(position(64, 'C')).toEqual({ string: 1, finger: 2 })
    expect(position(71, 'C')).toEqual({ string: 2, finger: 2 })
    expect(position(58, 'F')).toEqual({ string: 0, finger: 3 })
  })
})

describe('coups d’archet du segondeur', () => {
  for (const style of STYLES) for (const m of [2, 3] as const) {
    it(`${style} en ${m} temps remplit la mesure sans la dépasser`, () => {
      const st = strokes(style, m)
      for (const k of st) expect(k.t + k.d).toBeLessThanOrEqual(m + 1e-9)
      expect(st[0].t).toBe(0)
    })
  }
})

describe('programme', () => {
  it('les jours 22 à 84 ont un titre d’aperçu, une seule fois chacun', () => {
    expect(OUTLINE.map((o) => o.jour)).toEqual(Array.from({ length: 63 }, (_, i) => i + 22))
  })
  it('12 semaines et jours 1 à 21 écrits', () => {
    expect(WEEKS.length).toBe(12)
    expect(DAYS.map((d) => d.jour).sort((a, b) => a - b)).toEqual(Array.from({ length: 21 }, (_, i) => i + 1))
  })
  it('le glossaire a une définition française et anglaise partout', () => {
    for (const g of GLOSSARY) { expect(g.defFr.length).toBeGreaterThan(10); expect(g.defEn.length).toBeGreaterThan(10) }
  })
})
