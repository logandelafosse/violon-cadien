// Jours 64 à 84 : contenu écrit jour par jour (les gabarits communs sont dans dayKit.ts).
import type { Day } from './types'
import type { DayEn } from './days.en'
import type { KeyName } from '../theory/fiddle'
import { DOUBLING } from './seconding'
import { mk, dblStep } from './dayKit'

const out: [Day, DayEn][] = []
const inKey = (p: [Day, DayEn], cle: KeyName): [Day, DayEn] => { p[0].cle = cle; return p }

// ---------- Semaine 10 : formes, fins, harmonie de ténor ----------
out.push(mk(64, ['Reconnaître à l’oreille et à la main les formes 1-5-1-5 et 1-4-1-5.', 'Recognise the 1-5-1-5 and 1-4-1-5 forms by ear and by hand.'], [
  { t: ['La forme 1-5-1-5', 'The 1-5-1-5 form'], x: [
    'Une « forme », c’est l’ordre des accords. Ici : Do, Sol, Do, Sol, un accord par mesure. Mets le métronome à 66 et joue le doubling de Do (Do + Mi) à la mesure 1, celui de Sol (Sol + Si) à la mesure 2, et ainsi de suite : quatre mesures, quatre fois de suite (16 mesures sans t’arrêter). Compte tout haut « un-deux » dans chaque mesure.',
    'A “form” is the order of the chords. Here: C, G, C, G, one chord per bar. Set the metronome to 66 and play the C doubling (C + E) in bar 1, the G doubling (G + B) in bar 2, and so on: four bars, four times in a row (16 bars without stopping). Count “one-two” aloud in every bar.'], min: 6, extra: { metro: { bpm: 66, mesure: 2 } } },
  dblStep('F', 'Le Fa se joue avec les doigts qui restent sur les cordes de Fa et de Do : La + Do. Joue-le seul trois fois, puis écoute-le comme une « couleur plus ouverte » que le Do.', 'The F is played with fingers staying on the F and C strings: A + C. Play it alone three times, then hear it as a “more open colour” than the C.', 3),
  { t: ['La forme 1-4-1-5', 'The 1-4-1-5 form'], x: [
    'Même exercice, mais avec Do, Fa, Do, Sol. Le seul changement est la mesure 2 : Fa au lieu de Sol. Joue quatre fois (16 mesures), toujours à 66. Pour savoir que tu l’as : ferme les yeux à la deuxième fois et dis « quatre » à voix haute quand le Fa arrive.',
    'Same exercise with C, F, C, G. The only change is bar 2: F instead of G. Play it four times (16 bars), still at 66. To know you have it: close your eyes the second time and say “four” aloud when the F arrives.'], min: 5, extra: { metro: { bpm: 66, mesure: 2 } } },
  { t: ['Dans les chansons', 'In the songs'], x: [
    'Ouvre « Pratique avec une chanson » : les deux chansons sont celles du jour 20. Lis la ligne d’accords de chacune, écris-la en chiffres sur papier (Do = 1, Fa = 4, Sol = 5), puis écoute la chanson en gardant la mélodie coupée. Dis-toi : forme 1-5 ou forme 1-4 ? Où la chanson change-t-elle de forme ?',
    'Open “Practice with a song”: the two songs are those of day 20. Read the chord line of each, write it as numbers on paper (C = 1, F = 4, G = 5), then listen with the melody muted. Ask yourself: 1-5 form or 1-4 form? Where does the song change form?'], min: 8 },
], [['Tu entends le moment où le 4 arrive : le son s’ouvre, puis il revient.', 'You hear the moment the 4 arrives: the sound opens up, then comes back.'], ['Le 5 sonne comme une question, le 1 comme la réponse.', 'The 5 sounds like a question, the 1 like the answer.']],
[['Je joue 16 mesures de 1-5-1-5 puis de 1-4-1-5 sans m’arrêter.', 'I play 16 bars of 1-5-1-5 then of 1-4-1-5 without stopping.'], ['Je sais écrire la forme d’une chanson en chiffres.', 'I can write a song’s form as numbers.']]))

out.push(mk(65, ['Compter les mesures sans te perdre et préparer le doigt du prochain accord.', 'Count the bars without getting lost and prepare the finger for the next chord.'], [
  { t: ['Compter huit mesures', 'Counting eight bars'], x: [
    'Ouvre la chanson « Two-step de la troisième semaine » (jour 21, menu Jour). Accords : Do Do Fa Do Do Sol Sol Do. Mets la mélodie en route à 72 et compte tout haut les mesures : « un-deux, deux-deux, trois-deux… » jusqu’à huit. Remarque que l’accord change aux mesures 3, 4, 6 et 8, jamais au hasard. Joue quatre tours en comptant les mesures, sans te tromper.',
    'Open the “Week-Three Two-Step” (day 21, Day menu). Chords: C C F C C G G C. Start the melody at 72 and count the bars aloud: “one-two, two-two, three-two…” up to eight. Notice that the chord changes on bars 3, 4, 6 and 8, never at random. Play four times through counting the bars, without a slip.'], min: 8, extra: { metro: { bpm: 72, mesure: 2 } } },
  { t: ['Annoncer le changement', 'Anticipating the change'], x: [
    'Coupe la mélodie, garde l’accompagnement. Joue le doubling de chaque accord, un coup d’archet par temps. Pendant le deuxième temps de la mesure d’avant le changement, place déjà tes doigts sur le doubling suivant (sans jouer), puis joue-le pile sur le un. Repère les trois mesures où ça compte : 2→3 (Do vers Fa), 3→4 (Fa vers Do), 5→6 (Do vers Sol).',
    'Mute the melody, keep the backing. Play the doubling of each chord, one bow per beat. During the second beat of the bar before the change, already place your fingers on the next doubling (without playing), then play it exactly on the one. Mark the three bars where it matters: 2→3 (C to F), 3→4 (F to C), 5→6 (C to G).'], min: 8, extra: { metro: { bpm: 72, mesure: 2 } } },
  { t: ['De mémoire', 'From memory'], x: [
    'Cache la ligne d’accords avec une feuille. Écris de mémoire l’accord de chaque mesure (1 à 8), puis soulève la feuille et corrige. Rejoue en secondant. Objectif : zéro erreur d’accord sur deux tours de suite.',
    'Cover the chord line with a sheet of paper. Write the chord of each bar (1 to 8) from memory, then lift the paper and check. Play again, seconding. Goal: zero chord errors two rounds in a row.'], min: 7 },
], [['Le changement d’accord tombe sur le un de la mesure, jamais en retard.', 'The chord change lands on beat one of the bar, never late.']],
[['Je dis le numéro de la mesure sans me perdre sur huit mesures.', 'I name the bar number without losing my place over eight bars.'], ['Mes doigts sont déjà en place avant chaque changement.', 'My fingers are already in place before each change.']]))

