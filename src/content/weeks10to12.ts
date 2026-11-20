// Jours 64 à 84 : contenu écrit (les gabarits sont dans dayKit.ts).
import type { Day } from './types'
import type { DayEn } from './days.en'
import { build, type Spec } from './songDays'
import { DOUBLING } from './seconding'
import { mk, scaleDay, dblStep, secondDay, warmScale, warmNotes, mkSong } from './dayKit'

const out: [Day, DayEn][] = []
const song = (sp: Spec) => out.push(build(sp))

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

export const DAYS_PART: [Day, DayEn][] = out
