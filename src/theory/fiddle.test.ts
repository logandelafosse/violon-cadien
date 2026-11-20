import { describe, expect, it } from 'vitest'
import { OPEN, freq, majorScale, noteName, pentatonic, position, SHIFT } from './fiddle'

describe('accord', () => {
  it('cordes à vide F3 C4 G4 D5', () => {
    expect([...OPEN].map((m) => freq(m).toFixed(2))).toEqual(['174.61', '261.63', '392.00', '587.33'])
  })
})
describe('gammes', () => {
  it('Do majeur : doigts 0123 0123 sur cordes Do et Sol', () => {
    const p = majorScale('C', 60, 72).map((m) => position(m, 'C')!)
    expect(p.slice(0, 8).map((x) => `${x.string}:${x.finger}`)).toEqual(['1:0', '1:1', '1:2', '1:3', '2:0', '2:1', '2:2', '2:3'])
  })
  it('Sol majeur contient Fa♯ pas Fa', () => {
    const n = majorScale('G', 67, 79).map((m) => noteName(m, 'G'))
    expect(n).toContain('Fa♯'); expect(n).not.toContain('Fa')
  })
  it('Fa majeur est écrit avec Si♭', () => {
    expect(majorScale('F', 53, 65).map((m) => noteName(m, 'F'))).toContain('Si♭')
  })
  it('doigté = son + 2', () => { expect(SHIFT).toBe(2); expect(noteName(60 + SHIFT, 'D')).toBe('Ré') })
  it('pentatonique Do = Do Ré Mi Sol La', () => {
    expect(pentatonic('C', 60, 71).map((m) => noteName(m))).toEqual(['Do', 'Ré', 'Mi', 'Sol', 'La'])
  })
})