out.push(mk(66, ['Jouer trois façons de finir : court 5 puis 1, fin sur le 4, fin posée sur le 1.', 'Play three ways to end: short 5 then 1, 4 ending, settled 1 ending.'], [
  { t: ['Le court 5 avant la maison', 'The short 5 before home'], x: [
    'Dans les fins classiques, un court accord de 5 précède le retour « à la maison » sur le 1. Joue le doubling de Sol sur un temps (Sol + Si), puis celui de Do sur le temps suivant, tenu une mesure complète, à 66. Répète dix fois : le Sol doit être court et sec, le Do long et calme.',
    'In classic endings, a short 5 chord comes before the return “home” on the 1. Play the G doubling for one beat (G + B), then the C doubling on the next beat, held for a full bar, at 66. Repeat ten times: the G should be short and crisp, the C long and calm.'], min: 6, extra: { metro: { bpm: 66, mesure: 2 }, notes: { cle: 'C', notes: [...DOUBLING.G], titre: 'Le 5 : Sol + Si', titreEn: 'The 5: G + B', ensemble: true } } },
  { t: ['La fin sur le 4', 'The 4 ending'], x: [
    'Quand l’accordéon (ou le lead) finit sur le 4, la fin sonne ouverte, un peu « suspendue ». Joue Do (une mesure), puis Fa (une mesure tenue), à 66, trois fois. Ensuite, compare : joue Sol puis Do (fin posée), puis Do puis Fa (fin ouverte) et dis laquelle te semble finie.',
    'When the accordion (or the lead) finishes on the 4, the ending sounds open, slightly “hanging”. Play C (one bar), then F (one held bar), at 66, three times. Then compare: play G then C (settled ending), then C then F (open ending) and say which one feels finished.'], min: 6, extra: { metro: { bpm: 66, mesure: 2 } } },
  { t: ['Dans une chanson', 'In a song'], x: [
    'Sur « Les trois triades » (jour 20, accords Do Do Fa Fa Sol Sol Do Do), seconde trois tours avec l’accompagnement. Aux deux premiers tours, joue normalement. Au troisième, joue le Sol de la mesure 5 normalement, mais à la mesure 6 ne le garde qu’un temps, puis Do jusqu’à la fin ; au tour suivant, finis sur Fa. Arrête-toi en même temps que l’application.',
    'On “The Three Triads” (day 20, chords C C F F G G C C), second three rounds with the backing. In the first two rounds play normally. In the third, play the G of bar 5 normally, but in bar 6 keep it for one beat only, then C to the end; next time, finish on F. Stop at the same time as the app.'], min: 8 },
], [['Tu entends à l’avance que la fin arrive, dès le court 5.', 'You hear the ending coming from the short 5.']],
[['Je termine une chanson de huit mesures sur le 1, avec un court 5.', 'I finish an eight-bar song on the 1 with a short 5.'], ['Je termine aussi sur le 4, et je reconnais la différence.', 'I also finish on the 4, and I can tell the difference.']]))

out.push(mk(67, ['Trouver une harmonie de ténor : une voix une tierce plus bas que la mélodie.', 'Find a tenor harmony: a voice a third below the melody.'], [
  { t: ['Écoute d’abord', 'Listen first'], x: [
    'Une harmonie de ténor est une deuxième voix, souvent une tierce sous la mélodie, jouée par le second violon. Si tu as un enregistrement de duo de violons cadiens, écoute-le deux fois : une fois pour la mélodie, une fois pour la deuxième voix. Ne la copie pas : repère seulement qu’elle suit la mélodie à distance. Sinon, passe à l’étape suivante.',
    'A tenor harmony is a second voice, often a third below the melody, played by the second fiddle. If you have a recording of a Cajun fiddle duo, listen twice: once for the melody, once for the second voice. Do not copy it: just notice that it follows the melody at a distance. Otherwise move to the next step.'], min: 4 },
  { t: ['Les notes une tierce plus bas', 'The notes a third lower'], x: [
    'Mélodie des quatre premières mesures du « Two-step de la troisième semaine » (jour 21) : Do Ré Mi Sol Fa La Sol Mi. Une tierce plus bas dans la gamme de Do, cela donne : La Si Do Mi Ré Fa Mi Do. Joue cette deuxième voix seule, lentement, avec le bourdon de Do ; écoute-la bien.',
    'Melody of the first four bars of the “Week-Three Two-Step” (day 21): C D E G F A G E. A third lower in the C scale, that gives: A B C E D F E C. Play this second voice alone, slowly, with the C drone; listen to it carefully.'], min: 7, extra: { notes: { cle: 'C', notes: [57, 59, 60, 64, 62, 65, 64, 60], titre: 'Harmonie une tierce plus bas', titreEn: 'Harmony a third below' }, bourdon: [60] } },
  { t: ['Les deux voix ensemble', 'Both voices together'], x: [
    'Lance le « Two-step de la troisième semaine » à 70 avec la mélodie qui joue, et joue ta voix par-dessus, mesures 1 à 4 seulement. Quand les deux voix tombent ensemble, tu dois entendre « une seule chose plus épaisse », sans battement. Puis monte la voix : trouve toi-même les tierces des mesures 5 à 8.',
    'Start the “Week-Three Two-Step” at 70 with the melody playing, and play your voice over it, bars 1 to 4 only. When the two voices fall together you should hear “one thicker thing”, without beating. Then work out the thirds of bars 5 to 8 yourself.'], min: 8, extra: { metro: { bpm: 70, mesure: 2 } } },
  { t: ['Quand la tierce ne va pas', 'When the third does not fit'], x: [
    'Certaines notes, pendant un accord de Sol, sonnent faux une tierce plus bas. Cherche-les : écris-en trois, et propose une autre note (une tierce au-dessus, ou la note de l’accord la plus proche).',
    'Some notes, during a G chord, sound wrong a third lower. Find them: write down three, and propose another note (a third above, or the nearest chord note).'], min: 4 },
], [['Les deux lignes se mélangent bien : tu n’entends plus laquelle est laquelle.', 'The two lines blend well: you can no longer tell which is which.']],
[['J’ai trouvé et joué les tierces des quatre premières mesures.', 'I found and played the thirds for the first four bars.'], ['J’ai repéré au moins trois notes où la tierce du bas ne marche pas.', 'I spotted at least three notes where the lower third does not work.']]))

out.push(mk(68, ['Reconnaître le 1, le 4 et le 5 à l’oreille, avec et sans la grille.', 'Recognise the 1, 4 and 5 by ear, with and without the chart.'], [
  { t: ['Do contre trois accords', 'C against three chords'], x: [
    'Lance le bourdon de Do et joue un Do long : stable, rien ne bouge. Imagine maintenant que l’accord change sous ce Do : contre le Fa (doubling La + Do) il est « chez lui » mais ouvert ; contre le Sol (Sol + Si) il est tendu. Joue les deux doublings à tour de rôle en gardant le Do en tête, et écris un mot pour décrire chaque couleur.',
    'Start the C drone and play a long C: stable, nothing moves. Now imagine the chord changing under that C: against the F (A + C doubling) it is “at home” but open; against the G (G + B) it is tense. Play the two doublings in turn while keeping the C in your head, and write one word describing each colour.'], min: 6, extra: { bourdon: [60] } },
  { t: ['Nomme l’accord', 'Name the chord'], x: [
    'Ouvre « Les trois triades » (jour 20). Coupe la mélodie, garde l’accompagnement, et cache la ligne d’accords avec une feuille. Écoute un tour (huit mesures) et écris les chiffres 1, 4, 5 pour chaque mesure. Réécoute pour corriger, puis soulève la feuille : compte tes erreurs. Refais avec la valse.',
    'Open “The Three Triads” (day 20). Mute the melody, keep the backing, and cover the chord line with a sheet. Listen to one round (eight bars) and write 1, 4 or 5 for each bar. Listen again to correct, then lift the sheet: count your mistakes. Repeat with the waltz.'], min: 10 },
  { t: ['Le même jeu avec ton violon', 'The same game with your fiddle'], x: [
    'Réécoute et seconde en même temps : à chaque mesure, joue le doubling que tu crois entendre, sans regarder. Si tu te trompes, corrige à la mesure suivante, sans t’arrêter. Objectif : au plus deux erreurs sur huit mesures.',
    'Listen and second at the same time: in each bar, play the doubling you think you hear, without looking. If you get it wrong, correct at the next bar without stopping. Goal: at most two mistakes in eight bars.'], min: 5 },
], [['Tu reconnais le 5 qui « demande » le 1, même sans la mélodie.', 'You recognise the 5 “asking for” the 1, even without the melody.']],
[['J’ai trouvé les accords d’un tour complet à l’oreille avec deux erreurs ou moins.', 'I found the chords of a whole round by ear with two mistakes or fewer.']]))

