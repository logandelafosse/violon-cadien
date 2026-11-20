import { describe, expect, it } from 'vitest'
import { STRING_X, THICK_LARGE, THICK_MEASURE, TAPES, MIN_SLOTS, semitone, slots, yOf } from './neck'
import { DOUBLING } from '../content/seconding'

describe('géométrie du manche', () => {
  it('quatre cordes, de plus en plus fines, de gauche à droite', () => {
    expect(STRING_X).toHaveLength(4)
    expect([...STRING_X]).toEqual([...STRING_X].sort((a, b) => a - b))
    for (const t of [THICK_LARGE, THICK_MEASURE]) expect([...t]).toEqual([...t].sort((a, b) => b - a))
    expect(TAPES).toEqual([2, 4, 5])
  })
  it('semitone : corde à vide = 0, doigt 1 = 2 demi-tons', () => {
    expect(semitone(60, 'C')).toBe(0) // Do à vide
    expect(semitone(62, 'C')).toBe(2) // Ré = doigt 1 sur la corde de Do
    expect(semitone(64, 'C')).toBe(4)
    expect(semitone(30, 'C')).toBeNull() // hors de la première position
  })
  it('slots : au moins 5, et assez pour le doigt 4', () => {
    expect(slots([60, 62], 'C')).toBe(MIN_SLOTS)
    // doubling de Do : le Do de la corde de Fa est joué avec le doigt 4 (7 demi-tons)
    expect(slots([...DOUBLING.C], 'C')).toBeGreaterThanOrEqual(MIN_SLOTS)
    expect(slots([55, 57, 59, 60], 'C')).toBeLessThanOrEqual(7)
  })
  it('yOf : proportionnel, 0 au sillet et 100 au dernier demi-ton', () => {
    expect(yOf(0, 5)).toBe(0)
    expect(yOf(5, 5)).toBe(100)
    expect(yOf(2, 5)).toBeCloseTo(40)
  })
})
