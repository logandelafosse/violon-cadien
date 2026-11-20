// Boîte à outils des jours 22 à 84 : gabarits par type de jour (gamme, chansons, triades, doublings, seconding, oreille…).
// Chaque jour garde le même déroulement ; seuls les textes propres au jour changent.
import type { Day, Step } from './types'
import type { DayEn } from './days.en'
import type { KeyName } from '../theory/fiddle'
import type { Accord } from './songs'
import { build, tuneFr, tuneEn, type Spec } from './songDays'
import { OUTLINE } from './curriculum'
import { DOUBLING, CHORD_KEY } from './seconding'

export const ROOT: Record<string, number> = { C: 60, G: 67, F: 53 }
export type T = [string, string] // [français, anglais]
export type S = { t: T; x: T; min: number; extra?: Partial<Step> }

export function mk(jour: number, obj: T, steps: S[], ecoute: T[], autoeval: T[]): [Day, DayEn] {
  const o = OUTLINE.find((x) => x.jour === jour)!
  const all: S[] = [{ t: ['Accordage', 'Tuning'], x: [tuneFr, tuneEn], min: 2, extra: { cordes: true } }, ...steps]
  const day: Day = {
    jour, semaine: Math.ceil(jour / 7), type: jour % 7 === 0 ? 'revue' : 'pratiquer', titre: o.titre, objectif: obj[0],
    minutes: all.reduce((a, s) => a + s.min, 0),
    etapes: all.map((s) => ({ titre: s.t[0], texte: s.x[0], minutes: s.min, ...s.extra })),
    ecoute: ecoute.map((e) => e[0]), autoeval: autoeval.map((e) => e[0]),
  }
  const en: DayEn = { titre: o.titreEn, objectif: obj[1], etapes: all.map((s) => ({ titre: s.t[1], texte: s.x[1] })), ecoute: ecoute.map((e) => e[1]), autoeval: autoeval.map((e) => e[1]) }
  return [day, en]
}

// ---------- gamme ----------
export function scaleDay(jour: number, cle: KeyName, de: number, a: number, tempo: number, fr: T, type: 'majeure' | 'pentatonique' = 'majeure'): [Day, DayEn] {
  const g = { cle, de, a, type }
  return mk(jour, [`Jouer la gamme ${type === 'majeure' ? 'majeure' : 'pentatonique'} de façon juste et régulière.`, `Play the ${type === 'majeure' ? 'major' : 'pentatonic'} scale in tune and evenly.`], [
    { t: ['La forme de la main', 'The hand shape'], x: fr, min: 6, extra: { gamme: g, bourdon: [ROOT[cle]] } },
    { t: ['Lentement avec le bourdon', 'Slowly with the drone'], x: [`Une note par coup d’archet, à ${tempo}. Écoute chaque note contre le bourdon : elle doit sonner calme, sans battement.`, `One note per bow, at ${tempo}. Listen to each note against the drone: it should sound calm, without beating.`], min: 8, extra: { gamme: g, bourdon: [ROOT[cle]], metro: { bpm: tempo, mesure: 2 } } },
    { t: ['Deux coups par note', 'Two bows per note'], x: [`Joue chaque note deux fois (bas–haut), comme au two-step, à ${tempo + 10}.`, `Play each note twice (down–up), like the two-step, at ${tempo + 10}.`], min: 6, extra: { metro: { bpm: tempo + 10, mesure: 2 } } },
    { t: ['Groupes de trois', 'Groups of three'], x: ['Joue la gamme par groupes de trois notes, accent sur la première : le balancement de la valse.', 'Play the scale in groups of three notes, accent on the first: the sway of the waltz.'], min: 4, extra: { metro: { bpm: tempo + 20, mesure: 3 } } },
  ], [['Chaque note est calme contre le bourdon.', 'Each note is calm against the drone.']], [['Je joue la gamme sans regarder.', 'I play the scale without looking.']])
}