out.push(mk(69, ['Glisser la main d’un accord à l’autre au lieu de sauter.', 'Slide the hand from one chord to the next instead of jumping.'], [
  dblStep('C', 'Pose le doubling de Do (Do + Mi). Retiens la position : le pouce détendu, le poignet droit. C’est ton point de départ.', 'Place the C doubling (C + E). Remember the position: relaxed thumb, straight wrist. This is your starting point.', 2),
  dblStep('G', 'Pose le doubling de Sol (Sol + Si). Regarde l’écran : les doigts bougent d’une corde, pas plus.', 'Place the G doubling (G + B). Watch the screen: the fingers move by one string, no more.', 2),
  { t: ['Le glissé', 'The slide'], x: [
    'Joue Do, puis Sol, sans lever la main : les doigts restent en contact léger avec la corde, la main glisse comme un bloc. Fais une mesure par accord à 60, vingt fois. Écoute : le glissé doit presque disparaître. Si tu entends un « miaou » trop fort, glisse plus vite ou allège la pression.',
    'Play C, then G, without lifting the hand: the fingers stay in light contact with the string, the hand slides as one block. One bar per chord at 60, twenty times. Listen: the slide should almost disappear. If you hear a loud “meow”, slide faster or lighten the pressure.'], min: 8, extra: { metro: { bpm: 60, mesure: 2 } } },
  { t: ['Dans une chanson', 'In a song'], x: [
    'Sur le « Two-step de la troisième semaine » (jour 21, Do Do Fa Do Do Sol Sol Do), seconde en archet rythmique à 72. Glisse pour chaque changement : repère celui qui est le plus dur (en général Fa vers Do) et refais-le dix fois isolé, avant de le replacer dans la chanson.',
    'On the “Week-Three Two-Step” (day 21, C C F C C G G C), second with rhythm bow at 72. Slide at each change: find the hardest one (usually F to C) and repeat it ten times in isolation before putting it back into the song.'], min: 9, extra: { metro: { bpm: 72, mesure: 2 } } },
], [['Le glissé est court et naturel : tu ne l’entends presque pas.', 'The slide is short and natural: you barely hear it.']],
[['Mes changements d’accord sont fluides, sans trou entre les accords.', 'My chord changes are smooth, with no gap between the chords.']]))

out.push(mk(70, ['Réviser la semaine : formes, comptage, fins, glissés, dans une chanson complète enregistrée.', 'Review the week: forms, counting, endings, slides, in a full recorded song.'], [
  { t: ['Échauffement', 'Warm-up'], x: [
    'Gamme de Do sur toute l’étendue à 72, avec le bourdon, une note par coup d’archet. Écoute chaque note contre le bourdon.',
    'C scale over the full range at 72, with the drone, one note per bow. Listen to each note against the drone.'], min: 3, extra: { gamme: { cle: 'C', de: 55, a: 79 }, bourdon: [60], metro: { bpm: 72, mesure: 2 } } },
  { t: ['Trois passages', 'Three passes'], x: [
    'Prends le « Two-step de la troisième semaine » (jour 21) avec l’accompagnement. Passage 1 : seconde en comptant les mesures tout haut. Passage 2 : seconde en glissant et en préparant chaque accord. Passage 3 : seconde avec un vrai finale (court 5, puis 1 tenu). Une seule chose à améliorer par passage.',
    'Take the “Week-Three Two-Step” (day 21) with the backing. Pass 1: second while counting bars aloud. Pass 2: second while sliding and preparing each chord. Pass 3: second with a real ending (short 5, then held 1). One single thing to improve per pass.'], min: 10, extra: { metro: { bpm: 72, mesure: 2 } } },
  { t: ['Enregistre-toi', 'Record yourself'], x: [
    'Enregistre le passage 3 avec ton téléphone, puis réécoute en cherchant trois choses : les changements sont-ils sur le un ? le glissé s’entend-il ? la fin sonne-t-elle finie ? Note une phrase de ce que tu veux changer demain.',
    'Record pass 3 with your phone, then listen back for three things: are the changes on the one? can you hear the slide? does the ending sound finished? Write one sentence about what to change tomorrow.'], min: 7 },
], [['Ta fin sonne comme une vraie fin, pas comme un arrêt.', 'Your ending sounds like a real ending, not a stop.']],
[['J’ai secondé huit mesures trois fois sans m’arrêter.', 'I seconded eight bars three times without stopping.'], ['J’ai réécouté mon enregistrement et nommé une chose à améliorer.', 'I listened to my recording and named one thing to improve.']]))

// ---------- Semaine 11 : lead et segondeur ----------
out.push(inKey(mk(71, ['Apprendre le lead du « Grand two-step » en deux parties de huit mesures, A puis B.', 'Learn the lead of “The Big Two-Step” in two eight-bar parts, A then B.'], [
  { t: ['Gamme et bourdon', 'Scale and drone'], x: ['Gamme de Do sur toute l’étendue, à 72, avec le bourdon. Écoute surtout les notes du haut (Mi, Sol).', 'C scale over the full range, at 72, with the drone. Listen especially to the top notes (E, G).'], min: 4, extra: { gamme: { cle: 'C', de: 55, a: 79 }, bourdon: [60], metro: { bpm: 72, mesure: 2 } } },
  { t: ['Partie A : mesures 1 à 8', 'Part A: bars 1 to 8'], x: [
    'Ouvre « Grand two-step » (menu Jour, 71). La partie A commence Mi Sol, Do Sol : elle monte par arpèges de Do (Do-Mi-Sol), puis passe par Fa et Sol aux mesures 5 à 7. Apprends deux mesures à la fois, très lentement (60), avec la mélodie qui joue ; joue chaque groupe quatre fois avant de passer au suivant. Quand tu as les 8 mesures, joue-les deux fois de suite.',
    'Open “The Big Two-Step” (Day menu, 71). Part A starts E G, C G: it climbs through C arpeggios (C-E-G), then passes through F and G in bars 5 to 7. Learn two bars at a time, very slowly (60), with the melody playing; play each group four times before the next. Once you have all 8 bars, play them twice in a row.'], min: 7, extra: { metro: { bpm: 60, mesure: 2 } } },
  { t: ['Partie B : mesures 9 à 16', 'Part B: bars 9 to 16'], x: [
    'La partie B démarre plus haut, sur le Do aigu, et redescend. Même méthode : deux mesures, quatre fois, à 60. Les mesures 13 et 14 (Fa La, Sol Mi) sont les plus délicates : joue-les dix fois seules.',
    'Part B starts higher, on the high C, and comes back down. Same method: two bars, four times, at 60. Bars 13 and 14 (F A, G E) are the trickiest: play them ten times on their own.'], min: 7, extra: { metro: { bpm: 60, mesure: 2 } } },
  { t: ['A + B sans arrêt', 'A + B without stopping'], x: [
    'Joue les 16 mesures à 72 en lead, avec l’accompagnement. Si tu te trompes, rattrape-toi à la barre suivante, sans t’arrêter. Réussi quand tu as fait deux tours complets d’affilée, mesure 16 comprise, sans regarder la grille.',
    'Play all 16 bars at 72 as lead, with the backing. If you slip, catch up at the next bar line, without stopping. Done when you have played two complete rounds in a row, bar 16 included, without looking at the chart.'], min: 6, extra: { metro: { bpm: 72, mesure: 2 } } },
], [['La transition A vers B (mesure 8 vers 9) sonne comme une montée naturelle.', 'The move from A to B (bar 8 to 9) sounds like a natural lift.']],
[['Je joue les 16 mesures du Grand two-step à 72, sans m’arrêter.', 'I play the 16 bars of the Big Two-Step at 72, without stopping.']]), 'C'))

