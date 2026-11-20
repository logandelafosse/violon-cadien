// Jours de chansons et de triades (semaine 3), générés à partir d'un petit gabarit pour garder le même déroulement chaque jour.
import type { Day, Step } from './types'
import type { DayEn } from './days.en'

const tuneFr = 'Accorde le violon : Fa – Do – Sol – Ré (de la corde grave à la corde aiguë). Appuie sur le bouton pour entendre chaque corde, puis tire doucement sur la corde jusqu’à ce que les deux sons ne « battent » plus.'
const tuneEn = 'Tune the fiddle: F – C – G – D (from the lowest string to the highest). Press the button to hear each string, then gently adjust until the two sounds stop "beating".'
const C = 60

interface Spec {
  jour: number; titre: string; titreEn: string; objectif: string; objectifEn: string; minutes: number
  warm: { titre: string; titreEn: string; texte: string; texteEn: string; step: Partial<Step> }
  focusFr: string; focusEn: string
  ecoute: [string, string][]; autoeval: [string, string][]
}

function build(sp: Spec): [Day, DayEn] {
  const base = (titre: string, texte: string, extra: Partial<Step> = {}): Step => ({ titre, texte, minutes: 0, ...extra })
  const steps: Step[] = [
    { ...base('Accordage', tuneFr, { cordes: true }), minutes: 2 },
    { ...base(sp.warm.titre, sp.warm.texte, sp.warm.step), minutes: 5 },
    { ...base('Le two-step du jour', `Ouvre « Pratique avec une chanson » : choisis le two-step. ${sp.focusFr} Apprends la mesure 1 à 4, puis 5 à 8, très lentement (60), avec la mélodie qui joue.`, { metro: { bpm: 60, mesure: 2 } }), minutes: 7 },
    { ...base('La valse du jour', `Même travail avec la valse : une mesure à la fois, le temps 1 plus lourd. ${sp.focusFr}`, { metro: { bpm: 80, mesure: 3 } }), minutes: 7 },
    { ...base('Joue avec l’accordéon', 'Coupe la mélodie et garde l’accompagnement : joue la chanson toi-même par-dessus, deux fois de suite, sans t’arrêter. Si tu te perds, rattrape-toi à la prochaine mesure.'), minutes: 4 },
  ]
  const stepsEn: { titre: string; texte: string }[] = [
    { titre: 'Tuning', texte: tuneEn },
    { titre: sp.warm.titreEn, texte: sp.warm.texteEn },
    { titre: 'Today’s two-step', texte: `Open “Practice with a song” and choose the two-step. ${sp.focusEn} Learn bars 1–4, then 5–8, very slowly (60), with the melody playing.` },
    { titre: 'Today’s waltz', texte: `Same work with the waltz: one bar at a time, beat 1 heavier. ${sp.focusEn}` },
    { titre: 'Play with the accordion', texte: 'Mute the melody and keep the backing: play the song yourself over it, twice in a row without stopping. If you get lost, catch up at the next bar.' },
  ]
  const min = sp.minutes
  const day: Day = {
    jour: sp.jour, semaine: 3, type: sp.jour === 21 ? 'revue' : 'pratiquer', titre: sp.titre, objectif: sp.objectif, minutes: min, cle: 'C',
    etapes: steps, ecoute: sp.ecoute.map((e) => e[0]), autoeval: sp.autoeval.map((e) => e[0]),
  }
  const en: DayEn = { titre: sp.titreEn, objectif: sp.objectifEn, etapes: stepsEn, ecoute: sp.ecoute.map((e) => e[1]), autoeval: sp.autoeval.map((e) => e[1]) }
  return [day, en]
}

