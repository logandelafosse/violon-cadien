import { describe, expect, it } from 'vitest'
import { DOUBLING, DOUBLING_ALT, DOUBLING_LOW_G, CHORD_KEY, STYLES, strokes } from './seconding'
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

describe('doublings relus sur les diagrammes du livret', () => {
  it('Fa = La (corde de Fa doigt 2) + Do à vide ; Ré = Ré + La', () => {
    expect(DOUBLING.F).toEqual([57, 60]); expect(DOUBLING.D).toEqual([62, 69])
    expect(position(57, 'C')).toEqual({ string: 0, finger: 2 })
  })
  it('les formes alternatives du livret (Sol grave, Sol Si+Ré, Ré Fa♯+La) sont jouables', () => {
    expect(DOUBLING_LOW_G).toEqual([55, 62]); expect(DOUBLING_ALT.G).toContainEqual([59, 62]); expect(DOUBLING_ALT.D).toEqual([[66, 69]])
    for (const alts of Object.values(DOUBLING_ALT)) for (const [x, y] of alts) { expect(position(x, 'C')).not.toBeNull(); expect(position(y, 'C')).not.toBeNull() }
  })
  it('les deux notes de chaque doubling sont à une tierce, une quarte ou une quinte', () => {
    for (const [x, y] of Object.values(DOUBLING)) expect([3, 4, 5, 7]).toContain(Math.abs(y - x))
  })
})

describe('shuffle selon le livret : un long qui roule + deux courts', () => {
  it('two-step : par temps, un roule puis deux courts', () => {
    const st = strokes('shuffle', 2)
    expect(st.map((k) => k.kind)).toEqual(['roule', 'court', 'court', 'roule', 'court', 'court'])
    expect(st[0].d).toBeGreaterThan(st[1].d)
  })
  it('valse : un roule fort sur le 1 puis deux courts sur le 2 et le 3', () => {
    const st = strokes('shuffle', 3)
    expect(st.map((k) => [k.kind, k.t, k.fort])).toEqual([['roule', 0, true], ['court', 1, false], ['court', 2, false]])
  })
  it('basse droite : un coup par temps, premier temps fort', () => {
    const st = strokes('droite', 3)
    expect(st.length).toBe(3); expect(st.map((k) => k.fort)).toEqual([true, false, false])
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
  it('12 semaines et les 84 jours écrits', () => {
    expect(WEEKS.length).toBe(12)
    expect(DAYS.map((d) => d.jour).sort((a, b) => a - b)).toEqual(Array.from({ length: 84 }, (_, i) => i + 1))
  })
  it('le glossaire a une définition française et anglaise partout', () => {
    for (const g of GLOSSARY) { expect(g.defFr.length).toBeGreaterThan(10); expect(g.defEn.length).toBeGreaterThan(10) }
  })
})