out.push(mk(72, ['Seconder le « Grand two-step » en trois accords, en archet rythmique.', 'Second “The Big Two-Step” on three chords with rhythm bow.'], [
  dblStep('C', 'Do + Mi, ensemble. Le Do revient le plus souvent : les mesures 1 à 4, 9 et 10, et 14 sont sur Do.', 'C + E, together. The C returns most often: bars 1 to 4, 9, 10 and 14 are on C.', 2),
  dblStep('F', 'La + Do. Le Fa arrive aux mesures 5, 6, 11 et 13.', 'A + C. The F arrives at bars 5, 6, 11 and 13.', 2),
  dblStep('G', 'Sol + Si. Le Sol tombe aux mesures 7, 12 et 15.', 'G + B. The G falls on bars 7, 12 and 15.', 2),
  { t: ['Le geste : archet rythmique', 'The stroke: rhythm bow'], x: [
    'Bas–haut en croches sur le doubling, comme on gratte une guitare : le bas sur le temps (plus fort), le haut entre les temps. Garde le poignet souple. Joue une mesure par accord à 80, d’abord sur Do seul pendant deux minutes, puis Do–Fa–Do–Sol.',
    'Down–up in eighth notes on the doubling, like strumming a guitar: down on the beat (stronger), up between beats. Keep the wrist loose. Play one bar per chord at 80, first on C alone for two minutes, then C–F–C–G.'], min: 6, extra: { metro: { bpm: 80, mesure: 2 } } },
  { t: ['Avec la chanson', 'With the song'], x: [
    'Ouvre le « Grand two-step » (jour 71). Mets le menu « Segondeur » sur « Archet rythmique » pour entendre l’exemple, puis remets-le sur « Aucun » et joue-le toi-même. Les accords des 16 mesures : Do Do Do Do Fa Fa Sol Do, Do Do Fa Sol Fa Do Sol Do. Deux tours en gardant la mélodie, deux tours sans. Test : les changements tombent sur le un, sans que tu suives l’exemple à l’oreille.',
    'Open “The Big Two-Step” (day 71). Set the “Segondeur” menu to “Rhythm bow” to hear the example, then set it back to “None” and play it yourself. The chords for all 16 bars: C C C C F F G C, C C F G F C G C. Two rounds with the melody on, two without. Test: the changes land on the one, without you following the example by ear.'], min: 10 },
], [['Les changements d’accord tombent sur le un de la mesure.', 'The chord changes land on the one of the bar.']],
[['Je seconde les 16 mesures en archet rythmique sans regarder la grille.', 'I second all 16 bars with rhythm bow without looking at the chart.']]))

out.push(inKey(mk(73, ['Apprendre le lead de la « Grande valse » en deux parties, avec le un lourd.', 'Learn the lead of “The Big Waltz” in two parts, with a heavy one.'], [
  { t: ['Gamme en trois', 'Scale in threes'], x: ['Joue la gamme de Do, de Sol grave à Sol aigu, par groupes de trois notes, à 90 : le un plus fort, deux et trois plus légers. Le bourdon t’aide à rester juste.', 'Play the C scale, from the low G up to the high G, in groups of three notes at 90: a stronger one, lighter two and three. The drone keeps you in tune.'], min: 4, extra: { gamme: { cle: 'C', de: 55, a: 79 }, bourdon: [60], metro: { bpm: 90, mesure: 3 } } },
  { t: ['Partie A : mesures 1 à 8', 'Part A: bars 1 to 8'], x: [
    'Ouvre « Grande valse » (menu Jour, 73). Les mesures 2 et 6 ont une note longue sur le temps 1 (Mi aigu) : tiens-la avec un archet qui roule doucement, puis lâche vers le temps 3. Apprends deux mesures à la fois à 70, quatre fois chaque.',
    'Open “The Big Waltz” (Day menu, 73). Bars 2 and 6 have a long note on beat 1 (the high E): hold it with a gently rolling bow and release toward beat 3. Learn two bars at a time at 70, four times each.'], min: 7, extra: { metro: { bpm: 70, mesure: 3 } } },
  { t: ['Partie B : mesures 9 à 16', 'Part B: bars 9 to 16'], x: [
    'La partie B est plus calme : la mélodie se promène autour de La et de Sol, avant la montée finale de la mesure 13 (Sol Si Ré). Même méthode, à 70. Compte « UN-deux-trois » tout haut au premier passage.',
    'Part B is calmer: the melody wanders around A and G before the final rise at bar 13 (G B D). Same method, at 70. Count “ONE-two-three” aloud on the first pass.'], min: 7, extra: { metro: { bpm: 70, mesure: 3 } } },
  { t: ['Un deuxième regard : le two-step du pont', 'A second look: the bridge two-step'], x: [
    'Dans les onglets de la page Chansons, essaie « Two-step du pont » (même jour). Joue seulement la partie A, à 72, puis reviens à la valse. Tu sens le passage du deux au trois : le un ne pèse pas de la même façon.',
    'In the Songs page tabs, try “Bridge Two-Step” (same day). Play only part A, at 72, then come back to the waltz. Feel the switch from two to three: the one does not weigh the same.'], min: 4, extra: { metro: { bpm: 72, mesure: 2 } } },
  { t: ['A + B sans arrêt', 'A + B without stopping'], x: [
    'Joue la grande valse à 80 en lead, deux tours complets. Réussi quand le un reste plus lourd que deux et trois, du début à la fin.',
    'Play the big waltz at 80 as lead, two complete rounds. Done when the one stays heavier than two and three from start to finish.'], min: 4, extra: { metro: { bpm: 80, mesure: 3 } } },
], [['La valse balance : on sent le un qui tombe.', 'The waltz sways: you feel the one fall.']],
[['Je joue les 16 mesures de la grande valse à 80 sans m’arrêter.', 'I play the 16 bars of the big waltz at 80 without stopping.']]), 'C'))

out.push(mk(74, ['Seconder la « Grande valse » avec le pied : trois – UN – deux – trois.', 'Second “The Big Waltz” with the foot: three – ONE – two – three.'], [
  { t: ['Le pied d’abord', 'The foot first'], x: [
    'Assis, sans violon : tape le pied seulement sur le UN d’une valse à 96 (métronome à 3 temps). Dis « trois – UN – deux » en comptant : le « trois » est le temps léger juste avant le UN. Une minute, jusqu’à ce que ton pied n’ait plus besoin du clic.',
    'Seated, without the fiddle: tap your foot only on the ONE of a waltz at 96 (3-beat metronome). Say “three – ONE – two” as you count: the “three” is the light beat just before the ONE. One minute, until your foot no longer needs the click.'], min: 3, extra: { metro: { bpm: 96, mesure: 3 } } },
  dblStep('C', 'Les mesures 1, 2, 5, 6, 8, 10 et 12 de la grande valse sont sur Do ou y reviennent : joue le doubling en trois coups, le premier plus fort.', 'Bars 1, 2, 5, 6, 8, 10 and 12 of the big waltz are on C or return to it: play the doubling in three strokes, the first stronger.', 2),
  dblStep('G', 'Les mesures 4, 7 et 13 à 15 sont sur Sol. Joue trois coups, le premier plus fort, puis passe à Do sur le UN suivant.', 'Bars 4, 7 and 13 to 15 are on G. Play three strokes, the first stronger, then move to C on the next ONE.', 2),
  { t: ['Archet rythmique en trois', 'Rhythm bow in three'], x: [
    'Six croches par mesure : bas–haut, bas–haut, bas–haut, le premier bas plus fort. Pied sur le UN. Accords de la grande valse (jour 73) : Do Do Fa Sol, Do Do Sol Do, Fa Do Fa Do, Sol Sol Sol Do. Joue deux tours à 96.',
    'Six eighth notes per bar: down–up, down–up, down–up, the first down stronger. Foot on the ONE. Chords of the big waltz (day 73): C C F G, C C G C, F C F C, G G G C. Play two rounds at 96.'], min: 8, extra: { metro: { bpm: 96, mesure: 3 } } },
  { t: ['Avec la chanson', 'With the song'], x: [
    'Ouvre la « Grande valse » (jour 73). Menu « Segondeur » : écoute « Archet rythmique », puis « Basse droite », puis remets « Aucun » et joue-les toi-même. Tu seconds avec le pied et l’archet ensemble, sans regarder la grille. Réussi quand tu tiens trois tours à 96 sans que le pied et l’archet se disputent.',
    'Open “The Big Waltz” (day 73). “Segondeur” menu: listen to “Rhythm bow”, then “Straight bassing”, then set it back to “None” and play them yourself. You second with foot and bow together, without looking at the chart. Done when you hold three rounds at 96 with the foot and bow not fighting each other.'], min: 8 },
], [['Le pied et l’archet tombent exactement ensemble sur le UN.', 'Foot and bow land exactly together on the ONE.']],
[['Je seconde seize mesures de valse en tapant du pied sans ralentir.', 'I second sixteen waltz bars while tapping my foot without slowing down.']]))

