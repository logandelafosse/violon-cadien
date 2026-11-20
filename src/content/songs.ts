// Mélodies originales, écrites pour l'application. Hauteurs SONORES (MIDI), durées en temps.
export type Accord = 'C' | 'F' | 'G' | 'D' | 'Bb'
export interface Song {
  jour: number; cle?: 'C' | 'G' | 'F'; id: string; titre: string; description: string; titreEn: string; descriptionEn: string
  mesure: 2 | 3; tempo: number
  accords: Accord[]                       // un accord par mesure
  melodie: { m: number; d: number }[]     // durée en temps
}

const BASE_SONGS: Song[] = [
  {
    jour: 14, id: 'two-step-du-matin', titre: 'Two-step du matin', titreEn: 'Morning Two-Step', mesure: 2, tempo: 80,
    descriptionEn: 'A simple two-step in C, 8 bars. The chords are the accordion’s: mostly C and G, with an F passing through. Play the melody, then second yourself on the chords.',
    description: 'Un two-step simple en Do, 8 mesures. Les accords sont ceux de l’accordéon : surtout Do et Sol, avec un Fa en passage. Joue la mélodie, puis seconde-toi sur les accords.',
    accords: ['C', 'C', 'G', 'C', 'C', 'F', 'G', 'C'],
    melodie: [
      { m: 64, d: 1 }, { m: 67, d: 1 },
      { m: 64, d: 0.5 }, { m: 62, d: 0.5 }, { m: 60, d: 1 },
      { m: 62, d: 1 }, { m: 67, d: 1 },
      { m: 64, d: 1 }, { m: 60, d: 1 },
      { m: 64, d: 0.5 }, { m: 67, d: 0.5 }, { m: 72, d: 1 },
      { m: 69, d: 1 }, { m: 65, d: 1 },
      { m: 71, d: 0.5 }, { m: 69, d: 0.5 }, { m: 67, d: 1 },
      { m: 60, d: 2 },
    ],
  },
  {
    jour: 14, id: 'valse-du-bayou', titre: 'Valse du bayou', titreEn: 'Bayou Waltz', mesure: 3, tempo: 100,
    descriptionEn: 'A slow waltz in C, 8 bars. Feel the 1-2-3: beat 1 is the heaviest.',
    description: 'Une valse lente en Do, 8 mesures. Fais sentir le 1-2-3 : le temps 1 est le plus lourd.',
    accords: ['C', 'C', 'F', 'C', 'G', 'G', 'C', 'C'],
    melodie: [
      { m: 64, d: 1 }, { m: 67, d: 1 }, { m: 64, d: 1 },
      { m: 62, d: 1 }, { m: 64, d: 2 },
      { m: 65, d: 1 }, { m: 69, d: 1 }, { m: 65, d: 1 },
      { m: 64, d: 2 }, { m: 60, d: 1 },
      { m: 62, d: 1 }, { m: 67, d: 1 }, { m: 71, d: 1 },
      { m: 69, d: 2 }, { m: 67, d: 1 },
      { m: 64, d: 1 }, { m: 62, d: 1 }, { m: 60, d: 1 },
      { m: 60, d: 3 },
    ],
  },
]

import { i18n } from '../i18n.svelte'
import { LESSON_SONGS } from './lessonSongs'
const CHORD_FR: Record<Accord, string> = { C: 'Do', F: 'Fa', G: 'Sol', D: 'Ré', Bb: 'Si♭' }
const CHORD_EN: Record<Accord, string> = { C: 'C', F: 'F', G: 'G', D: 'D', Bb: 'B♭' }
export const chordName = (a: Accord) => (i18n.lang === 'en' ? CHORD_EN : CHORD_FR)[a]
export const songTitle = (s: Song) => (i18n.lang === 'en' ? s.titreEn : s.titre)
export const songDesc = (s: Song) => (i18n.lang === 'en' ? s.descriptionEn : s.description)
export const BASS: Record<Accord, number> = { C: 48, F: 53, G: 55, D: 50, Bb: 46 }
export const CHUCK: Record<Accord, number[]> = { C: [60, 64, 67], F: [60, 65, 69], G: [59, 62, 67], D: [62, 66, 69], Bb: [58, 62, 65] }

export const SONGS: Song[] = [...LESSON_SONGS, ...BASE_SONGS]

/** Jours sans chanson à eux : ils s'exercent sur les chansons d'un autre jour (même tonalité et mêmes accords). */
export const PRACTICE_MAP: Record<number, number> = {
  43: 20, 44: 20, 45: 20, 46: 20, 47: 20, 48: 27, 49: 20,
  50: 21, 51: 21, 52: 21, 53: 21, 54: 21, 55: 21, 56: 21,
  57: 21, 58: 21, 59: 21, 60: 21, 61: 21, 62: 28, 63: 21,
  64: 20, 65: 21, 66: 20, 67: 21, 68: 20, 69: 21, 70: 21,
  72: 71, 74: 73, 75: 71,
  78: 21, 79: 20, 80: 41, 81: 71, 82: 73, 83: 71, 84: 73,
}
/** Chansons d'un jour : les siennes, sinon celles du jour associé. */
export function songsFor(jour: number): { songs: Song[]; from: number } {
  const own = SONGS.filter((s) => s.jour === jour)
  if (own.length) return { songs: own, from: jour }
  const from = PRACTICE_MAP[jour]
  return { songs: from ? SONGS.filter((s) => s.jour === from) : [], from: from ?? jour }
}
