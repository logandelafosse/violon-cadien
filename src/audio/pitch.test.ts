import { describe, expect, it } from 'vitest'
import { A4_DEFAULT, a4FromReference, cents, clampA4, detectPitch, nearestMidi, nearestString, verdict } from './pitch'
import { OPEN, freq } from '../theory/fiddle'

function synth(f: number, sr: number, kind: 'sine' | 'saw' | 'rich', n = 4096, noise = 0) {
  const b = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const ph = (i * f) / sr
    const x = kind === 'sine' ? Math.sin(2 * Math.PI * ph)
      : kind === 'saw' ? 2 * (ph - Math.floor(ph + 0.5))
      : Math.sin(2 * Math.PI * ph) * 0.3 + Math.sin(4 * Math.PI * ph) * 0.6 + Math.sin(6 * Math.PI * ph) * 0.3
    b[i] = 0.5 * x + noise * (((i * 7919) % 1000) / 500 - 1)
  }
  return b
}

describe('detectPitch', () => {
  for (const sr of [44100, 48000]) {
    for (const m of OPEN) {
      for (const kind of ['sine', 'saw', 'rich'] as const) {
        it(`${kind} ${freq(m).toFixed(1)} Hz @ ${sr}`, () => {
          const f = freq(m), p = detectPitch(synth(f, sr, kind), sr)
          expect(p).not.toBeNull()
          expect(Math.abs(cents(p!.freq, f))).toBeLessThan(4)
        })
      }
    }
  }
  it('détecte 435 Hz', () => {
    const p = detectPitch(synth(435, 44100, 'saw'), 44100)!
    expect(Math.abs(cents(p.freq, 435))).toBeLessThan(3)
  })
  it('tolère un peu de bruit', () => {
    const p = detectPitch(synth(261.63, 48000, 'saw', 4096, 0.05), 48000)!
    expect(Math.abs(cents(p.freq, 261.63))).toBeLessThan(6)
  })
  it('rejette le silence et le bruit', () => {
    expect(detectPitch(new Float32Array(4096), 44100)).toBeNull()
    const noise = new Float32Array(4096)
    let s = 12345
    for (let i = 0; i < noise.length; i++) { s = (s * 1103515245 + 12345) & 0x7fffffff; noise[i] = (s / 0x7fffffff - 0.5) * 0.5 }
    const p = detectPitch(noise, 44100)
    expect(p === null || p.clarity < 0.85).toBe(true)
  })
})

describe('cents et cordes', () => {
  it('cents', () => {
    expect(cents(440, 440)).toBeCloseTo(0)
    expect(cents(880, 440)).toBeCloseTo(1200)
    expect(cents(440 * Math.pow(2, 10 / 1200), 440)).toBeCloseTo(10)
  })
  it('corde la plus proche', () => {
    OPEN.forEach((m, i) => expect(nearestString(freq(m) * 1.01).index).toBe(i))
    const n = nearestString(freq(60) * Math.pow(2, -20 / 1200))
    expect(n.index).toBe(1); expect(n.cents).toBeCloseTo(-20, 1)
  })
  it('suit la référence La4', () => {
    const f = freq(53, 435)
    const n = nearestString(f, 435)
    expect(n.index).toBe(0); expect(n.cents).toBeCloseTo(0, 5)
    expect(nearestString(f, 440).cents).toBeLessThan(-15)
  })
  it('verdict', () => {
    expect(verdict(0)).toBe('juste'); expect(verdict(-4)).toBe('juste')
    expect(verdict(-15)).toBe('bas'); expect(verdict(-40)).toBe('tres_bas')
    expect(verdict(15)).toBe('haut'); expect(verdict(40)).toBe('tres_haut')
  })
})

describe('La4', () => {
  it('borne 430–450', () => {
    expect(clampA4(420)).toBe(430); expect(clampA4(460)).toBe(450); expect(clampA4(442)).toBe(442)
    expect(clampA4('441.5')).toBe(441.5); expect(clampA4('abc')).toBe(A4_DEFAULT); expect(clampA4(NaN)).toBe(A4_DEFAULT)
  })
  it('calibrage depuis un Do d’accordéon', () => {
    expect(nearestMidi(262)).toBe(60)
    expect(a4FromReference(freq(60, 444), 60)).toBeCloseTo(444, 1)
    expect(a4FromReference(freq(60, 455), 60)).toBe(450)
    expect(a4FromReference(freq(61), 60)).toBeNull()
  })
})
