// Jours 22 à 84 : gabarits par type de jour (gamme, chansons, triades, doublings, seconding, oreille…).
// Chaque jour garde le même déroulement ; seuls les textes propres au jour changent.
import type { Day, Step } from './types'
import type { DayEn } from './days.en'
import type { KeyName } from '../theory/fiddle'
import type { Accord } from './songs'
import { build, tuneFr, tuneEn, type Spec } from './songDays'
import { OUTLINE } from './curriculum'
import { DOUBLING, CHORD_KEY } from './seconding'

const ROOT: Record<string, number> = { C: 60, G: 67, F: 53 }
type T = [string, string] // [français, anglais]
type S = { t: T; x: T; min: number; extra?: Partial<Step> }

function mk(jour: number, obj: T, steps: S[], ecoute: T[], autoeval: T[]): [Day, DayEn] {
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
function scaleDay(jour: number, cle: KeyName, de: number, a: number, tempo: number, fr: T, type: 'majeure' | 'pentatonique' = 'majeure'): [Day, DayEn] {
  const g = { cle, de, a, type }
  return mk(jour, [`Jouer la gamme ${type === 'majeure' ? 'majeure' : 'pentatonique'} de façon juste et régulière.`, `Play the ${type === 'majeure' ? 'major' : 'pentatonic'} scale in tune and evenly.`], [
    { t: ['La forme de la main', 'The hand shape'], x: fr, min: 6, extra: { gamme: g, bourdon: [ROOT[cle]] } },
    { t: ['Lentement avec le bourdon', 'Slowly with the drone'], x: [`Une note par coup d’archet, à ${tempo}. Écoute chaque note contre le bourdon : elle doit sonner calme, sans battement.`, `One note per bow, at ${tempo}. Listen to each note against the drone: it should sound calm, without beating.`], min: 8, extra: { gamme: g, bourdon: [ROOT[cle]], metro: { bpm: tempo, mesure: 2 } } },
    { t: ['Deux coups par note', 'Two bows per note'], x: [`Joue chaque note deux fois (bas–haut), comme au two-step, à ${tempo + 10}.`, `Play each note twice (down–up), like the two-step, at ${tempo + 10}.`], min: 6, extra: { metro: { bpm: tempo + 10, mesure: 2 } } },
    { t: ['Groupes de trois', 'Groups of three'], x: ['Joue la gamme par groupes de trois notes, accent sur la première : le balancement de la valse.', 'Play the scale in groups of three notes, accent on the first: the sway of the waltz.'], min: 4, extra: { metro: { bpm: tempo + 20, mesure: 3 } } },
  ], [['Chaque note est calme contre le bourdon.', 'Each note is calm against the drone.']], [['Je joue la gamme sans regarder.', 'I play the scale without looking.']])
}

// ---------- doublings ----------
const NAMES: Record<Accord, [string, string]> = { C: ['Do', 'C'], F: ['Fa', 'F'], G: ['Sol', 'G'], D: ['Ré', 'D'], Bb: ['Si♭', 'B♭'] }
const PAIR: Record<Accord, [string, string]> = { C: ['Do + Mi', 'C + E'], G: ['Sol + Si', 'G + B'], F: ['La + Do', 'A + C'], Bb: ['Si♭ + Ré', 'B♭ + D'], D: ['Ré + La', 'D + A'] }
function dblStep(a: Accord, fr: string, en: string, min = 4): S {
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
function secondDay(jour: number, mesure: 2 | 3, style: 'droite' | 'rythme' | 'shuffle', chords: Accord[], tempo: number, fr: T): [Day, DayEn] {
  const [nf, ne, df, de] = STY[style]
  const meter = mesure === 2 ? ['two-step', 'two-step'] : ['valse', 'waltz']
  return mk(jour, [`Seconder un ${meter[0]} en ${nf}.`, `Second a ${meter[1]} using ${ne}.`], [
    ...chords.map((a) => dblStep(a, `Place les deux notes à la fois, doigts bien d’aplomb. Joue-les ensemble, lentement.`, 'Place both notes at once, fingers square. Play them together, slowly.', 3)),
    { t: [`Le geste : ${nf}`, `The stroke: ${ne}`], x: [`${df} ${fr[0]}`, `${de} ${fr[1]}`], min: 8, extra: { metro: { bpm: tempo, mesure } } },
    { t: ['Avec la chanson', 'With the song'], x: [`Ouvre « Pratique avec une chanson ». Coupe la mélodie pour entendre l’accordéon, ou garde-la pour suivre le lead. Mets le menu « Segondeur » sur « ${nf} » pour entendre l’exemple, puis joue-le toi-même par-dessus.`, `Open “Practice with a song”. Mute the melody to hear the accordion, or keep it to follow the lead. Set the “Segondeur” menu to “${ne}” to hear the example, then play it yourself over it.`], min: 8 },
  ], [['Les changements d’accord tombent sur la mesure.', 'The chord changes land on the bar.']], [[`Je peux seconder une chanson de huit mesures en ${nf}.`, `I can second an eight-bar song using ${ne}.`]])
}

// ---------- jours ----------
const out: [Day, DayEn][] = []
const song = (sp: Spec) => out.push(build(sp))
const keyDrone = (c: KeyName): number[] => [ROOT[c]]
const warmScale = (cle: KeyName, de: number, a: number, fr: string, en: string): Spec['warm'] => ({ titre: 'Gamme', titreEn: 'Scale', texte: fr, texteEn: en, step: { gamme: { cle, de, a }, bourdon: keyDrone(cle) } })
const warmNotes = (cle: KeyName, notes: number[], titre: string, titreEn: string, fr: string, en: string, bourdon: number): Spec['warm'] => ({ titre: 'Triades', titreEn: 'Triads', texte: fr, texteEn: en, step: { notes: { cle, notes, titre, titreEn }, bourdon: [bourdon] } })
const mkSong = (jour: number, cle: KeyName, obj: T, warm: Spec['warm'], focus: T, ec: T, ae: T): Spec => ({
  jour, cle, titre: OUTLINE.find((o) => o.jour === jour)!.titre, titreEn: OUTLINE.find((o) => o.jour === jour)!.titreEn, minutes: 25,
  objectif: obj[0], objectifEn: obj[1], warm, focusFr: focus[0], focusEn: focus[1], ecoute: [ec], autoeval: [ae],
})

// Semaine 4 : Sol
out.push(scaleDay(22, 'G', 67, 79, 60, ['Sol majeur a la même forme de main que Do, mais sur les cordes de Sol et de Ré : Sol, La, Si (doigt 2 haut), Do, puis Ré à vide, Mi, Fa♯ (doigt 2 haut), Sol. Le Fa♯ remplace le Fa de la gamme de Do.', 'G major has the same hand shape as C, but on the G and D strings: G, A, B (high 2), C, then open D, E, F♯ (high 2), G. The F♯ replaces the F of the C scale.']))
out.push(scaleDay(23, 'G', 55, 67, 56, ['Vers le grave : Sol3 est le doigt 1 sur la corde de Fa, puis La3, Si3 (doigt 3), Do4 à vide, Ré4, Mi4, Fa♯4 (doigt 3), Sol4 à vide. Le doigt 3 haut de Si3 et de Fa♯4 est la nouveauté du jour.', 'Reaching down: G3 is finger 1 on the F string, then A3, B3 (finger 3), open C4, D4, E4, F♯4 (finger 3), open G4. The high 3rd finger on B3 and F♯4 is today’s new thing.']))
out.push(scaleDay(24, 'G', 55, 79, 60, ['Les deux octaves de Sol, de Sol3 à Sol5 : trois cordes de plus que d’habitude. Va lentement et repère les cordes à vide (Do, Sol, Ré) comme des balises.', 'Both octaves of G, from G3 to G5. Go slowly and use the open strings (C, G, D) as landmarks.']))
song(mkSong(25, 'G', ['Jouer deux chansons en Sol qui avancent note par note.', 'Play two songs in G that move note by note.'], warmScale('G', 67, 79, 'Joue la gamme de Sol, une octave, à 72, avec le bourdon de Sol.', 'Play the G scale, one octave, at 72, with the G drone.'), ['Garde le Fa♯ juste quand il revient.', 'Keep the F♯ in tune when it comes back.'], ['Le Fa♯ sonne « tendu » vers le Sol.', 'The F♯ sounds “tense” towards the G.'], ['Je joue les deux chansons en Sol sans m’arrêter.', 'I play both songs in G without stopping.']))
song(mkSong(26, 'G', ['Jouer deux chansons en Sol faites de sauts de tierce.', 'Play two songs in G made of leaps of a third.'], warmScale('G', 67, 79, 'Joue la gamme de Sol en tierces : Sol-Si, La-Do, Si-Ré, Do-Mi…', 'Play the G scale in thirds: G-B, A-C, B-D, C-E…'), ['Prépare ton doigt avant chaque saut.', 'Prepare your finger before each leap.'], ['Chaque saut tombe juste.', 'Each leap lands in tune.'], ['Mes sauts de tierce sont justes à vitesse lente.', 'My leaps of a third are in tune at slow speed.']))
song(mkSong(27, 'G', ['Connaître les triades de Sol, Do et Ré.', 'Know the G, C and D triads.'], warmNotes('G', [55, 59, 62, 67, 71, 74], 'Sol – Si – Ré', 'G – B – D', 'En Sol, les accords sont Sol (1), Do (4) et Ré (5). Joue d’abord la triade de Sol : Sol, Si, Ré, grave puis aiguë. Puis celles de Do (Do-Mi-Sol) et de Ré (Ré-Fa♯-La).', 'In G the chords are G (1), C (4) and D (5). First play the G triad: G, B, D, low then high. Then C (C-E-G) and D (D-F♯-A).', 55), ['Change de triade pile sur la mesure.', 'Change triad exactly on the bar.'], ['Le Ré demande de revenir au Sol.', 'The D wants to return to G.'], ['Je joue les trois triades de Sol sans regarder.', 'I play the three G triads without looking.']))
song(mkSong(28, 'G', ['Revoir Do majeur, Sol majeur et leurs chansons.', 'Review C major, G major and their songs.'], warmScale('G', 55, 79, 'Joue la gamme de Do, puis celle de Sol, sans arrêt, à 80.', 'Play the C scale, then the G scale, without a break, at 80.'), ['Choisis ta chanson préférée de la semaine.', 'Pick your favourite song of the week.'], ['Tu entends la différence entre Fa et Fa♯.', 'You hear the difference between F and F♯.'], ['Je passe de Do à Sol sans erreur.', 'I move from C to G without a mistake.']))
// Semaine 5 : Fa
out.push(scaleDay(29, 'F', 53, 65, 56, ['Fa majeur sur les deux cordes graves : Fa à vide, Sol, La, Si♭ (doigt 3), puis Do à vide, Ré, Mi, Fa. Le Si♭ de la corde de Fa est la nouveauté : il est plus près du doigt 2 que le Si.', 'F major on the two low strings: open F, G, A, B♭ (finger 3), then open C, D, E, F. The B♭ on the F string is the new thing: it sits closer to finger 2 than a B would.']))
out.push(mk(30, ['Entendre et placer la différence entre Si♭ et Si.', 'Hear and place the difference between B♭ and B.'], [
  { t: ['Si♭ : gamme de Fa', 'B♭: the F scale'], x: ['Sur la corde de Sol : Sol, La, Si♭ (doigt 2 bas, collé au 1), Do. C’est le Si♭ de Fa majeur.', 'On the G string: G, A, B♭ (low 2, touching finger 1), C. This is the B♭ of F major.'], min: 7, extra: { gamme: { cle: 'F', de: 67, a: 72 }, bourdon: [53] } },
  { t: ['Si : gamme de Do', 'B: the C scale'], x: ['Même corde, même doigt, mais haut : Sol, La, Si (doigt 2 haut), Do. Alterne Si♭ et Si, trois fois chacun.', 'Same string, same finger, but high: G, A, B (high 2), C. Alternate B♭ and B, three times each.'], min: 7, extra: { gamme: { cle: 'C', de: 67, a: 72 }, bourdon: [60] } },
  { t: ['Passer de l’un à l’autre', 'Switching between them'], x: ['Joue une mesure de Fa, une mesure de Do : la seule note qui change est le Si♭ / Si.', 'Play one bar of F, one bar of C: the only note that changes is the B♭ / B.'], min: 6, extra: { metro: { bpm: 60, mesure: 2 } } },
], [['Si♭ sonne plus « triste » que Si.', 'B♭ sounds “sadder” than B.']], [['Je place Si♭ et Si sans regarder.', 'I place B♭ and B without looking.']]))
out.push(scaleDay(31, 'F', 53, 77, 60, ['Les deux octaves de Fa, de Fa3 à Fa5. Aux cordes aiguës, le doigt 2 est bas : Sol, La, Si♭ (collés) puis Ré, Mi, Fa (le Fa avec le doigt 2 bas).', 'Both octaves of F, from F3 to F5. On the upper strings finger 2 is low: G, A, B♭ (touching) then D, E, F (the F with a low 2nd finger).']))
song(mkSong(32, 'F', ['Jouer deux chansons en Fa qui avancent note par note.', 'Play two songs in F that move note by note.'], warmScale('F', 53, 65, 'Joue la gamme de Fa, une octave, à 72, avec le bourdon de Fa.', 'Play the F scale, one octave, at 72, with the F drone.'), ['Garde le Si♭ bas et juste.', 'Keep the B♭ low and in tune.'], ['Le Si♭ donne la couleur de Fa.', 'The B♭ gives F its colour.'], ['Je joue les deux chansons en Fa sans m’arrêter.', 'I play both songs in F without stopping.']))
song(mkSong(33, 'F', ['Jouer deux chansons en Fa faites de sauts de tierce.', 'Play two songs in F made of leaps of a third.'], warmScale('F', 53, 77, 'Joue la gamme de Fa en tierces : Fa-La, Sol-Si♭, La-Do, Si♭-Ré…', 'Play the F scale in thirds: F-A, G-B♭, A-C, B♭-D…'), ['Prépare ton doigt avant chaque saut.', 'Prepare your finger before each leap.'], ['Chaque saut tombe juste.', 'Each leap lands in tune.'], ['Mes sauts de tierce sont justes en Fa.', 'My leaps of a third are in tune in F.']))
song(mkSong(34, 'F', ['Connaître les triades de Fa, Si♭ et Do.', 'Know the F, B♭ and C triads.'], warmNotes('F', [53, 57, 60, 65, 69, 72], 'Fa – La – Do', 'F – A – C', 'En Fa, les accords sont Fa (1), Si♭ (4) et Do (5). Joue la triade de Fa : Fa, La, Do, grave puis aiguë. Puis Si♭-Ré-Fa et Do-Mi-Sol.', 'In F the chords are F (1), B♭ (4) and C (5). Play the F triad: F, A, C, low then high. Then B♭-D-F and C-E-G.', 53), ['Change de triade pile sur la mesure.', 'Change triad exactly on the bar.'], ['Le Do demande de revenir au Fa.', 'The C wants to return to F.'], ['Je joue les trois triades de Fa sans regarder.', 'I play the three F triads without looking.']))
song(mkSong(35, 'F', ['Revoir Do, Sol et Fa.', 'Review C, G and F.'], warmScale('F', 53, 77, 'Joue la gamme de Do, de Sol puis de Fa, sans arrêt, à 80.', 'Play the C, G and F scales one after another, without a break, at 80.'), ['Remarque ce qui change d’une gamme à l’autre : Fa♯, Si♭.', 'Notice what changes from one scale to the next: F♯, B♭.'], ['Tu entends la couleur de chaque tonalité.', 'You hear the colour of each key.'], ['Je passe de Do à Sol puis à Fa sans erreur.', 'I go from C to G to F without a mistake.']))
// Semaine 6 : pentatonique
out.push(scaleDay(36, 'C', 60, 72, 60, ['La pentatonique de Do garde cinq notes de la gamme majeure : Do, Ré, Mi, Sol, La. On saute le Fa et le Si, les deux notes qui « frottent » contre l’accord. C’est la gamme du blues et de beaucoup d’airs de violon.', 'The C pentatonic keeps five notes of the major scale: C, D, E, G, A. We skip the F and the B, the two notes that rub against the chord. It is the scale of the blues and of many fiddle tunes.'], 'pentatonique'))
out.push(scaleDay(37, 'G', 67, 79, 60, ['La pentatonique de Sol : Sol, La, Si, Ré, Mi. On saute le Do et le Fa♯. Même forme que Do, une corde plus haut.', 'The G pentatonic: G, A, B, D, E. We skip the C and the F♯. Same shape as C, one string higher.'], 'pentatonique'))
out.push(scaleDay(38, 'F', 65, 74, 60, ['La pentatonique de Fa : Fa, Sol, La, Do, Ré. On saute le Si♭ et le Mi : pas de doigt 2 bas à surveiller.', 'The F pentatonic: F, G, A, C, D. We skip the B♭ and the E: no low 2nd finger to worry about.'], 'pentatonique'))
song(mkSong(39, 'C', ['Jouer deux chansons pentatoniques en Do.', 'Play two pentatonic songs in C.'], { titre: 'Pentatonique de Do', titreEn: 'C pentatonic', texte: 'Joue la pentatonique de Do, une octave, à 72, avec le bourdon de Do.', texteEn: 'Play the C pentatonic, one octave, at 72, with the C drone.', step: { gamme: { cle: 'C', de: 60, a: 72, type: 'pentatonique' }, bourdon: [60] } }, ['Ces chansons n’utilisent que cinq notes : fais-les sonner.', 'These songs use only five notes: make them sing.'], ['Aucune note ne « frotte » contre l’accord.', 'No note rubs against the chord.'], ['Je joue les deux chansons sans erreur.', 'I play both songs without a mistake.']))
song(mkSong(40, 'G', ['Jouer deux chansons pentatoniques en Sol.', 'Play two pentatonic songs in G.'], { titre: 'Pentatonique de Sol', titreEn: 'G pentatonic', texte: 'Joue la pentatonique de Sol, une octave, à 72, avec le bourdon de Sol.', texteEn: 'Play the G pentatonic, one octave, at 72, with the G drone.', step: { gamme: { cle: 'G', de: 67, a: 79, type: 'pentatonique' }, bourdon: [67] } }, ['Joue la valse en faisant balancer le temps 1.', 'Play the waltz with a sway on beat 1.'], ['La mélodie flotte au-dessus de l’accord.', 'The melody floats above the chord.'], ['Je joue la valse en Sol sans m’arrêter.', 'I play the waltz in G without stopping.']))
song(mkSong(41, 'C', ['Répondre à une phrase par une autre phrase, sur trois notes.', 'Answer one phrase with another, on three notes.'], warmNotes('C', [60, 64, 67], 'Do – Mi – Sol', 'C – E – G', 'Trois notes seulement : Do, Mi, Sol. Joue une phrase de deux mesures, puis invente une réponse de deux mesures avec les mêmes trois notes.', 'Just three notes: C, E, G. Play a two-bar phrase, then invent a two-bar answer using the same three notes.', 60), ['Fais comme une conversation : une question, une réponse.', 'Make it a conversation: a question, an answer.'], ['Ta réponse tombe sur la mesure.', 'Your answer lands on the bar.'], ['J’ai inventé trois réponses différentes.', 'I invented three different answers.']))
song(mkSong(42, 'C', ['Revoir les gammes, les triades et les pentatoniques.', 'Review the scales, triads and pentatonics.'], warmScale('C', 60, 72, 'Joue la gamme de Do, puis sa pentatonique, puis sa triade, sans arrêt.', 'Play the C scale, then its pentatonic, then its triad, without a break.'), ['Entends ce que la pentatonique enlève à la gamme.', 'Hear what the pentatonic takes away from the scale.'], ['Tu choisis la bonne forme de main sans réfléchir.', 'You choose the right hand shape without thinking.'], ['Je connais la différence entre gamme, triade et pentatonique.', 'I know the difference between scale, triad and pentatonic.']))

// Semaine 7 : doubler les cordes
out.push(mk(43, ['Trouver des unissons et des octaves sur le violon accordé un ton plus bas.', 'Find unisons and octaves on the retuned fiddle.'], [
  { t: ['Les octaves', 'Octaves'], x: ['Deux notes du même nom sur deux cordes : le Do à vide (corde de Do) et le Do de la corde de Sol (doigt 3), une octave plus haut. Joue-les ensemble.', 'Two notes with the same name on two strings: the open C (C string) and the C on the G string (finger 3), an octave higher. Play them together.'], min: 6, extra: { notes: { cle: 'C', notes: [60, 72], titre: 'Octave de Do', titreEn: 'C octave', ensemble: true } } },
  { t: ['Les unissons', 'Unisons'], x: ['Le Sol de la corde de Do (doigt 4) sonne comme le Sol à vide : un unisson. Joue les deux ensemble et ajuste jusqu’à ce que le son soit un seul son.', 'The G on the C string (finger 4) sounds like the open G: a unison. Play both together and adjust until they sound like one sound.'], min: 6, extra: { notes: { cle: 'C', notes: [67], titre: 'Sol : corde à vide = doigt 4 de la corde de Do', titreEn: 'G: open string = finger 4 on the C string' } } },
  { t: ['Écoute le battement', 'Listen for the beating'], x: ['Quand deux notes sont presque pareilles, tu entends un battement. Joue l’unisson avec le doigt un peu trop bas, puis un peu trop haut, puis juste : le battement disparaît.', 'When two notes are nearly the same you hear a beating. Play the unison with your finger slightly flat, then slightly sharp, then right: the beating disappears.'], min: 6 },
], [['Le battement ralentit puis disparaît quand tu es juste.', 'The beating slows and disappears as you come into tune.']], [['J’entends quand deux notes sont pareilles.', 'I can hear when two notes are the same.']]))
out.push(mk(44, ['Jouer le doubling de Do : Do + Mi.', 'Play the C doubling: C + E.'], [
  dblStep('C', 'Le livret appelle ça « doubler les cordes » : le Do de la corde de Fa (doigt 4, comme un Do à vide) avec le Mi de la corde de Do (doigt 2). Pose les deux doigts en même temps.', 'The booklet calls this “doubling the strings”: the C of the F string (finger 4, matching the open C) with the E of the C string (finger 2). Place both fingers at the same time.', 8),
  { t: ['Dans le rythme', 'In rhythm'], x: ['Joue le doubling de Do en rythme de two-step : bas sur le 1, haut sur le 2, à 60, avec le bourdon de Do.', 'Play the C doubling in a two-step rhythm: down on 1, up on 2, at 60, with the C drone.'], min: 8, extra: { metro: { bpm: 60, mesure: 2 }, bourdon: [60] } },
], [['Les deux notes sonnent ensemble, sans l’une plus fort que l’autre.', 'Both notes sound together, neither louder than the other.']], [['Je pose le doubling de Do d’un seul geste.', 'I place the C doubling in one movement.']]))
out.push(mk(45, ['Jouer le doubling de Sol, deux façons.', 'Play the G doubling, two ways.'], [
  dblStep('G', 'Le Sol de la corde de Do (doigt 4) avec le Si de la corde de Sol (doigt 2). C’est ton accord de Sol quand l’accordéon tire.', 'The G on the C string (finger 4) with the B on the G string (finger 2). This is your G chord when the accordion pulls.', 7),
  { t: ['Le Sol grave', 'The low G'], x: ['Le livret donne aussi un Sol plus grave : Sol de la corde de Fa (doigt 1) avec le Ré de la corde de Do (doigt 1). Joue les deux Sol l’un après l’autre.', 'The booklet also gives a lower G: the G on the F string (finger 1) with the D on the C string (finger 1). Play both G chords one after the other.'], min: 7, extra: { notes: { cle: 'C', notes: [55, 62], titre: 'Sol grave : Sol + Ré', titreEn: 'Low G: G + D', ensemble: true } } },
  { t: ['Do puis Sol', 'C then G'], x: ['Alterne le doubling de Do et celui de Sol, un par mesure. Glisse la main d’un accord à l’autre au lieu de la soulever.', 'Alternate the C doubling and the G doubling, one per bar. Slide the hand from one chord to the other instead of lifting it.'], min: 6, extra: { metro: { bpm: 60, mesure: 2 } } },
], [['La main glisse d’un accord à l’autre.', 'The hand slides from one chord to the other.']], [['Je passe de Do à Sol sans regarder.', 'I go from C to G without looking.']]))
out.push(mk(46, ['Jouer les doublings de Fa et de Si♭ (pour la tonalité de Fa).', 'Play the F and B♭ doublings (for the key of F).'], [
  dblStep('F', 'La de la corde de Fa (doigt 2) avec le Do à vide. À vérifier à l’oreille avec l’enregistrement : le livret montre d’autres formes de Fa.', 'The A on the F string (finger 2) with the open C. Check it by ear against the recording: the booklet shows other F shapes too.', 6),
  dblStep('Bb', 'Pour la tonalité de Fa, l’accord de Si♭ : Si♭ de la corde de Fa (doigt 3) avec le Ré de la corde de Do (doigt 1).', 'For the key of F, the B♭ chord: the B♭ on the F string (finger 3) with the D on the C string (finger 1).', 6),
  { t: ['Fa puis Si♭', 'F then B♭'], x: ['Alterne Fa et Si♭, un par mesure, à 56.', 'Alternate F and B♭, one per bar, at 56.'], min: 6, extra: { metro: { bpm: 56, mesure: 2 } } },
], [['Le Si♭ sonne comme un changement de couleur.', 'The B♭ sounds like a change of colour.']], [['Je connais les doublings de Fa et de Si♭.', 'I know the F and B♭ doublings.']]))
out.push(mk(47, ['Enchaîner les accords 1, 4, 5 en Do : Do, Fa, Sol.', 'Chain the 1, 4, 5 chords in C: C, F, G.'], [
  dblStep('C', 'Le 1 : Do + Mi.', 'The 1: C + E.', 3), dblStep('F', 'Le 4 : La + Do.', 'The 4: A + C.', 3), dblStep('G', 'Le 5 : Sol + Si.', 'The 5: G + B.', 3),
  { t: ['Enchaîne 1 – 4 – 1 – 5', 'Chain 1 – 4 – 1 – 5'], x: ['Joue une mesure par accord : Do, Fa, Do, Sol, en boucle. Un coup d’archet par temps. Le livret dit que les accords viennent souvent dans cet ordre, et que la mélodie rentre « à la maison » sur le 1.', 'Play one bar per chord: C, F, C, G, in a loop. One bow stroke per beat. The booklet says the chords often come in this order, and that the melody goes “home” on the 1.'], min: 8, extra: { metro: { bpm: 60, mesure: 2 } } },
], [['Tu entends le 5 « demander » le 1.', 'You hear the 5 “asking for” the 1.']], [['Je joue 1-4-1-5 en Do sans m’arrêter.', 'I play 1-4-1-5 in C without stopping.']]))
out.push(mk(48, ['Enchaîner les accords 1, 4, 5 en Sol, puis en Fa.', 'Chain the 1, 4, 5 chords in G, then in F.'], [
  dblStep('G', 'En Sol, le 1 : Sol + Si.', 'In G, the 1: G + B.', 3), dblStep('D', 'En Sol, le 5 : Ré + La (Ré de la corde de Do, La de la corde de Sol, un doigt chacun).', 'In G, the 5: D + A (the D on the C string, the A on the G string, one finger each).', 3),
  { t: ['Sol : 1 – 4 – 1 – 5', 'G: 1 – 4 – 1 – 5'], x: ['Sol, Do, Sol, Ré : une mesure par accord, à 60.', 'G, C, G, D: one bar per chord, at 60.'], min: 6, extra: { metro: { bpm: 60, mesure: 2 } } },
  { t: ['Fa : 1 – 4 – 1 – 5', 'F: 1 – 4 – 1 – 5'], x: ['Fa, Si♭, Fa, Do : une mesure par accord, à 60.', 'F, B♭, F, C: one bar per chord, at 60.'], min: 6, extra: { metro: { bpm: 60, mesure: 2 } } },
], [['Les trois tonalités ont la même forme de chanson.', 'All three keys follow the same song shape.']], [['Je peux nommer le 1, le 4 et le 5 en Do, Sol et Fa.', 'I can name the 1, 4 and 5 in C, G and F.']]))
out.push(mk(49, ['Revoir tous les doublings.', 'Review all the doublings.'], [
  { t: ['Tour des doublings', 'Tour of the doublings'], x: ['Joue chaque doubling, un par mesure : Do, Fa, Sol, Ré, Si♭. Dis le nom de l’accord à voix haute.', 'Play each doubling, one per bar: C, F, G, D, B♭. Say the chord name out loud.'], min: 10, extra: { metro: { bpm: 56, mesure: 2 } } },
  { t: ['Sans regarder', 'Without looking'], x: ['Ferme les yeux et pose le doubling que je te demande en dedans de toi : Sol, puis Do, puis Fa. Vérifie avec l’oreille.', 'Close your eyes and place the doubling you name to yourself: G, then C, then F. Check with your ear.'], min: 8 },
], [['Tu retrouves les doublings sans regarder.', 'You find the doublings without looking.']], [['Je connais cinq doublings.', 'I know five doublings.']]))

// Semaine 8 : seconder le two-step
out.push(secondDay(50, 2, 'droite', ['C', 'G'], 66, ['Commence avec le Do et le Sol seulement.', 'Start with just C and G.']))
out.push(secondDay(51, 2, 'droite', ['C', 'G'], 72, ['L’accordéon en Do n’a que deux accords : Do (pousser) et Sol (tirer). Reste sur le 1 et le 5.', 'The C accordion has only two chords: C (push) and G (pull). Stay on the 1 and the 5.']))
out.push(secondDay(52, 2, 'rythme', ['C', 'G'], 66, ['Trouve la note du lead, puis garde le rythme.', 'Find the lead’s note, then keep the rhythm.']))
out.push(secondDay(53, 2, 'rythme', ['C', 'F', 'G'], 72, ['Change d’accord sur la barre de mesure sans casser le rythme.', 'Change chord on the bar line without breaking the rhythm.']))
out.push(secondDay(54, 2, 'shuffle', ['C'], 60, ['Commence très lentement : le long, puis les deux courts, puis l’autre sens.', 'Start very slowly: the long one, then the two short ones, then the other direction.']))
out.push(secondDay(55, 2, 'shuffle', ['C', 'F', 'G'], 66, ['Garde le shuffle en changeant d’accord. Le long coup roule vers l’aigu puis revient.', 'Keep the shuffle going while changing chords. The long stroke rolls up then back.']))
out.push(mk(56, ['Seconder un two-step en basse droite, en archet rythmique et en shuffle.', 'Second a two-step in straight bassing, rhythm bow and shuffle.'], [
  { t: ['Les trois façons', 'The three ways'], x: ['Avec la chanson de la semaine 3, joue quatre mesures en basse droite, quatre en archet rythmique, quatre en shuffle, puis recommence.', 'With a week-3 song, play four bars in straight bassing, four in rhythm bow, four in shuffle, then start again.'], min: 12, extra: { metro: { bpm: 72, mesure: 2 } } },
  { t: ['Choisis ta préférée', 'Pick your favourite'], x: ['Quelle façon sonne le mieux sous la mélodie ? Joue-la une fois entière avec l’accompagnement.', 'Which way sounds best under the melody? Play it once all the way through with the backing.'], min: 8 },
], [['Tu sens la différence de couleur entre les trois façons.', 'You feel the difference in colour between the three ways.']], [['Je peux changer de façon de seconder sans m’arrêter.', 'I can switch ways of seconding without stopping.']]))

// Semaine 9 : seconder la valse
out.push(mk(57, ['Sentir le pied de la valse cadienne : trois – UN – (deux) – trois.', 'Feel the Cajun waltz foot: three – ONE – (two) – three.'], [
  { t: ['Le pied', 'The foot'], x: ['Tape du pied : trois – UN – (deux) – trois – UN. Le UN est lourd et dur, le deux est silencieux, le trois est rapide. Compte-le à voix haute avec le métronome.', 'Tap your foot: three – ONE – (two) – three – ONE. The ONE is heavy and hard, the two is silent, the three is quick. Count it out loud with the metronome.'], min: 8, extra: { metro: { bpm: 100, mesure: 3 } } },
  { t: ['Pied et archet', 'Foot and bow'], x: ['Garde le pied, puis ajoute l’archet : un coup lourd sur le UN, rien sur le deux, un coup léger sur le trois. Utilise le doubling de Do.', 'Keep the foot going, then add the bow: a heavy stroke on the ONE, nothing on the two, a light stroke on the three. Use the C doubling.'], min: 10, extra: { metro: { bpm: 100, mesure: 3 }, notes: { cle: 'C', notes: [...DOUBLING.C], titre: 'Do : Do + Mi', titreEn: 'C: C + E', ensemble: true } } },
], [['Ton pied et ton archet tombent ensemble sur le UN.', 'Your foot and your bow land together on the ONE.']], [['Je tape le pied sans penser.', 'I tap my foot without thinking.']]))
out.push(secondDay(58, 3, 'droite', ['C', 'G'], 96, ['Le temps 1 est lourd, les temps 2 et 3 légers.', 'Beat 1 is heavy, beats 2 and 3 light.']))
out.push(secondDay(59, 3, 'rythme', ['C', 'F', 'G'], 96, ['Gratte comme une guitare : bas-haut, bas-haut, bas-haut, avec le UN en accent.', 'Strum like a guitar: down-up, down-up, down-up, with the ONE accented.']))
out.push(secondDay(60, 3, 'shuffle', ['C', 'F', 'G'], 90, ['Le long coup tombe sur le 1, puis deux petits coups.', 'The long stroke lands on the 1, then two small strokes.']))
out.push(mk(61, ['Reconnaître et jouer la valse à deux temps.', 'Recognise and play the two-time waltz.'], [
  { t: ['Deux sortes de valses', 'Two kinds of waltz'], x: ['Le livret montre la valse régulière et la valse « à deux temps ». Écoute les deux (les pistes « Gran Mamou » et « Mademoiselle, quoi tu veux manger ? » de Dewey Balfa) et compte ce que tu entends : trois ou deux ?', 'The booklet shows the regular waltz and the “two-time waltz”. Listen to both (the “Gran Mamou” and “Mademoiselle, quoi tu veux manger?” tracks by Dewey Balfa) and count what you hear: three or two?'], min: 8 },
  { t: ['À toi', 'Your turn'], x: ['Avec une valse de l’application, tape un balancement à deux temps par mesure plutôt que trois, et seconde avec le doubling de Do.', 'With a waltz from the app, tap a two-beat sway per bar instead of three, and second with the C doubling.'], min: 10, extra: { metro: { bpm: 90, mesure: 3 } } },
], [['Tu distingues la valse régulière de la valse à deux temps.', 'You can tell the regular waltz from the two-time waltz.']], [['J’ai essayé les deux façons de compter.', 'I tried both ways of counting.']]))
out.push(secondDay(62, 3, 'rythme', ['G', 'D'], 96, ['Joue maintenant en Sol : Sol et Ré. Puis refais-le en Fa avec Fa et Do.', 'Now play in G: G and D. Then do it again in F with F and C.']))
out.push(mk(63, ['Revoir le seconding de la valse.', 'Review waltz seconding.'], [
  { t: ['Le pied', 'The foot'], x: ['Tape du pied trois – UN – (deux) – trois pendant toute une chanson.', 'Tap your foot three – ONE – (two) – three through a whole song.'], min: 6, extra: { metro: { bpm: 100, mesure: 3 } } },
  { t: ['Les trois façons', 'The three ways'], x: ['Quatre mesures en basse droite, quatre en archet rythmique, quatre en shuffle, sur une valse.', 'Four bars in straight bassing, four in rhythm bow, four in shuffle, on a waltz.'], min: 12, extra: { metro: { bpm: 96, mesure: 3 } } },
], [['Ton pied et ton archet ne se disputent pas.', 'Your foot and your bow do not fight.']], [['Je peux seconder une valse entière.', 'I can second a whole waltz.']]))

// Semaine 10 : formes, fins, harmonie de ténor
out.push(mk(64, ['Reconnaître les formes 1-5-1-5 et 1-4-1-5.', 'Recognise the 1-5-1-5 and 1-4-1-5 forms.'], [
  { t: ['Deux formes', 'Two forms'], x: ['Joue les doublings sur 1-5-1-5 (Do, Sol, Do, Sol) puis sur 1-4-1-5 (Do, Fa, Do, Sol). Écoute comment le Fa change la couleur.', 'Play the doublings over 1-5-1-5 (C, G, C, G) then over 1-4-1-5 (C, F, C, G). Hear how the F changes the colour.'], min: 10, extra: { metro: { bpm: 66, mesure: 2 } } },
  { t: ['Dans une chanson', 'In a song'], x: ['Ouvre une chanson et dis, mesure par mesure, quelle forme elle suit.', 'Open a song and say, bar by bar, which form it follows.'], min: 8 },
], [['Tu entends quand le 4 arrive.', 'You hear when the 4 arrives.']], [['Je reconnais les deux formes.', 'I recognise both forms.']]))
out.push(mk(65, ['Compter les mesures et annoncer les changements d’accord.', 'Count the bars and anticipate chord changes.'], [
  { t: ['Compter huit mesures', 'Counting eight bars'], x: ['Joue une chanson en comptant 1 à 8 dans ta tête. Le changement d’accord tombe presque toujours sur la mesure 3, 4, 5 ou 7.', 'Play a song counting 1 to 8 in your head. The chord change almost always lands on bar 3, 4, 5 or 7.'], min: 10, extra: { metro: { bpm: 72, mesure: 2 } } },
  { t: ['Annoncer', 'Anticipating'], x: ['Prépare le doigt du prochain accord pendant la dernière note de la mesure.', 'Prepare the finger for the next chord during the last note of the bar.'], min: 8 },
], [['Le changement tombe juste, sans accroc.', 'The change lands cleanly, without a hitch.']], [['Je ne me perds plus dans les mesures.', 'I no longer lose my place in the bars.']]))
out.push(mk(66, ['Jouer les fins : le court 5 avant la maison, et la fin sur le 4.', 'Play the endings: the short 5 before home, and the 4 ending.'], [
  { t: ['Le court 5', 'The short 5'], x: ['Le livret dit qu’on entend un court accord de 5 juste avant la fin, puis la mélodie rentre « à la maison » sur le 1. Joue Sol, puis Do.', 'The booklet says you hear a short 5 chord just before the end, then the melody goes “home” on the 1. Play G, then C.'], min: 8, extra: { notes: { cle: 'C', notes: [...DOUBLING.G], titre: 'Le 5 : Sol + Si', titreEn: 'The 5: G + B', ensemble: true } } },
  { t: ['La fin sur le 4', 'The 4 ending'], x: ['L’accordéon finit parfois sur le 4. Essaie : termine une chanson sur le Fa.', 'The accordion sometimes ends on the 4. Try it: end a song on the F.'], min: 8 },
], [['Tu entends la fin arriver.', 'You hear the ending coming.']], [['Je finis une chanson sur le 1 et sur le 4.', 'I end a song on the 1 and on the 4.']]))
out.push(mk(67, ['Entendre l’harmonie de ténor : le second violon moderne.', 'Hear the tenor harmony: the modern second fiddle.'], [
  { t: ['Écoute', 'Listen'], x: ['Le livret appelle « modern 2nd fiddle » une harmonie de ténor jouée par le second violon par-dessus le lead. Écoute la piste de Dewey, d’abord lentement.', 'The booklet calls “modern 2nd fiddle” a tenor harmony played by the second fiddle over the lead. Listen to Dewey’s track, slowly first.'], min: 8 },
  { t: ['Essaie', 'Try it'], x: ['Prends une chanson de la semaine 3. Joue la mélodie une tierce plus bas sur les notes longues, et reste proche de la mélodie sur les autres.', 'Take a week-3 song. Play the melody a third lower on the long notes, and stay close to the melody on the others.'], min: 10, extra: { gamme: { cle: 'C', de: 55, a: 67 }, bourdon: [60] } },
], [['Les deux lignes se mélangent bien.', 'The two lines blend well.']], [['J’ai trouvé au moins trois notes d’harmonie.', 'I found at least three harmony notes.']]))
out.push(mk(68, ['Reconnaître le 1, le 4 et le 5 à l’oreille.', 'Recognise the 1, 4 and 5 by ear.'], [
  { t: ['Joue et nomme', 'Play and name'], x: ['Joue un doubling au hasard (Do, Fa ou Sol), puis nomme-le : 1, 4 ou 5 ? Vérifie avec le doigté.', 'Play a random doubling (C, F or G), then name it: 1, 4 or 5? Check with the fingering.'], min: 10 },
  { t: ['Avec la chanson', 'With a song'], x: ['Écoute une chanson sans regarder la grille, et écris sur papier la suite d’accords que tu entends.', 'Listen to a song without looking at the chart, and write on paper the chord sequence you hear.'], min: 10 },
], [['Tu reconnais le 5 qui « demande » le 1.', 'You recognise the 5 “asking for” the 1.']], [['J’ai trouvé les accords d’une chanson à l’oreille.', 'I found the chords of a song by ear.']]))
out.push(mk(69, ['Glisser dans les accords plutôt que sauter.', 'Slide into the chords rather than jumping.'], [
  { t: ['Glissé', 'The slide'], x: ['Le livret insiste sur la main qui glisse vers l’accord. Joue Do puis Sol en glissant le doigt de la corde de Do vers celle de Sol, sans lever la main.', 'The booklet stresses the hand sliding into the chord. Play C then G, sliding the finger from the C string toward the G string without lifting the hand.'], min: 10, extra: { metro: { bpm: 60, mesure: 2 } } },
  { t: ['Léger', 'Light touch'], x: ['Le glissé doit être court et léger : on l’entend à peine.', 'The slide should be short and light: you barely hear it.'], min: 8 },
], [['Le glissé est court et naturel.', 'The slide is short and natural.']], [['Mes changements d’accord sont fluides.', 'My chord changes are smooth.']]))
out.push(mk(70, ['Revoir les formes et les fins.', 'Review forms and endings.'], [
  { t: ['Une chanson complète', 'A whole song'], x: ['Seconde une chanson entière, du début à la fin, avec la forme qui convient et une vraie fin.', 'Second a whole song from start to finish, with the right form and a proper ending.'], min: 14, extra: { metro: { bpm: 72, mesure: 2 } } },
  { t: ['Écoute-toi', 'Listen to yourself'], x: ['Enregistre-toi avec ton téléphone, puis écoute : qu’est-ce qui sonne le mieux ?', 'Record yourself on your phone, then listen back: what sounds best?'], min: 6 },
], [['Ta fin sonne comme une vraie fin.', 'Your ending sounds like a real ending.']], [['J’ai joué une chanson entière sans m’arrêter.', 'I played a whole song without stopping.']]))

// Semaine 11 : lead et segondeur
song(mkSong(71, 'C', ['Jouer le lead d’un two-step en deux parties, A et B.', 'Play the lead of a two-step in two parts, A and B.'], warmScale('C', 55, 79, 'Joue la gamme de Do sur toute l’étendue, à 72, avec le bourdon.', 'Play the C scale over the full range, at 72, with the drone.'), ['La partie A est la première moitié, la B le pont.', 'Part A is the first half, B is the bridge.'], ['Le passage de A à B est fluide.', 'The move from A to B is smooth.'], ['Je joue les 16 mesures sans m’arrêter.', 'I play the 16 bars without stopping.']))
out.push(secondDay(72, 2, 'rythme', ['C', 'F', 'G'], 80, ['Seconde le grand two-step : une mesure par accord, avec la mélodie qui joue.', 'Second the big two-step: one bar per chord, with the melody playing.']))
song(mkSong(73, 'C', ['Jouer le lead d’une valse en deux parties, A et B.', 'Play the lead of a waltz in two parts, A and B.'], warmScale('C', 55, 79, 'Joue la gamme de Do sur toute l’étendue, en groupes de trois, avec le bourdon.', 'Play the C scale over the full range in groups of three, with the drone.'), ['Fais sentir le UN lourd, même dans la mélodie.', 'Make the ONE heavy, even in the melody.'], ['La valse balance.', 'The waltz sways.'], ['Je joue les 16 mesures de la valse.', 'I play the 16 bars of the waltz.']))
out.push(secondDay(74, 3, 'rythme', ['C', 'F', 'G'], 96, ['Seconde la grande valse avec le pied : trois – UN – (deux).', 'Second the big waltz with the foot: three – ONE – (two).']))
out.push(mk(75, ['Changer de rôle : lead, puis segondeur, sur la même chanson.', 'Switch roles: lead, then segondeur, on the same song.'], [
  { t: ['Lead', 'Lead'], x: ['Joue le grand two-step comme lead, avec l’accompagnement de l’application.', 'Play the big two-step as lead, with the app’s backing.'], min: 8, extra: { metro: { bpm: 80, mesure: 2 } } },
  { t: ['Segondeur', 'Segondeur'], x: ['Reprends la même chanson et seconde cette fois : coupe la mélodie, garde l’accordéon, joue ton doubling.', 'Take the same song again and second this time: mute the melody, keep the accordion, play your doubling.'], min: 8 },
  { t: ['Tour à tour', 'Taking turns'], x: ['Alterne : huit mesures de lead, huit mesures de segondeur, sans t’arrêter.', 'Alternate: eight bars of lead, eight bars of segondeur, without stopping.'], min: 8 },
], [['Tu changes de rôle sans perdre la mesure.', 'You switch roles without losing the beat.']], [['Je peux jouer le lead et le second sur la même chanson.', 'I can play the lead and the second on the same song.']]))
song(mkSong(76, 'G', ['Jouer le lead et seconder une chanson en Sol.', 'Play the lead and second a song in G.'], warmScale('G', 55, 79, 'Joue la gamme de Sol sur toute l’étendue, à 72, avec le bourdon de Sol.', 'Play the G scale over the full range at 72 with the G drone.'), ['En Sol : Sol, Do, Ré. Seconde ensuite avec Sol + Si, Do + Mi, Ré + La.', 'In G: G, C, D. Then second with G + B, C + E, D + A.'], ['Le Fa♯ est juste dans la mélodie.', 'The F♯ is in tune in the melody.'], ['Je joue le lead puis le second en Sol.', 'I play the lead then the second in G.']))
song(mkSong(77, 'F', ['Jouer le lead et seconder une chanson en Fa.', 'Play the lead and second a song in F.'], warmScale('F', 53, 77, 'Joue la gamme de Fa sur toute l’étendue, à 72, avec le bourdon de Fa.', 'Play the F scale over the full range at 72 with the F drone.'), ['En Fa : Fa, Si♭, Do. Seconde avec La + Do, Si♭ + Ré, Do + Mi.', 'In F: F, B♭, C. Second with A + C, B♭ + D, C + E.'], ['Le Si♭ est bas et juste.', 'The B♭ is low and in tune.'], ['Je joue le lead puis le second en Fa.', 'I play the lead then the second in F.']))

// Semaine 12 : à l'oreille et avec l'accordéon
out.push(mk(78, ['Trouver la tonalité d’une chanson à l’oreille.', 'Find the key of a song by ear.'], [
  { t: ['Cherche la maison', 'Find home'], x: ['Écoute une chanson de l’application et cherche la note « maison » : celle où la mélodie se repose. Essaie Do, Sol, Fa avec les cordes à vide.', 'Listen to a song in the app and look for the “home” note: the one where the melody rests. Try C, G and F with the open strings.'], min: 12 },
  { t: ['Vérifie', 'Check'], x: ['Joue la gamme de la tonalité trouvée par-dessus. Si elle sonne juste, c’est la bonne.', 'Play the scale of the key you found over it. If it sounds right, that is the one.'], min: 8 },
], [['La note maison te donne un sentiment de repos.', 'The home note gives you a feeling of rest.']], [['J’ai trouvé la tonalité de trois chansons.', 'I found the key of three songs.']]))
out.push(mk(79, ['Entendre le pousser-tirer de l’accordéon : Do en poussant, Sol en tirant.', 'Hear the accordion’s push-pull: C on the push, G on the pull.'], [
  { t: ['Écoute', 'Listen'], x: ['Sur l’accordéon en Do, la main gauche donne le Do en poussant et le Sol en tirant. Écoute la chanson et dis : « pousser » ou « tirer ».', 'On the C accordion the left hand gives C on the push and G on the pull. Listen to the song and say “push” or “pull”.'], min: 10 },
  { t: ['Suis', 'Follow'], x: ['Joue le doubling qui va : Do + Mi pour pousser, Sol + Si pour tirer.', 'Play the matching doubling: C + E for push, G + B for pull.'], min: 10, extra: { metro: { bpm: 66, mesure: 2 } } },
], [['Tu entends l’accordéon changer de sens.', 'You hear the accordion change direction.']], [['Je suis le pousser-tirer à l’oreille.', 'I follow the push-pull by ear.']]))
out.push(mk(80, ['Répondre à des phrases à l’oreille.', 'Echo phrases by ear.'], [
  { t: ['Écho', 'Echo'], x: ['Joue une phrase de deux mesures pentatonique, puis répète-la sans regarder. Allonge-la peu à peu.', 'Play a two-bar pentatonic phrase, then repeat it without looking. Lengthen it little by little.'], min: 12 },
  { t: ['Réponse', 'Answer'], x: ['Invente une réponse à ta propre phrase, comme au jour 41.', 'Invent an answer to your own phrase, as on day 41.'], min: 8 },
], [['Ta phrase revient exactement la même.', 'Your phrase comes back exactly the same.']], [['Je répète une phrase de quatre mesures à l’oreille.', 'I repeat a four-bar phrase by ear.']]))
out.push(mk(81, ['Simuler une vraie session.', 'Simulate a real session.'], [
  { t: ['Inconnu', 'Unknown'], x: ['Lance une chanson de l’application sans regarder la grille. Trouve la tonalité, puis seconde-la.', 'Start a song in the app without looking at the chart. Find the key, then second it.'], min: 14 },
  { t: ['Deuxième tour', 'Second time through'], x: ['Reprends la même chanson et joue le lead cette fois.', 'Take the same song again and play the lead this time.'], min: 8 },
], [['Tu t’en sors sans regarder la grille.', 'You manage without looking at the chart.']], [['J’ai suivi une chanson inconnue du début à la fin.', 'I followed an unknown song from start to finish.']]))
out.push(mk(82, ['Préparer une session avec ton ami à l’accordéon.', 'Prepare a session with your friend on the accordion.'], [
  { t: ['Accordez-vous', 'Tune up together'], x: ['Accorde ton violon sur le Do de l’accordéon : l’accordéon ne s’accorde pas, c’est ton violon qui s’adapte.', 'Tune your fiddle to the accordion’s C: the accordion cannot be retuned, so your fiddle adapts.'], min: 6 },
  { t: ['Convenez de tout', 'Agree on everything'], x: ['Décidez : la tonalité, qui joue le lead, qui seconde, combien de tours, comment finir.', 'Decide: the key, who plays lead, who seconds, how many times through, how to end.'], min: 8 },
  { t: ['Jouez', 'Play'], x: ['Jouez le grand two-step puis la grande valse ensemble, en changeant de rôle.', 'Play the big two-step and then the big waltz together, switching roles.'], min: 12 },
], [['Vous finissez ensemble.', 'You finish together.']], [['Nous avons joué ensemble sans nous arrêter.', 'We played together without stopping.']]))
out.push(mk(83, ['Faire un dernier tour des gammes et du seconding.', 'A final run-through of scales and seconding.'], [
  { t: ['Gammes', 'Scales'], x: ['Joue Do, Sol et Fa majeur, puis leurs pentatoniques, à 80.', 'Play C, G and F major, then their pentatonics, at 80.'], min: 10, extra: { gamme: { cle: 'C', de: 60, a: 72 }, metro: { bpm: 80, mesure: 2 } } },
  { t: ['Seconding', 'Seconding'], x: ['Seconde un two-step puis une valse, en basse droite, archet rythmique et shuffle.', 'Second a two-step and then a waltz, in straight bassing, rhythm bow and shuffle.'], min: 14 },
], [['Tout tient en place.', 'Everything holds together.']], [['Je suis prêt pour l’évaluation.', 'I am ready for the assessment.']]))
out.push(mk(84, ['Évaluation finale du programme de douze semaines.', 'Final assessment of the twelve-week programme.'], [
  { t: ['Gammes et pentatoniques', 'Scales and pentatonics'], x: ['Joue Do, Sol et Fa, majeur et pentatonique, sans erreur et à 90.', 'Play C, G and F, major and pentatonic, without a mistake and at 90.'], min: 8, extra: { metro: { bpm: 90, mesure: 2 } } },
  { t: ['Lead', 'Lead'], x: ['Joue le grand two-step et la grande valse, en lead, de mémoire.', 'Play the big two-step and the big waltz as lead, from memory.'], min: 6 },
  { t: ['Segondeur', 'Segondeur'], x: ['Seconde-les en trois façons, avec le pied dans la valse.', 'Second them in three ways, with the foot in the waltz.'], min: 8 },
  { t: ['Et ensuite ?', 'What next?'], x: ['Tu as fini le programme. Continue : apprends des airs à l’oreille, écoute Dewey Balfa et d’autres violoneux, et joue avec ton ami.', 'You have finished the programme. Keep going: learn tunes by ear, listen to Dewey Balfa and other fiddlers, and play with your friend.'], min: 4 },
], [['Tu es fier de ce que tu as appris.', 'You are proud of what you have learned.']], [['Je peux jouer en lead et en segondeur avec un ami.', 'I can play lead and segondeur with a friend.']]))

export const WEEK_DAYS: Day[] = out.map((o) => o[0])
export const WEEK_DAYS_EN: Record<number, DayEn> = Object.fromEntries(out.map((o) => [o[0].jour, o[1]]))
