// Logique pure (sans DOM) : détection de hauteur (YIN), cents, cordes cibles, référence La4.
import { OPEN, freq } from '../theory/fiddle'

export const A4_DEFAULT = 440, A4_MIN = 430, A4_MAX = 450

/** Borne la référence La4 à 430–450 Hz ; valeur invalide → 440. */
export function clampA4(v: unknown): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v))
  if (!Number.isFinite(n)) return A4_DEFAULT
  return Math.min(A4_MAX, Math.max(A4_MIN, n))
}

/** Écart en cents de `f` par rapport à `target` (positif = trop haut). */
export function cents(f: number, target: number): number {
  return 1200 * Math.log2(f / target)
}

/** MIDI fractionnaire d'une fréquence, pour une référence La4 donnée. */
export function midiOf(f: number, a4 = A4_DEFAULT): number {
  return 69 + 12 * Math.log2(f / a4)
}

export interface Pitch { freq: number; clarity: number }

/**
 * YIN (de Cheveigné & Kawahara, 2002). Renvoie null si le signal est trop faible ou non périodique.
 * Le buffer doit couvrir au moins ~3 périodes de la plus grave fréquence visée.
 */
export function detectPitch(buf: Float32Array, sampleRate: number, minFreq = 120, maxFreq = 1000, threshold = 0.15): Pitch | null {
  const W = Math.floor(buf.length / 2)
  const maxTau = Math.min(W - 1, Math.floor(sampleRate / minFreq))
  const minTau = Math.max(2, Math.floor(sampleRate / maxFreq))
  if (maxTau <= minTau + 2) return null
  let energy = 0
  for (let i = 0; i < buf.length; i++) energy += buf[i] * buf[i]
  if (Math.sqrt(energy / buf.length) < 0.005) return null

  const d = new Float32Array(maxTau + 1)
  for (let tau = 1; tau <= maxTau; tau++) {
    let s = 0
    for (let i = 0; i < W; i++) { const x = buf[i] - buf[i + tau]; s += x * x }
    d[tau] = s
  }
  const n = new Float32Array(maxTau + 1)
  n[0] = 1
  let run = 0
  for (let tau = 1; tau <= maxTau; tau++) {
    run += d[tau]
    n[tau] = run === 0 ? 1 : (d[tau] * tau) / run
  }
  let tau = -1
  for (let t = minTau; t <= maxTau; t++) {
    if (n[t] < threshold) {
      while (t + 1 <= maxTau && n[t + 1] < n[t]) t++
      tau = t; break
    }
  }
  if (tau < 0) return null
  let better = tau
  if (tau > 1 && tau < maxTau) {
    const a = n[tau - 1], b = n[tau], c = n[tau + 1]
    const den = a - 2 * b + c
    if (den !== 0) better = tau + (a - c) / (2 * den)
  }
  return { freq: sampleRate / better, clarity: 1 - n[tau] }
}

export interface StringTarget { index: number; midi: number; freq: number; cents: number }

/** Corde à vide la plus proche (en cents) d'une fréquence mesurée. */
export function nearestString(f: number, a4 = A4_DEFAULT): StringTarget {
  let best = 0, bestAbs = Infinity
  OPEN.forEach((m, i) => {
    const a = Math.abs(cents(f, freq(m, a4)))
    if (a < bestAbs) { bestAbs = a; best = i }
  })
  const tf = freq(OPEN[best], a4)
  return { index: best, midi: OPEN[best], freq: tf, cents: cents(f, tf) }
}

export type Verdict = 'juste' | 'bas' | 'haut' | 'tres_bas' | 'tres_haut'
/** Classe un écart : ±5 cents = juste ; au-delà de 25 = nettement faux. */
export function verdict(c: number): Verdict {
  if (Math.abs(c) <= 5) return 'juste'
  if (c < 0) return c < -25 ? 'tres_bas' : 'bas'
  return c > 25 ? 'tres_haut' : 'haut'
}

/** Plus proche note tempérée (MIDI entier, La4 = 440) d'une fréquence. */
export function nearestMidi(f: number): number { return Math.round(midiOf(f, A4_DEFAULT)) }

/**
 * Calibrage sur l'accordéon : fréquence mesurée `f` pour la note sonore `midi` → La4 équivalent, borné.
 * Renvoie null si l'écart dépasse 60 cents (probablement une autre note).
 */
export function a4FromReference(f: number, midi: number): number | null {
  const a4 = f / Math.pow(2, (midi - 69) / 12)
  if (Math.abs(1200 * Math.log2(a4 / A4_DEFAULT)) > 60) return null
  return clampA4(Math.round(a4 * 10) / 10)
}
