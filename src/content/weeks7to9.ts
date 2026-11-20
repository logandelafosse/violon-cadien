// Jours 43 à 63 : contenu écrit (les gabarits sont dans dayKit.ts).
import type { Day } from './types'
import type { DayEn } from './days.en'
import { build, type Spec } from './songDays'
import { DOUBLING } from './seconding'
import { mk, scaleDay, dblStep, secondDay, warmScale, warmNotes, mkSong } from './dayKit'

const out: [Day, DayEn][] = []
const song = (sp: Spec) => out.push(build(sp))

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

export const DAYS_PART: [Day, DayEn][] = out