out.push(mk(75, ['Passer le lead et le second toutes les quatre mesures sur la même chanson.', 'Pass the lead and the second back and forth every four bars on the same song.'], [
  { t: ['Les rôles séparés', 'The roles separately'], x: [
    'Ouvre « Two-step à tour de rôle » (jour 75, 8 mesures, Do Do Sol Sol Do Do Sol Do). Les mesures 1 à 4 sont l’appel, 5 à 8 la réponse. Joue d’abord le lead tout seul deux fois, à 72, puis seconde-le deux fois avec l’exemple « Basse droite » du menu Segondeur. Les deux rôles doivent être confortables avant de les mélanger.',
    'Open “Take-Turns Two-Step” (day 75, 8 bars, C C G G C C G C). Bars 1 to 4 are the call, 5 to 8 the response. First play the lead alone twice, at 72, then second it twice with the “Straight bassing” example from the Segondeur menu. Both roles must feel comfortable before you mix them.'], min: 7, extra: { metro: { bpm: 72, mesure: 2 } } },
  { t: ['Quatre mesures chacun', 'Four bars each'], x: [
    'Garde la mélodie de l’app en soutien. Mesures 1 à 4 : tu joues la mélodie par-dessus. Mesures 5 à 8 : tu laisses la mélodie à l’application et tu joues le doubling. Au tour suivant, inverse. Quatre tours, sans t’arrêter. Garde l’archet en mouvement pendant le changement : c’est la barre 4→5 qui compte.',
    'Keep the app’s melody as support. Bars 1 to 4: you play the melody on top. Bars 5 to 8: you leave the melody to the app and play the doubling. Next round, swap. Four rounds without stopping. Keep the bow moving during the switch: it is bar 4→5 that counts.'], min: 8, extra: { metro: { bpm: 72, mesure: 2 } } },
  { t: ['Même chose en valse', 'Same thing in waltz'], x: [
    'Ouvre « Valse à tour de rôle » (même jour). Un tour de huit mesures = quatre mesures de lead, quatre de second. Fais quatre tours à 90, en commençant par le second au tour 1.',
    'Open “Take-Turns Waltz” (same day). One eight-bar round = four bars of lead, four of second. Do four rounds at 90, starting as the second in round 1.'], min: 6, extra: { metro: { bpm: 90, mesure: 3 } } },
  { t: ['Défi : sans l’annoncer', 'Challenge: without announcing'], x: [
    'Fais le changement de rôle sans que personne ne l’annonce : repère-le par la barre 4. Si tu joues avec un ami, un seul fait un signe de tête. Réussi quand on ne s’aperçoit pas du changement.',
    'Switch roles without announcing it: spot it by bar 4. If you play with a friend, only one of you gives a nod. Done when the switch goes unnoticed.'], min: 3 },
], [['Le rythme ne bronche pas quand tu changes de rôle.', 'The rhythm does not flinch when you change role.']],
[['Je joue lead puis second sur huit mesures sans m’arrêter à la barre du milieu.', 'I play lead then second over eight bars without stopping at the middle bar.']]))

out.push(inKey(mk(76, ['Jouer le lead puis seconder le « Grand two-step » et la « Grande valse » en Sol.', 'Play the lead then second “The Big Two-Step” and “The Big Waltz” in G.'], [
  { t: ['Gamme de Sol', 'G scale'], x: ['Gamme de Sol sur toute l’étendue, à 72, avec le bourdon de Sol. Écoute le Fa♯ : il doit sonner « tendu » vers le Sol.', 'G scale over the full range, at 72, with the G drone. Listen for the F♯: it should sound “tense” toward the G.'], min: 4, extra: { gamme: { cle: 'G', de: 55, a: 79 }, bourdon: [55], metro: { bpm: 72, mesure: 2 } } },
  { t: ['Lead du two-step', 'Lead of the two-step'], x: [
    'Ouvre « Grand two-step en Sol » (jour 76). Apprends la partie A (mesures 1 à 8) à 60, deux mesures à la fois ; la partie B (9 à 16) ensuite. Le Fa♯ apparaît à la mesure 15 : prépare le doigt avant. Joue les 16 mesures à 72 deux fois.',
    'Open “The Big Two-Step in G” (day 76). Learn part A (bars 1 to 8) at 60, two bars at a time; then part B (9 to 16). The F♯ appears at bar 15: prepare the finger beforehand. Play all 16 bars at 72 twice.'], min: 8, extra: { metro: { bpm: 72, mesure: 2 } } },
  dblStep('G', 'En Sol : 1 = Sol, 4 = Do, 5 = Ré. Sol + Si d’abord.', 'In G: 1 = G, 4 = C, 5 = D. G + B first.', 2),
  dblStep('C', 'Le 4 de Sol est Do (Do + Mi).', 'The 4 of G is C (C + E).', 2),
  dblStep('D', 'Le 5 de Sol est Ré : Ré + La. Joue-le court avant de revenir au Sol.', 'The 5 of G is D: D + A. Play it short before returning to the G.', 2),
  { t: ['Seconder en Sol', 'Seconding in G'], x: [
    'Mets le menu « Segondeur » sur « Archet rythmique » pour entendre l’exemple, puis seconde le grand two-step en Sol, deux tours (accords Sol Sol Sol Sol Do Sol Ré Sol, Sol Sol Sol Do Do Sol Ré Sol). Ensuite fais pareil avec la « Grande valse en Sol », en basse droite, avec le pied.',
    'Set the “Segondeur” menu to “Rhythm bow” to hear the example, then second the big two-step in G, two rounds (chords G G G G C G D G, G G G C C G D G). Then do the same with “The Big Waltz in G”, in straight bassing, with the foot.'], min: 8 },
], [['Le Fa♯ du lead est juste : il tire vers le Sol.', 'The lead’s F♯ is in tune: it pulls toward the G.']],
[['Je joue le lead puis le second du two-step en Sol, sans m’arrêter.', 'I play the lead then the second of the G two-step without stopping.'], ['Je seconde aussi la valse en Sol avec le pied.', 'I also second the G waltz with my foot.']]), 'G'))

out.push(inKey(mk(77, ['Jouer le lead puis seconder le « Grand two-step » et la « Grande valse » en Fa.', 'Play the lead then second “The Big Two-Step” and “The Big Waltz” in F.'], [
  { t: ['Gamme de Fa', 'F scale'], x: ['Gamme de Fa sur toute l’étendue, à 72, avec le bourdon de Fa. Le Si♭ est bas : il doit sonner juste contre le Fa.', 'F scale over the full range, at 72, with the F drone. The B♭ is low: it should sound in tune against the F.'], min: 4, extra: { gamme: { cle: 'F', de: 53, a: 77 }, bourdon: [53], metro: { bpm: 72, mesure: 2 } } },
  { t: ['Lead du two-step', 'Lead of the two-step'], x: [
    'Ouvre « Grand two-step en Fa » (jour 77). Même méthode : partie A à 60, deux mesures à la fois, puis la B. Le Si♭ arrive aux mesures 5, 11 et 14 : place le premier doigt bas, près du sillet. Joue les 16 mesures à 72 deux fois.',
    'Open “The Big Two-Step in F” (day 77). Same method: part A at 60, two bars at a time, then B. The B♭ arrives at bars 5, 11 and 14: set the first finger low, close to the nut. Play all 16 bars at 72 twice.'], min: 8, extra: { metro: { bpm: 72, mesure: 2 } } },
  dblStep('F', 'En Fa : 1 = Fa (La + Do), 4 = Si♭ (Si♭ + Ré), 5 = Do (Do + Mi). Commence par le Fa.', 'In F: 1 = F (A + C), 4 = B♭ (B♭ + D), 5 = C (C + E). Start with F.', 2),
  dblStep('Bb', 'Le doubling de Si♭ se joue sur la corde de Fa et celle de Do : Si♭ + Ré.', 'The B♭ doubling is played on the F and C strings: B♭ + D.', 2),
  dblStep('C', 'Le 5 de Fa est Do : Do + Mi, le même doubling que le 1 de Do.', 'The 5 of F is C: C + E, the same doubling as the 1 of C.', 2),
  { t: ['Seconder en Fa', 'Seconding in F'], x: [
    'Menu « Segondeur » : écoute « Archet rythmique », puis seconde le grand two-step en Fa, deux tours (accords Fa Fa Fa Fa Si♭ Fa Do Fa, Fa Fa Si♭ Fa Fa Si♭ Do Fa). Ensuite la « Grande valse en Fa » en basse droite avec le pied. Remarque quel doubling est le plus dur à placer.',
    '“Segondeur” menu: listen to “Rhythm bow”, then second the big two-step in F, two rounds (chords F F F F B♭ F C F, F F B♭ F F B♭ C F). Then “The Big Waltz in F” in straight bassing with the foot. Note which doubling is the hardest to place.'], min: 8 },
], [['Le Si♭ est bas et juste : la gamme de Fa sonne comme du Fa.', 'The B♭ is low and in tune: the F scale sounds like F.']],
[['Je joue le lead puis le second du two-step en Fa, sans m’arrêter.', 'I play the lead then the second of the F two-step without stopping.'], ['Je sais quel doubling de Fa est mon point faible.', 'I know which F doubling is my weak spot.']]), 'F'))

