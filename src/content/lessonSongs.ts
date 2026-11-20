import type { Song, Accord } from './songs'
import { L2 } from './lessonData2'

// Notation compacte : une mesure par segment séparé par « | », une note = nom + octave (C4 = Do central),
// durée en temps après « : » (1 par défaut). Exemple : « E4 G4:2 ». Hauteurs SONORES.
const PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
/** « F#4 », « Bb3 », « C4 » → numéro MIDI. */
const midi = (n: string) => {
  const m = /^([A-G])([#b]?)(\d)$/.exec(n)
  if (!m) throw new Error(`note invalide : ${n}`)
  return (Number(m[3]) + 1) * 12 + PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0)
}

export function parseMelody(src: string): { m: number; d: number }[] {
  return src.split('|').flatMap((bar) =>
    bar.trim().split(/\s+/).map((tok) => {
      const [n, d] = tok.split(':')
      return { m: midi(n), d: d ? Number(d) : 1 }
    }),
  )
}

export interface Spec { titre: string; titreEn: string; bars: string; accords: string }
export interface Lesson { jour: number; cle?: 'C' | 'G' | 'F'; fr: string; en: string; ts?: Spec; w?: Spec }

const L: Lesson[] = [
  { jour: 1, fr: 'Seulement des cordes à vide.', en: 'Open strings only.',
    ts: { titre: 'Two-step des cordes à vide', titreEn: 'Open-String Two-Step', bars: 'C4 C4 | C4 G4 | G4 G4 | C4 C4 | C4 C4 | G4 G4 | G4 C4 | C4:2', accords: 'C C G C C G G C' },
    w: { titre: 'Valse des cordes à vide', titreEn: 'Open-String Waltz', bars: 'C4:3 | G4:3 | C4 C4 C4 | G4 G4 G4 | C4:3 | G4 G4 G4 | C4 G4 C4 | C4:3', accords: 'C G C G C G C C' } },
  { jour: 2, fr: 'Deux cordes à vide, Do et Sol, avec le pouls du two-step.', en: 'Two open strings, C and G, with the two-step pulse.',
    ts: { titre: 'Va-et-vient', titreEn: 'Back and Forth', bars: 'C4 G4 | C4 G4 | G4 C4 | G4 G4 | C4 G4 | C4 C4 | G4 G4 | C4:2', accords: 'C C G G C C G C' },
    w: { titre: 'Valse du balancement', titreEn: 'Swaying Waltz', bars: 'C4 G4 G4 | C4 G4 G4 | G4 C4 C4 | G4:3 | C4 G4 G4 | C4 G4 G4 | G4 C4 C4 | C4:3', accords: 'C C G G C C G C' } },
  { jour: 3, fr: 'Quatre notes sur la corde de Do : Do, Ré, Mi, Fa.', en: 'Four notes on the C string: C, D, E, F.',
    ts: { titre: 'Quatre notes', titreEn: 'Four Notes', bars: 'C4 D4 | E4 F4 | E4 D4 | C4:2 | E4 E4 | F4 E4 | D4 D4 | C4:2', accords: 'C C G C C F G C' },
    w: { titre: 'Valse à quatre notes', titreEn: 'Four-Note Waltz', bars: 'C4 D4 E4 | F4 E4 D4 | E4 F4 E4 | D4:2 C4 | E4 E4 F4 | E4 D4 C4 | D4 E4 D4 | C4:3', accords: 'C C F C C F G C' } },
  { jour: 4, fr: 'La gamme de Do au complet : Do4 à Do5.', en: 'The full C scale: C4 to C5.',
    ts: { titre: 'Montée de l’octave', titreEn: 'Up the Octave', bars: 'C4 E4 | G4 E4 | A4 G4 | E4 C4 | D4 F4 | A4 F4 | G4 B4 | C5:2', accords: 'C C F C G F G C' },
    w: { titre: 'Valse de l’octave', titreEn: 'Octave Waltz', bars: 'C4 E4 G4 | C5:2 G4 | A4 F4 D4 | G4:3 | C4 E4 G4 | A4 G4 F4 | E4 D4 G4 | C4:3', accords: 'C C F G C F G C' } },
  { jour: 5, fr: 'Trois notes sur la corde de Sol : Sol, La, Si (doigt 2 haut).', en: 'Three notes on the G string: G, A, B (high 2nd finger).',
    ts: { titre: 'Trois notes sur Sol', titreEn: 'Three on the G String', bars: 'G4 A4 | B4 A4 | G4 A4 | B4:2 | A4 B4 | B4 A4 | G4 A4 | G4:2', accords: 'C C G C C C G C' },
    w: { titre: 'Valse de la corde de Sol', titreEn: 'G String Waltz', bars: 'G4 A4 B4 | A4 G4 A4 | B4:2 A4 | G4:3 | G4 B4 A4 | G4 A4 B4 | A4 G4 A4 | G4:3', accords: 'C G C G C G G C' } },
  { jour: 6, fr: 'Notes tenues avec le doigt 3 (Fa4 et Do5) : écoute la résonance.', en: 'Held notes with finger 3 (F4 and C5): listen for the resonance.',
    ts: { titre: 'Le doigt qui chante', titreEn: 'The Singing Finger', bars: 'C4 F4 | E4 D4 | C4 F4 | G4:2 | G4 C5 | B4 A4 | G4 F4 | C4:2', accords: 'C C F G C G F C' },
    w: { titre: 'Valse du troisième doigt', titreEn: 'Third-Finger Waltz', bars: 'F4:2 E4 | D4 E4 F4 | G4:2 C5 | C5:2 G4 | F4:2 E4 | D4 E4 F4 | G4 E4 D4 | C4:3', accords: 'F C C G F C G C' } },
  { jour: 7, fr: 'Révision : cordes à vide et gamme de Do.', en: 'Review: open strings and the C scale.',
    ts: { titre: 'Two-step de révision', titreEn: 'Review Two-Step', bars: 'C4 E4 | G4 G4 | A4 G4 | E4 E4 | F4 A4 | G4 E4 | D4 G4 | C4:2', accords: 'C C F C F C G C' },
    w: { titre: 'Valse de révision', titreEn: 'Review Waltz', bars: 'C4 G4 G4 | E4 G4 G4 | A4 G4 F4 | E4:2 C4 | D4 E4 F4 | G4 E4 C4 | D4 G4 D4 | C4:3', accords: 'C C F C G C G C' } },
  { jour: 8, fr: 'Do majeur en noires, à 60 et plus.', en: 'C major in quarter notes, at 60 and up.',
    ts: { titre: 'La gamme qui marche', titreEn: 'The Walking Scale', bars: 'C4 D4 | E4 F4 | G4 F4 | E4 D4 | E4 G4 | C5 G4 | F4 D4 | C4:2', accords: 'C C G C C C G C' },
    w: { titre: 'Valse de la gamme', titreEn: 'Scale Waltz', bars: 'C4 E4 G4 | G4:2 E4 | F4 A4 C5 | C5:2 G4 | A4 G4 F4 | E4 F4 E4 | D4 E4 D4 | C4:3', accords: 'C C F C F C G C' } },
  { jour: 9, fr: 'Croches : deux coups d’archet par temps.', en: 'Eighth notes: two bows per beat.',
    ts: { titre: 'Croches en route', titreEn: 'Eighths on the Road', bars: 'C4:.5 C4:.5 E4:.5 E4:.5 | G4:.5 G4:.5 E4 | F4:.5 F4:.5 A4:.5 A4:.5 | G4:2 | E4:.5 E4:.5 G4:.5 G4:.5 | C5:.5 C5:.5 G4 | F4:.5 D4:.5 E4:.5 D4:.5 | C4:2', accords: 'C C F G C C G C' },
    w: { titre: 'Valse des croches', titreEn: 'Eighth-Note Waltz', bars: 'E4:.5 E4:.5 G4 G4 | A4:.5 A4:.5 G4 E4 | F4:.5 F4:.5 A4 F4 | G4:2 D4 | E4:.5 E4:.5 G4 C5 | B4:.5 B4:.5 A4 G4 | F4:.5 E4:.5 D4 G4 | C4:3', accords: 'C C F G C G G C' } },
  { jour: 10, fr: 'Notes des accords : Do-Mi-Sol, Fa-La-Do, Sol-Si-Ré.', en: 'Chord tones: C-E-G, F-A-C, G-B-D.',
    ts: { titre: 'Arpèges en two-step', titreEn: 'Arpeggio Two-Step', bars: 'C4 E4 | G4 E4 | C4 F4 | A4 F4 | C4 G4 | B4 G4 | E4 G4 | C4:2', accords: 'C C F F C G C C' },
    w: { titre: 'Valse des accords', titreEn: 'Chord Waltz', bars: 'C4 E4 G4 | E4 C4 E4 | F4 A4 C5 | A4 F4 A4 | G4 B4 D5 | B4 G4 B4 | E4 G4 E4 | C4:3', accords: 'C C F F G G C C' } },
  { jour: 11, fr: 'Vers le grave : Sol3, La3, Si3 sur la corde de Fa.', en: 'Reaching down: G3, A3, B3 on the F string.',
    ts: { titre: 'Basses profondes', titreEn: 'Deep Notes', bars: 'G3 A3 | B3 C4 | D4 C4 | B3 A3 | G3 B3 | C4 E4 | D4 B3 | C4:2', accords: 'C C G G G C G C' },
    w: { titre: 'Valse du bas', titreEn: 'Low Waltz', bars: 'G3 A3 B3 | C4 B3 A3 | G3 B3 D4 | C4:2 B3 | A3 B3 C4 | D4 E4 D4 | C4 B3 A3 | C4:3', accords: 'C C G C C G G C' } },
  { jour: 12, fr: 'Toute l’étendue en première position : Sol3 à Sol5.', en: 'The full first-position range: G3 to G5.',
    ts: { titre: 'Toute l’étendue', titreEn: 'The Full Range', bars: 'G3 C4 | E4 G4 | C5 E5 | G5 E5 | D5 B4 | G4 E4 | D4 G3 | C4:2', accords: 'C C C C G C G C' },
    w: { titre: 'Valse haute et basse', titreEn: 'High and Low Waltz', bars: 'C4 G4 C5 | E5:2 D5 | C5 G4 E4 | D4:3 | C4 E4 G4 | C5 D5 E5 | G5 E5 C5 | C4:3', accords: 'C C C G C C G C' } },
  { jour: 13, fr: 'Groupes de trois notes : sens le balancement de la valse.', en: 'Groups of three notes: feel the sway of the waltz.',
    ts: { titre: 'Petits pas', titreEn: 'Small Steps', bars: 'C4 D4 | E4 D4 | C4 D4 | E4:2 | G4 F4 | E4 D4 | C4 E4 | C4:2', accords: 'C C C C G G C C' },
    w: { titre: 'Trois par trois', titreEn: 'Three by Three', bars: 'C4 D4 E4 | D4 E4 F4 | E4 F4 G4 | F4 G4 A4 | G4 F4 E4 | F4 E4 D4 | E4 D4 C4 | C4:3', accords: 'C C C F G G C C' } },
  { jour: 15, fr: 'Do majeur : pas conjoints, notes répétées et croches.', en: 'C major: stepwise motion, repeated notes and eighths.',
    ts: { titre: 'Pas à pas', titreEn: 'Step by Step', bars: 'E4 E4 | F4 G4 | A4:.5 G4:.5 F4 | E4 D4 | E4 E4 | F4 G4 | A4 G4 | C4:2', accords: 'C C F G C C G C' },
    w: { titre: 'Valse des pas conjoints', titreEn: 'Stepwise Waltz', bars: 'E4 G4 A4 | G4:2 E4 | F4 A4 G4 | E4 D4 C4 | E4 G4 A4 | C5:2 A4 | G4 F4 D4 | C4:3', accords: 'C C F C C F G C' } },
  { jour: 16, fr: 'Do majeur : sauts de tierce.', en: 'C major: leaps of a third.',
    ts: { titre: 'Tierces à la file', titreEn: 'Thirds in a Row', bars: 'C4 E4 | D4 F4 | E4 G4 | F4 A4 | G4 E4 | F4 D4 | E4 C4 | C4:2', accords: 'C C C F C G C C' },
    w: { titre: 'Valse des tierces', titreEn: 'Waltz of Thirds', bars: 'C4 E4 C4 | D4 F4 D4 | E4 G4 E4 | F4 A4 F4 | G4 B4 G4 | A4 C5 A4 | G4 E4 D4 | C4:3', accords: 'C C C F G F G C' } },
  { jour: 17, fr: 'Triade de Do : Do-Mi-Sol.', en: 'C triad: C-E-G.',
    ts: { titre: 'Triade de Do en two-step', titreEn: 'C Triad Two-Step', bars: 'C4 E4 | G4 E4 | C4 G4 | E4 C4 | E4 G4 | C5 G4 | E4 G4 | C4:2', accords: 'C C C C C C G C' },
    w: { titre: 'Valse de la triade de Do', titreEn: 'C Triad Waltz', bars: 'C4 E4 G4 | C5:2 G4 | E4 C4 E4 | G4:2 E4 | C4 E4 G4 | G4 C5 E5 | G4 E4 C4 | C4:3', accords: 'C C C C C C G C' } },
  { jour: 18, fr: 'Triade de Fa : Fa-La-Do.', en: 'F triad: F-A-C.',
    ts: { titre: 'Triade de Fa en two-step', titreEn: 'F Triad Two-Step', bars: 'F4 A4 | C5 A4 | F4 C5 | A4 F4 | C4 F4 | A4 F4 | C4 G4 | C4:2', accords: 'F F F F F F G C' },
    w: { titre: 'Valse de la triade de Fa', titreEn: 'F Triad Waltz', bars: 'F4 A4 C5 | A4:2 F4 | C4 F4 A4 | C5:2 A4 | F4 E4 D4 | C4 F4 A4 | G4 E4 D4 | C4:3', accords: 'F F F F C F G C' } },
  { jour: 19, fr: 'Triade de Sol : Sol-Si-Ré.', en: 'G triad: G-B-D.',
    ts: { titre: 'Triade de Sol en two-step', titreEn: 'G Triad Two-Step', bars: 'G4 B4 | D5 B4 | G4 D5 | B4 G4 | D4 G4 | B4 G4 | D4 G4 | C4:2', accords: 'G G G G G G G C' },
    w: { titre: 'Valse de la triade de Sol', titreEn: 'G Triad Waltz', bars: 'G4 B4 D5 | B4:2 G4 | D4 G4 B4 | D5:2 B4 | G4 B4 D5 | C5 B4 A4 | G4 F4 D4 | C4:3', accords: 'G G G G G G G C' } },
  { jour: 20, fr: 'Les trois triades : 1, 4, 5 en Do.', en: 'The three triads: 1, 4, 5 in C.',
    ts: { titre: 'Les trois triades', titreEn: 'The Three Triads', bars: 'C4 E4 | G4 E4 | F4 A4 | C5 A4 | G4 B4 | D5 B4 | C5 G4 | C4:2', accords: 'C C F F G G C C' },
    w: { titre: 'Valse des trois triades', titreEn: 'Waltz of the Three Triads', bars: 'C4 E4 G4 | E4 C4 E4 | F4 A4 C5 | A4 F4 A4 | G4 B4 D5 | B4 G4 B4 | E4 D4 C4 | C4:3', accords: 'C C F F G G C C' } },
  { jour: 21, fr: 'Révision : gamme de Do, chansons et triades.', en: 'Review: the C scale, songs and triads.',
    ts: { titre: 'Two-step de la troisième semaine', titreEn: 'Week-Three Two-Step', bars: 'C4 D4 | E4 G4 | F4 A4 | G4 E4 | C5 B4 | A4 G4 | F4 D4 | C4:2', accords: 'C C F C C G G C' },
    w: { titre: 'Valse de la troisième semaine', titreEn: 'Week-Three Waltz', bars: 'E4 G4 C5 | B4 A4 G4 | F4 A4 C5 | A4 G4 F4 | E4 G4 E4 | D4 F4 D4 | G4 B4 D5 | C5:3', accords: 'C C F F C G G C' } },
]

function make(l: Lesson, kind: 'ts' | 'w'): Song {
  const sp = (kind === 'ts' ? l.ts : l.w)!
  const two = kind === 'ts'
  return {
    jour: l.jour, id: `j${l.jour}-${two ? 'two-step' : 'valse'}`,
    titre: sp.titre, titreEn: sp.titreEn, mesure: two ? 2 : 3, tempo: two ? Math.min(60 + l.jour * 2, 80) : Math.min(80 + l.jour * 2, 100),
    description: `Leçon ${l.jour} : ${l.fr}`, descriptionEn: `Lesson ${l.jour}: ${l.en}`,
    cle: l.cle ?? 'C', accords: sp.accords.split(' ') as Accord[], melodie: parseMelody(sp.bars),
  }
}

export const LESSON_SONGS: Song[] = [...L, ...L2].flatMap((l) => [l.ts && make(l, 'ts'), l.w && make(l, 'w')].filter((x): x is Song => !!x))

// Hauteurs permises par leçon (pour les tests) : ce que l'élève sait déjà jouer ce jour-là.
const OPEN = [53, 60, 67, 74]
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
const C_MAJ = [0, 2, 4, 5, 7, 9, 11]
const scale = (a: number, b: number) => range(a, b).filter((m) => C_MAJ.includes(m % 12))
export const ALLOWED: Record<number, number[]> = {
  1: OPEN, 2: [60, 67], 3: [60, 62, 64, 65], 4: scale(60, 72), 5: [67, 69, 71], 6: scale(60, 72), 7: [...scale(60, 72), ...OPEN],
  8: scale(60, 72), 9: scale(60, 72), 10: [...scale(60, 72), 74], 11: scale(55, 72), 12: scale(55, 79), 13: scale(60, 72),
  15: scale(55, 79), 16: scale(55, 79), 17: scale(55, 79), 18: scale(55, 79), 19: scale(55, 79), 20: scale(55, 79), 21: scale(55, 79),
}