// ---------- doublings ----------
export const NAMES: Record<Accord, [string, string]> = { C: ['Do', 'C'], F: ['Fa', 'F'], G: ['Sol', 'G'], D: ['Ré', 'D'], Bb: ['Si♭', 'B♭'] }
const PAIR: Record<Accord, [string, string]> = { C: ['Do + Mi', 'C + E'], G: ['Sol + Si', 'G + B'], F: ['La + Do', 'A + C'], Bb: ['Si♭ + Ré', 'B♭ + D'], D: ['Ré + La', 'D + A'] }
export function dblStep(a: Accord, fr: string, en: string, min = 4): S {
  return {
    t: [`Le doubling de ${NAMES[a][0]}`, `The ${NAMES[a][1]} doubling`], x: [fr, en], min,
    extra: { notes: { cle: CHORD_KEY[a], notes: [...DOUBLING[a]], titre: `${NAMES[a][0]} : ${PAIR[a][0]}`, titreEn: `${NAMES[a][1]}: ${PAIR[a][1]}`, ensemble: true } },
  }
}

const STY: Record<string, [string, string, string, string]> = {
  droite: ['basse droite', 'straight bassing', 'Un coup d’archet par temps sur le doubling, le temps 1 un peu plus fort.', 'One bow stroke per beat on the doubling, beat 1 a little stronger.'],
  rythme: ['archet rythmique', 'rhythm bow', 'Bas–haut en croches sur le doubling, comme on gratte une guitare ; garde le poignet souple.', 'Down–up in eighth notes on the doubling, like strumming a guitar; keep the wrist loose.'],
  shuffle: ['archet shuffle', 'shuffle bow', 'Un long coup qui roule des cordes graves vers les aiguës, puis deux petits coups sciés sur les cordes aiguës ; le long coup suivant va dans l’autre sens.', 'One long stroke rolling from the low strings to the high ones, then two small sawing strokes on the high strings; the next long stroke goes the other way.'],
}
export function secondDay(jour: number, mesure: 2 | 3, style: 'droite' | 'rythme' | 'shuffle', chords: Accord[], tempo: number, fr: T): [Day, DayEn] {
  const [nf, ne, df, de] = STY[style]
  const meter = mesure === 2 ? ['two-step', 'two-step'] : ['valse', 'waltz']
  return mk(jour, [`Seconder un ${meter[0]} en ${nf}.`, `Second a ${meter[1]} using ${ne}.`], [
    ...chords.map((a) => dblStep(a, `Place les deux notes à la fois, doigts bien d’aplomb. Joue-les ensemble, lentement.`, 'Place both notes at once, fingers square. Play them together, slowly.', 3)),
    { t: [`Le geste : ${nf}`, `The stroke: ${ne}`], x: [`${df} ${fr[0]}`, `${de} ${fr[1]}`], min: 8, extra: { metro: { bpm: tempo, mesure } } },
    { t: ['Avec la chanson', 'With the song'], x: [`Ouvre « Pratique avec une chanson ». Coupe la mélodie pour entendre l’accordéon, ou garde-la pour suivre le lead. Mets le menu « Segondeur » sur « ${nf} » pour entendre l’exemple, puis joue-le toi-même par-dessus.`, `Open “Practice with a song”. Mute the melody to hear the accordion, or keep it to follow the lead. Set the “Segondeur” menu to “${ne}” to hear the example, then play it yourself over it.`], min: 8 },
  ], [['Les changements d’accord tombent sur la mesure.', 'The chord changes land on the bar.']], [[`Je peux seconder une chanson de huit mesures en ${nf}.`, `I can second an eight-bar song using ${ne}.`]])
}

export const keyDrone = (c: KeyName): number[] => [ROOT[c]]
export const warmScale = (cle: KeyName, de: number, a: number, fr: string, en: string): Spec['warm'] => ({ titre: 'Gamme', titreEn: 'Scale', texte: fr, texteEn: en, step: { gamme: { cle, de, a }, bourdon: keyDrone(cle) } })
export const warmNotes = (cle: KeyName, notes: number[], titre: string, titreEn: string, fr: string, en: string, bourdon: number): Spec['warm'] => ({ titre: 'Triades', titreEn: 'Triads', texte: fr, texteEn: en, step: { notes: { cle, notes, titre, titreEn }, bourdon: [bourdon] } })
export const mkSong = (jour: number, cle: KeyName, obj: T, warm: Spec['warm'], focus: T, ec: T, ae: T): Spec => ({
  jour, cle, titre: OUTLINE.find((o) => o.jour === jour)!.titre, titreEn: OUTLINE.find((o) => o.jour === jour)!.titreEn, minutes: 25,
  objectif: obj[0], objectifEn: obj[1], warm, focusFr: focus[0], focusEn: focus[1], ecoute: [ec], autoeval: [ae],
})