// ---------- Semaine 12 : à l'oreille et avec l'accordéon ----------
out.push(mk(78, ['Trouver la tonalité d’une chanson à l’oreille en trouvant la note « maison ».', 'Find the key of a song by ear by finding the “home” note.'], [
  { t: ['La note maison', 'The home note'], x: [
    'Ouvre « Pratique avec une chanson ». Coupe l’accompagnement, garde la mélodie seule. Écoute la dernière note de la chanson : c’est la maison, celle où la mélodie se pose. Fredonne-la, puis cherche-la sur le violon avec les cordes à vide (Fa, Do, Sol, Ré). Essaie avec les chansons des jours 21 (Do), 76 (Sol) et 77 (Fa) sans lire leur titre.',
    'Open “Practice with a song”. Turn off the backing, keep the melody alone. Listen to the last note of the song: that is home, the one the melody settles on. Hum it, then look for it on the fiddle with the open strings (F, C, G, D). Try the songs of days 21 (C), 76 (G) and 77 (F) without reading their titles.'], min: 6 },
  { t: ['Contre le bourdon de Do', 'Against the C drone'], x: [
    'Lance le bourdon de Do et rejoue la mélodie d’une chanson du jour 21 en fredonnant. Si la maison est Do, rien ne bat contre le bourdon.',
    'Start the C drone and replay a song from day 21 while humming. If home is C, nothing beats against the drone.'], min: 3, extra: { bourdon: [60] } },
  { t: ['Contre le bourdon de Sol', 'Against the G drone'], x: [
    'Même test avec le bourdon de Sol et une chanson du jour 76. Si la maison est Sol, tu entends le Fa♯ « se résoudre » en Sol.',
    'Same test with the G drone and a song from day 76. If home is G, you hear the F♯ “resolve” to G.'], min: 3, extra: { bourdon: [55], gamme: { cle: 'G', de: 55, a: 67 } } },
  { t: ['Contre le bourdon de Fa', 'Against the F drone'], x: [
    'Même test avec le bourdon de Fa et une chanson du jour 77. Le Si♭ doit sonner calme contre le Fa.',
    'Same test with the F drone and a song from day 77. The B♭ should sound calm against the F.'], min: 3, extra: { bourdon: [53], gamme: { cle: 'F', de: 53, a: 65 } } },
  { t: ['Le défi', 'The challenge'], x: [
    'Choisis trois jours au hasard dans le menu Jour de la page Chansons (dé ou pièce : 21, 28, 35, 76, 77). Pour chacun, écoute la mélodie sans regarder titre ni accords, devine la tonalité en moins d’une minute, puis vérifie. Objectif : trois sur trois.',
    'Pick three days at random in the Day menu of the Songs page (dice or coins: 21, 28, 35, 76, 77). For each, listen to the melody without looking at title or chords, guess the key in under a minute, then check. Goal: three out of three.'], min: 6 },
], [['La note maison te donne un sentiment de repos, comme poser un objet.', 'The home note gives a feeling of rest, like setting an object down.']],
[['J’ai trouvé la tonalité de trois chansons sans regarder leur titre.', 'I found the key of three songs without looking at their titles.']]))

out.push(mk(79, ['Entendre le pousser-tirer de l’accordéon en Do : Do en poussant, Sol en tirant.', 'Hear the push-pull of the C accordion: C on the push, G on the pull.'], [
  dblStep('C', 'Poussée : c’est l’accord de Do à la main gauche de l’accordéon. Ton doubling : Do + Mi.', 'Push: this is the C chord on the accordion’s left hand. Your doubling: C + E.', 2),
  dblStep('G', 'Tirée : c’est l’accord de Sol. Ton doubling : Sol + Si.', 'Pull: this is the G chord. Your doubling: G + B.', 2),
  { t: ['Pousse, tire', 'Push, pull'], x: [
    'Dis « pousse » pour Do, « tire » pour Sol, à voix haute, en jouant un doubling par mesure, à 66. Alterne : pousse, tire, pousse, tire, quatre fois. Puis change l’ordre : pousse, pousse, tire, pousse, tire, tire, pousse, tire. Réussi sans te tromper de mot.',
    'Say “push” for C and “pull” for G aloud while playing one doubling per bar at 66. Alternate: push, pull, push, pull, four times. Then change the order: push, push, pull, push, pull, pull, push, pull. Done when you never say the wrong word.'], min: 6, extra: { metro: { bpm: 66, mesure: 2 } } },
  { t: ['Suivre la chanson', 'Follow the song'], x: [
    'Page Chansons, menu Jour : 17 (« Triade de Do en two-step », Do presque partout et un Sol à la mesure 7). Coupe la mélodie. Pendant que l’accompagnement joue, ouvre et ferme une main imaginaire : poussée (Do) ou tirée (Sol), puis joue le doubling correspondant. À la fin d’un tour, dis à quelle mesure tu as entendu la tirée.',
    'Songs page, Day menu: 17 (“C Triad Two-Step”, C almost everywhere and a G at bar 7). Mute the melody. While the backing plays, open and close an imaginary hand: push (C) or pull (G), then play the matching doubling. At the end of a round, say at which bar you heard the pull.'], min: 7 },
  { t: ['Avec le Fa', 'With the F'], x: [
    'Page Chansons, menu Jour : 21 (Do Do Fa Do Do Sol Sol Do). Le Fa est une autre touche, une autre couleur : ton ami te dira où elle est sur son accordéon. Joue La + Do pour le Fa et écoute-le : tu dois pouvoir dire, sans voir, quand il remplace le Do.',
    'Songs page, Day menu: 21 (C C F C C G G C). The F is another button, another colour: your friend will tell you where it is on his accordion. Play A + C for the F and listen to it: you should be able to tell, without looking, when it replaces the C.'], min: 6 },
], [['Tu entends l’accordéon changer de sens : la poussée pose, la tirée tend.', 'You hear the accordion change direction: the push settles, the pull tenses.']],
[['Je suis le pousser-tirer d’une chanson à l’oreille, sans me tromper de mot.', 'I follow a song’s push-pull by ear without saying the wrong word.']]))

