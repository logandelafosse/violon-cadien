// Tout est exprimé en hauteurs SONORES (MIDI). Le violon est accordé un ton plus bas : Fa-Do-Sol-Ré.
export const OPEN = [53, 60, 67, 74] as const // cordes 4→1 : F3 C4 G4 D5
import { i18n } from '../i18n.svelte'
const STRING_FR = ['Fa', 'Do', 'Sol', 'Ré'], STRING_EN = ['F', 'C', 'G', 'D']
export const stringLabel = (i: number) => (i18n.lang === 'en' ? STRING_EN : STRING_FR)[i]
export const SHIFT = 2 // doigté = son + 2 demi-tons

export type KeyName = 'C' | 'G' | 'F' | 'D' | 'A'
export const KEY_PC: Record<KeyName, number> = { C: 0, G: 7, F: 5, D: 2, A: 9 }
const MAJOR = [0, 2, 4, 5, 7, 9, 11]
const FLAT_KEYS = ['F']

const SHARP_FR = ['Do', 'Do♯', 'Ré', 'Ré♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si']
const FLAT_FR = ['Do', 'Ré♭', 'Ré', 'Mi♭', 'Mi', 'Fa', 'Sol♭', 'Sol', 'La♭', 'La', 'Si♭', 'Si']
const SHARP_EN = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
const FLAT_EN = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B']

export function freq(midi: number, a4 = 440) {
  return a4 * Math.pow(2, (midi - 69) / 12)
}

export function noteName(midi: number, key: string = 'C', octave = false) {
  const en = i18n.lang === 'en'
  const flat = FLAT_KEYS.includes(key)
  const names = en ? (flat ? FLAT_EN : SHARP_EN) : flat ? FLAT_FR : SHARP_FR
  const n = names[((midi % 12) + 12) % 12]
  return octave ? `${n}${Math.floor(midi / 12) - 1}` : n
}

/** Tonalité du « doigté » correspondant à une tonalité sonore. */
export function shapeKey(key: KeyName): string {
  return ({ C: 'D', G: 'A', F: 'G', D: 'E', A: 'B' } as Record<KeyName, string>)[key]
}
const SHAPE_FR: Record<KeyName, string> = { C: 'Ré', G: 'La', F: 'Sol', D: 'Mi', A: 'Si' }
const SHAPE_EN: Record<KeyName, string> = { C: 'D', G: 'A', F: 'G', D: 'E', A: 'B' }
const KEY_FR: Record<KeyName, string> = { C: 'Do', G: 'Sol', F: 'Fa', D: 'Ré', A: 'La' }
export const shapeName = (k: KeyName) => (i18n.lang === 'en' ? SHAPE_EN : SHAPE_FR)[k]
export const keyName = (k: KeyName) => (i18n.lang === 'en' ? k : KEY_FR[k])

export function majorScale(key: KeyName, from: number, to: number): number[] {
  const out: number[] = []
  for (let m = from; m <= to; m++) if (MAJOR.includes(((m - KEY_PC[key]) % 12 + 12) % 12)) out.push(m)
  return out
}
export function pentatonic(key: KeyName, from: number, to: number): number[] {
  const deg = [0, 2, 4, 7, 9]
  const out: number[] = []
  for (let m = from; m <= to; m++) if (deg.includes(((m - KEY_PC[key]) % 12 + 12) % 12)) out.push(m)
  return out
}

export interface Pos { string: number; finger: number } // string: 0..3 (0 = Fa grave)
/** Place une note en première position : corde la plus haute dont la corde à vide est ≤ note, doigt = rang dans la gamme majeure. */
export function position(midi: number, key: KeyName): Pos | null {
  let s = -1
  for (let i = 3; i >= 0; i--) if (OPEN[i] <= midi) { s = i; break }
  if (s < 0 || midi - OPEN[s] > 7) return null
  if (midi === OPEN[s]) return { string: s, finger: 0 }
  const between = majorScale(key, OPEN[s] + 1, midi).length
  return { string: s, finger: between }
}