const specs: Spec[] = [
  { jour: 15, titre: 'Chansons en Do : pas conjoints', titreEn: 'Songs in C: stepwise', minutes: 25,
    objectif: 'Jouer deux chansons qui avancent note par note, avec des notes répétées et des croches.', objectifEn: 'Play two songs that move note by note, with repeated notes and eighths.',
    warm: { titre: 'Gamme de Do', titreEn: 'C scale', texte: 'Joue la gamme de Do, une octave, à 72, avec le bourdon.', texteEn: 'Play the C scale, one octave, at 72, with the drone.', step: { gamme: { cle: 'C', de: 60, a: 72 }, bourdon: [C], metro: { bpm: 72, mesure: 2 } } },
    focusFr: 'Écoute comme la mélodie avance par petits pas.', focusEn: 'Listen to how the melody moves in small steps.',
    ecoute: [['Les notes répétées sonnent toutes pareilles.', 'Repeated notes sound identical.']], autoeval: [['Je joue les deux chansons sans m’arrêter.', 'I play both songs without stopping.']] },
  { jour: 16, titre: 'Chansons en Do : sauts de tierce', titreEn: 'Songs in C: leaps of a third', minutes: 25,
    objectif: 'Jouer des chansons faites de sauts de tierce, en gardant la main sûre.', objectifEn: 'Play songs made of leaps of a third, keeping the hand steady.',
    warm: { titre: 'Tierces dans la gamme', titreEn: 'Thirds in the scale', texte: 'Joue la gamme de Do en tierces : Do-Mi, Ré-Fa, Mi-Sol, Fa-La… une note par coup d’archet.', texteEn: 'Play the C scale in thirds: C-E, D-F, E-G, F-A… one note per bow.', step: { gamme: { cle: 'C', de: 60, a: 72 }, bourdon: [C] } },
    focusFr: 'Prépare ton doigt avant de sauter.', focusEn: 'Prepare your finger before you leap.',
    ecoute: [['Chaque saut tombe juste, sans glisser.', 'Each leap lands cleanly, without sliding.']], autoeval: [['Mes sauts sont justes à vitesse lente.', 'My leaps are in tune at slow speed.']] },
  { jour: 17, titre: 'Triade de Do (Do-Mi-Sol)', titreEn: 'The C triad (C-E-G)', minutes: 25,
    objectif: 'Connaître la triade de Do et la jouer en arpège, puis dans deux chansons.', objectifEn: 'Know the C triad and play it as an arpeggio, then in two songs.',
    warm: { titre: 'Triade de Do', titreEn: 'The C triad', texte: 'Une triade, ce sont trois notes d’un accord : la première, la troisième et la cinquième de la gamme. En Do : Do, Mi, Sol. Joue-les en montant et en descendant, avec le bourdon de Do.', texteEn: 'A triad is three notes of a chord: the first, third and fifth of the scale. In C: C, E, G. Play them up and down with the C drone.', step: { notes: { cle: 'C', notes: [60, 64, 67, 72], titre: 'Do – Mi – Sol – Do' }, bourdon: [C] } },
    focusFr: 'Repère Do, Mi et Sol dans la mélodie.', focusEn: 'Spot C, E and G in the melody.',
    ecoute: [['Do-Mi-Sol sonnent bien ensemble, comme un accord.', 'C-E-G sound good together, like a chord.']], autoeval: [['Je joue la triade de Do sans regarder.', 'I play the C triad without looking.']] },
  { jour: 18, titre: 'Triade de Fa (Fa-La-Do)', titreEn: 'The F triad (F-A-C)', minutes: 25,
    objectif: 'Connaître la triade de Fa, le 4 de la tonalité de Do.', objectifEn: 'Know the F triad, the 4 chord of the key of C.',
    warm: { titre: 'Triade de Fa', titreEn: 'The F triad', texte: 'En Do, l’accord de Fa est le « 4 ». Sa triade : Fa, La, Do. Joue-la grave (corde de Fa) puis aiguë, avec le bourdon de Fa.', texteEn: 'In C, the F chord is the “4”. Its triad: F, A, C. Play it low (F string) then high, with an F drone.', step: { notes: { cle: 'C', notes: [53, 57, 60, 65, 69, 72], titre: 'Fa – La – Do' }, bourdon: [53] } },
    focusFr: 'Écoute le Fa comme un changement de couleur par rapport au Do.', focusEn: 'Hear F as a change of colour compared with C.',
    ecoute: [['La triade de Fa sonne « plus ouverte » que celle de Do.', 'The F triad sounds “more open” than the C triad.']], autoeval: [['Je joue la triade de Fa sans regarder.', 'I play the F triad without looking.']] },
  { jour: 19, titre: 'Triade de Sol (Sol-Si-Ré)', titreEn: 'The G triad (G-B-D)', minutes: 25,
    objectif: 'Connaître la triade de Sol, le 5 de la tonalité de Do.', objectifEn: 'Know the G triad, the 5 chord of the key of C.',
    warm: { titre: 'Triade de Sol', titreEn: 'The G triad', texte: 'En Do, l’accord de Sol est le « 5 ». Sa triade : Sol, Si, Ré. Joue-la grave puis aiguë, avec le bourdon de Sol.', texteEn: 'In C, the G chord is the “5”. Its triad: G, B, D. Play it low then high, with a G drone.', step: { notes: { cle: 'C', notes: [55, 59, 62, 67, 71, 74], titre: 'Sol – Si – Ré' }, bourdon: [55] } },
    focusFr: 'Entends comme le Sol « demande » de revenir au Do.', focusEn: 'Hear how G “asks” to return to C.',
    ecoute: [['Le Sol veut retomber sur le Do.', 'G wants to fall back to C.']], autoeval: [['Je joue la triade de Sol sans regarder.', 'I play the G triad without looking.']] },
  { jour: 20, titre: 'Les trois triades : 1, 4, 5', titreEn: 'The three triads: 1, 4, 5', minutes: 25,
    objectif: 'Enchaîner les triades de Do, Fa et Sol, comme les accords d’une chanson cadienne.', objectifEn: 'Chain the C, F and G triads, like the chords of a Cajun song.',
    warm: { titre: 'Do – Fa – Sol – Do', titreEn: 'C – F – G – C', texte: 'Joue une triade par mesure : Do, Fa, Sol, Do (le 1, le 4, le 5, puis retour au 1). Un coup d’archet par note.', texteEn: 'Play one triad per bar: C, F, G, C (the 1, the 4, the 5, then back to the 1). One bow per note.', step: { notes: { cle: 'C', notes: [60, 64, 67, 65, 69, 72, 67, 71, 74], titre: 'Do-Mi-Sol · Fa-La-Do · Sol-Si-Ré' }, metro: { bpm: 60, mesure: 3 } } },
    focusFr: 'Change de triade exactement sur la barre de mesure.', focusEn: 'Change triad exactly on the bar line.',
    ecoute: [['Chaque changement de triade tombe sur la mesure.', 'Each triad change lands on the bar.']], autoeval: [['Je change de triade sans m’arrêter.', 'I change triad without stopping.']] },
  { jour: 21, titre: 'Révision de la semaine 3', titreEn: 'Week 3 review', minutes: 25,
    objectif: 'Revoir la gamme de Do, les chansons de la semaine et les trois triades.', objectifEn: 'Review the C scale, the week’s songs and the three triads.',
    warm: { titre: 'Gamme et triades', titreEn: 'Scale and triads', texte: 'Joue la gamme de Do à 80, puis les trois triades, sans arrêt.', texteEn: 'Play the C scale at 80, then the three triads, without stopping.', step: { gamme: { cle: 'C', de: 60, a: 72 }, bourdon: [C], metro: { bpm: 80, mesure: 2 } } },
    focusFr: 'Choisis ta chanson préférée de la semaine.', focusEn: 'Pick your favourite song of the week.',
    ecoute: [['Ta justesse tient du début à la fin.', 'Your intonation holds from start to finish.']], autoeval: [['Je peux jouer au moins une chanson de la semaine sans la lire.', 'I can play at least one song from the week without reading it.']] },
]

const built = specs.map(build)
export const GEN_DAYS: Day[] = built.map((b) => b[0])
export const GEN_DAYS_EN: Record<number, DayEn> = Object.fromEntries(built.map((b) => [b[0].jour, b[1]]))