out.push(mk(80, ['Répondre à des phrases à l’oreille, de deux à quatre mesures, sur cinq notes.', 'Echo phrases by ear, from two to four bars, on five notes.'], [
  { t: ['Écho de deux mesures', 'Two-bar echo'], x: [
    'Phrase A, sur la pentatonique de Do (Do Ré Mi Sol La) : Mi Sol La Sol, Mi Ré Do. Écoute-la sur l’écran, joue-la d’abord en regardant, puis les yeux fermés ; recommence jusqu’à ce que trois essais d’affilée soient sans faute.',
    'Phrase A, on the C pentatonic (C D E G A): E G A G, E D C. Listen to it on screen, play it first while looking, then with eyes closed; repeat until three attempts in a row are flawless.'], min: 7, extra: { notes: { cle: 'C', notes: [64, 67, 69, 67, 64, 62, 60], titre: 'Phrase A : Mi Sol La Sol Mi Ré Do', titreEn: 'Phrase A: E G A G E D C' }, bourdon: [60] } },
  { t: ['Écho de quatre mesures', 'Four-bar echo'], x: [
    'Phrase B : Do Ré Mi Sol La Sol Mi Ré Mi Do. Même méthode : écoute, joue en regardant, puis sans regarder. Si tu perds une note, ne recommence pas depuis le début : trouve-la à l’oreille.',
    'Phrase B: C D E G A G E D E C. Same method: listen, play while looking, then without looking. If you lose a note, do not restart from the beginning: find it by ear.'], min: 6, extra: { notes: { cle: 'C', notes: [60, 62, 64, 67, 69, 67, 64, 62, 64, 60], titre: 'Phrase B : Do Ré Mi Sol La Sol Mi Ré Mi Do', titreEn: 'Phrase B: C D E G A G E D E C' }, bourdon: [60] } },
  { t: ['Appel et réponse', 'Call and response'], x: [
    'Invente une phrase de deux mesures sur ces cinq notes (c’est l’appel), puis une réponse qui finit sur Do. Comme au jour 41 : l’appel finit « en l’air » (Mi ou Sol), la réponse « à la maison » (Do). Fais cinq paires différentes, à 66, avec le bourdon.',
    'Invent a two-bar phrase on those five notes (the call), then a response that ends on C. As on day 41: the call ends “in the air” (E or G), the response “at home” (C). Make five different pairs, at 66, with the drone.'], min: 7, extra: { metro: { bpm: 66, mesure: 2 }, bourdon: [60] } },
  { t: ['Sans écran', 'Without the screen'], x: [
    'Fredonne une phrase de ton choix, puis trouve-la sur le violon sans regarder l’écran. Compte les essais : vise cinq ou moins.',
    'Hum a phrase of your own, then find it on the fiddle without looking at the screen. Count your attempts: aim for five or fewer.'], min: 3 },
], [['Ta phrase revient exactement la même, et tu entends quand elle est fausse.', 'Your phrase comes back exactly the same, and you hear when it is wrong.']],
[['Je répète la phrase B de dix notes sans regarder.', 'I repeat the ten-note phrase B without looking.'], ['J’ai inventé cinq paires appel-réponse.', 'I invented five call-and-response pairs.']]))

out.push(mk(81, ['Simuler une vraie session : une chanson inconnue, sans la grille, de la tonalité à la fin.', 'Simulate a real session: an unknown song, without the chart, from finding the key to the ending.'], [
  { t: ['Les règles du jeu', 'The rules'], x: [
    'Choisis une chanson au hasard dans le menu Jour de la page Chansons (71, 73, 75, 76 ou 77 : lance un dé, relance si tu l’as pratiquée hier). Cache les accords et le titre avec une feuille. La chanson joue en boucle : tu n’as pas le droit d’arrêter ni de reculer. C’est comme à une vraie session : on ne s’arrête pas pour toi.',
    'Pick a song at random from the Day menu of the Songs page (71, 73, 75, 76 or 77: roll a die, re-roll if you practised it yesterday). Cover the chords and title with a sheet. The song loops: you may not stop or go back. This is like a real session: nobody stops for you.'], min: 3 },
  { t: ['Tour 1 : écoute et trouve', 'Round 1: listen and find'], x: [
    'Lance la chanson à son tempo, mélodie et accompagnement. Tu n’as pas le droit de jouer : écoute seulement. Cherche la tonalité (note maison, jour 78) et les accords (1, 4, 5, jour 68). À la fin du tour, écris la tonalité et les accords des mesures 1 à 8.',
    'Start the song at its tempo, melody and backing. You may not play: only listen. Look for the key (home note, day 78) and the chords (1, 4, 5, day 68). At the end of the round, write the key and the chords for bars 1 to 8.'], min: 7 },
  { t: ['Tours 2 et 3 : seconde', 'Rounds 2 and 3: second'], x: [
    'Seconde avec les doublings que tu as trouvés, en coupant la mélodie. Aux tours suivants, rectifie à la volée : si un accord est faux, change-le à la mesure d’après, sans t’arrêter. Termine avec une vraie fin (jour 66).',
    'Second with the doublings you found, muting the melody. In later rounds, correct on the fly: if a chord is wrong, change it at the next bar without stopping. End with a real ending (day 66).'], min: 8 },
  { t: ['Tour 4 : lead', 'Round 4: lead'], x: [
    'Joue la mélodie à l’oreille, avec l’accompagnement. Si tu connais déjà la chanson, c’est facile ; sinon, fais ce que tu peux : trouve la note maison, suis le contour (monte/descend), et laisse tomber les détails. Puis soulève la feuille et compare.',
    'Play the melody by ear, with the backing. If you already know the song it is easy; if not, do what you can: find the home note, follow the contour (up/down), and let go of the details. Then lift the sheet and compare.'], min: 6 },
], [['Tu t’en sors sans la grille : l’oreille a pris le dessus.', 'You get by without the chart: your ear took over.']],
[['J’ai trouvé la tonalité et au moins six accords sur huit à l’oreille.', 'I found the key and at least six chords out of eight by ear.'], ['Je ne me suis pas arrêté une seule fois.', 'I did not stop once.']]))

out.push(mk(82, ['Préparer une vraie session avec ton ami à l’accordéon en Do.', 'Prepare a real session with your friend on the C accordion.'], [
  { t: ['Accorde-toi sur l’accordéon', 'Tune to the accordion'], x: [
    'L’accordéon ne s’accorde pas, c’est ton violon qui s’adapte. Demande à ton ami de tenir un Do (poussée, octave du milieu) : accorde ta corde de Do sur lui jusqu’à ce que les battements disparaissent. Puis accorde les autres cordes sur celle-là, en quintes pures (Fa, Sol, Ré). S’il est un peu haut ou bas par rapport à ton accordeur, suis l’accordéon. Sans ami : accorde au son de l’app, cordes à vide d’abord.',
    'The accordion cannot be retuned, so your fiddle adapts. Ask your friend to hold a C (push, middle octave): tune your C string to it until the beating disappears. Then tune the other strings to that one, in pure fifths (F, G, D). If he is a little sharp or flat against your tuner, follow the accordion. No friend: tune to the app’s sound, open strings first.'], min: 5, extra: { cordes: true } },
  { t: ['Convenez de tout', 'Agree on everything'], x: [
    'Sur une feuille, six lignes à remplir avant de jouer : 1) la chanson et la tonalité (Do, Sol ou Fa ?) ; 2) qui commence, et avec quoi (l’accordéon seul sur deux mesures ?) ; 3) le tempo : tapez-le ensemble au métronome (80 pour un two-step, 96 pour une valse) ; 4) combien de tours ; 5) qui joue le lead à chaque tour ; 6) comment finir (court 5 puis 1, ou fin sur le 4, avec un signe de tête).',
    'On a sheet, six lines to fill in before playing: 1) the song and the key (C, G or F?); 2) who starts, and with what (accordion alone for two bars?); 3) the tempo: tap it together with the metronome (80 for a two-step, 96 for a waltz); 4) how many rounds; 5) who plays lead each round; 6) how to end (short 5 then 1, or a 4 ending, with a nod).'], min: 5, extra: { metro: { bpm: 80, mesure: 2 } } },
  dblStep('C', 'Poussée = accord de Do. Place ce doubling quand ton ami pousse.', 'Push = C chord. Place this doubling when your friend pushes.', 2),
  dblStep('G', 'Tirée = accord de Sol. Place ce doubling quand ton ami tire. Regarde le soufflet : il te dit l’accord avant même que tu l’entendes.', 'Pull = G chord. Place this doubling when your friend pulls. Watch the bellows: they tell you the chord before you even hear it.', 2),
  { t: ['Jouez ensemble', 'Play together'], x: [
    'Tour 1 : le « Grand two-step » (jour 71), lui au lead, toi au second (archet rythmique). Tour 2 : on échange. Tour 3 : la « Grande valse » (jour 73), toi au lead, avec le pied. Terminez comme convenu. Après chaque morceau, dites chacun une chose qui a bien marché et une à ajuster. Sans ami : utilise l’app comme accordéon, avec les mêmes rôles.',
    'Round 1: “The Big Two-Step” (day 71), him on lead, you seconding (rhythm bow). Round 2: swap. Round 3: “The Big Waltz” (day 73), you on lead, with the foot. End as agreed. After each tune, each say one thing that worked and one to adjust. No friend: use the app as the accordion, with the same roles.'], min: 11 },
], [['Vous finissez ensemble, sur la même mesure, sans vous regarder.', 'You finish together, on the same bar, without looking at each other.']],
[['Nous avons réglé les six points avant de jouer.', 'We settled the six points before playing.'], ['J’ai suivi le soufflet de l’accordéon sans me tromper d’accord.', 'I followed the accordion’s bellows without getting a chord wrong.']]))

