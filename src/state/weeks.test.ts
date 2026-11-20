import { describe, expect, it } from 'vitest'
import { weekOf, weekCounts, weekPercent } from './weeks'

describe('semaines', () => {
  it('weekOf : jours 1–7 = semaine 1, 8 = semaine 2, 84 = semaine 12', () => {
    expect([1, 7, 8, 14, 15, 84].map(weekOf)).toEqual([1, 1, 2, 2, 3, 12])
  })
  it('weekOf ramène les valeurs hors plage dans 1–12', () => {
    expect(weekOf(0)).toBe(1)
    expect(weekOf(200)).toBe(12)
  })
  it('weekCounts : aucune progression = 12 zéros', () => {
    expect(weekCounts([])).toEqual(Array(12).fill(0))
  })
  it('weekCounts : 12 jours faits = semaine 1 pleine, 5 dans la semaine 2', () => {
    const days = Array.from({ length: 12 }, (_, i) => i + 1)
    expect(weekCounts(days)).toEqual([7, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  })
  it('weekCounts : jours dispersés, doublons et valeurs invalides ignorés', () => {
    expect(weekCounts([1, 1, 8, 84, 0, 85, 3.5, -2])).toEqual([1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
  })
  it('weekCounts : les 84 jours donnent 7 partout', () => {
    expect(weekCounts(Array.from({ length: 84 }, (_, i) => i + 1))).toEqual(Array(12).fill(7))
  })
  it('weekPercent : 0, 7/7, bornes', () => {
    expect(weekPercent(0)).toBe(0)
    expect(weekPercent(7)).toBe(100)
    expect(weekPercent(1)).toBe(14)
    expect(weekPercent(9)).toBe(100)
    expect(weekPercent(-1)).toBe(0)
  })
})