out.push(mk(83, ['Dernier passage : gammes, pentatoniques, lead et seconding avant l’évaluation.', 'Last run-through: scales, pentatonics, lead and seconding before the assessment.'], [
  { t: ['Gamme de Do', 'C scale'], x: ['Do, toute l’étendue, à 80, une note par coup d’archet, avec le bourdon. Vise zéro note fausse.', 'C, full range, at 80, one note per bow, with the drone. Aim for zero wrong notes.'], min: 3, extra: { gamme: { cle: 'C', de: 55, a: 79 }, bourdon: [60], metro: { bpm: 80, mesure: 2 } } },
  { t: ['Gamme de Sol', 'G scale'], x: ['Sol, toute l’étendue, à 80. Le Fa♯ est toujours juste ?', 'G, full range, at 80. Is the F♯ always in tune?'], min: 3, extra: { gamme: { cle: 'G', de: 55, a: 79 }, bourdon: [55], metro: { bpm: 80, mesure: 2 } } },
  { t: ['Gamme de Fa', 'F scale'], x: ['Fa, toute l’étendue, à 80. Le Si♭ est-il bas et juste ?', 'F, full range, at 80. Is the B♭ low and in tune?'], min: 3, extra: { gamme: { cle: 'F', de: 53, a: 77 }, bourdon: [53], metro: { bpm: 80, mesure: 2 } } },
  { t: ['Pentatonique', 'Pentatonic'], x: ['Pentatonique de Do, aller-retour, puis de Sol et de Fa, à 80.', 'C pentatonic, up and down, then G and F, at 80.'], min: 3, extra: { gamme: { cle: 'C', de: 60, a: 72, type: 'pentatonique' }, bourdon: [60], metro: { bpm: 80, mesure: 2 } } },
  { t: ['Circuit de seconding', 'Seconding circuit'], x: [
    'Avec l’accompagnement de l’app : « Grand two-step » en basse droite (deux tours), puis en archet rythmique (deux tours), puis en shuffle (deux tours) ; ensuite « Grande valse » avec le pied, en basse droite puis en archet rythmique. Note ce qui s’est cassé : c’est ce que tu travailleras demain.',
    'With the app’s backing: “The Big Two-Step” in straight bassing (two rounds), then rhythm bow (two rounds), then shuffle (two rounds); then “The Big Waltz” with the foot, straight bassing then rhythm bow. Write down what broke: that is tomorrow’s work.'], min: 8 },
  { t: ['Lead de mémoire', 'Lead from memory'], x: [
    'Joue le « Grand two-step » en lead, de mémoire, sans mélodie : seulement l’accompagnement. Si un passage échappe, joue-le lentement une fois, puis remets-le dans le tempo.',
    'Play “The Big Two-Step” as lead from memory, without the melody: backing only. If a passage slips, play it slowly once, then put it back in tempo.'], min: 4 },
], [['Tout tient en place sans que tu forces.', 'Everything holds together without strain.']],
[['J’ai identifié ce qui reste fragile pour l’évaluation de demain.', 'I identified what remains fragile before tomorrow’s assessment.']]))

out.push(mk(84, ['Évaluation finale : une liste claire de ce que tu sais jouer, puis la suite du chemin.', 'Final assessment: a clear list of what you can play, then the road ahead.'], [
  { t: ['1. Gammes et pentatoniques', '1. Scales and pentatonics'], x: [
    'Réussi si tu joues Do, Sol et Fa majeur (une octave et demie) puis leurs pentatoniques à 90, une note par coup d’archet, sans note fausse ni arrêt. Fais-le avec le métronome, sans le bourdon la deuxième fois.',
    'Pass if you play C, G and F major (an octave and a half) then their pentatonics at 90, one note per bow, with no wrong note and no stop. Do it with the metronome, without the drone the second time.'], min: 6, extra: { gamme: { cle: 'C', de: 55, a: 79 }, metro: { bpm: 90, mesure: 2 } } },
  { t: ['2. Lead', '2. Lead'], x: [
    'Réussi si tu joues le « Grand two-step » (16 mesures, à 80) et la « Grande valse » (16 mesures, à 90) en lead, de mémoire, avec l’accompagnement seulement, deux tours chacune, sans t’arrêter.',
    'Pass if you play “The Big Two-Step” (16 bars, at 80) and “The Big Waltz” (16 bars, at 90) as lead from memory, with the backing only, two rounds each, without stopping.'], min: 6 },
  { t: ['3. Segondeur', '3. Segondeur'], x: [
    'Réussi si tu secondes le two-step en basse droite, en archet rythmique et en shuffle, et la valse en basse droite et en archet rythmique avec le pied, avec des changements d’accord justes et une vraie fin sur le 1.',
    'Pass if you second the two-step in straight bassing, rhythm bow and shuffle, and the waltz in straight bassing and rhythm bow with the foot, with correct chord changes and a real ending on the 1.'], min: 6 },
  { t: ['4. Oreille et session', '4. Ear and session'], x: [
    'Réussi si, sur une chanson tirée au hasard, tu trouves la tonalité en une minute, note les huit premiers accords avec deux erreurs au plus, et distingues poussée (Do) et tirée (Sol) sur un enregistrement de l’accordéon.',
    'Pass if, on a randomly drawn song, you find the key within a minute, write the first eight chords with at most two errors, and tell push (C) from pull (G) on an accordion recording.'], min: 6 },
  { t: ['Et ensuite ?', 'What next?'], x: [
    'Tu as fini les douze semaines : joue avec ton ami chaque semaine, c’est ce qui te fera le plus progresser. Écoute les violoneux cadiens (par exemple Dewey Balfa ou Dennis McGee) en cherchant le lead, le second, la forme et les fins que tu connais maintenant, sans les copier note à note. Apprends des airs à l’oreille, un par semaine, en les ralentissant. Va à une session ou à un bal. Écris tes propres mélodies. Garde le bourdon et le métronome : 15 minutes par jour valent mieux qu’une heure par semaine.',
    'You have finished the twelve weeks: play with your friend every week, it will help you most. Listen to Cajun fiddlers (for example Dewey Balfa or Dennis McGee), looking for the lead, the second, the form and the endings you now know, without copying them note for note. Learn tunes by ear, one a week, slowing them down. Go to a session or a dance. Write your own melodies. Keep the drone and the metronome: 15 minutes a day beats an hour a week.'], min: 4 },
], [['Tu entends ce que tu as appris dans tout ce que tu écoutes : les formes, les fins, le pousser-tirer.', 'You hear what you have learned in everything you listen to: forms, endings, push-pull.']],
[['Gammes et pentatoniques à 90, sans faute.', 'Scales and pentatonics at 90, without a mistake.'], ['Lead du grand two-step et de la grande valse, de mémoire.', 'Lead of the big two-step and the big waltz, from memory.'], ['Segondeur en trois façons dans le two-step et deux dans la valse.', 'Segondeur in three ways in the two-step and two in the waltz.'], ['Tonalité trouvée à l’oreille, accords et poussée-tirée repérés.', 'Key found by ear, chords and push-pull spotted.'], ['J’ai décidé de ce que je fais la semaine prochaine : un air à l’oreille et une session avec mon ami.', 'I decided what I do next week: one tune by ear and a session with my friend.']]))

export const DAYS_PART: [Day, DayEn][] = out
