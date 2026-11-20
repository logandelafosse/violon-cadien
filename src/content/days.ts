import type { Day } from './types'
import { DAYS_EN as BASE_EN } from './days.en'
import { GEN_DAYS, GEN_DAYS_EN } from './songDays'
import { i18n } from '../i18n.svelte'

const C = { F3: 53, C4: 60, G4: 67, D5: 74 }
const tune = 'Accorde le violon : Fa – Do – Sol – Ré (de la corde grave à la corde aiguë). Appuie sur le bouton pour entendre chaque corde, puis tire doucement sur la corde jusqu’à ce que les deux sons ne « battent » plus.'

export const TOTAL = 84

const BASE_DAYS: Day[] = [
  { jour: 1, semaine: 1, type: 'apprendre', titre: 'Le violon accordé un ton plus bas', minutes: 15, objectif: 'Connaître les noms sonores des cordes à vide et faire de longs coups d’archet réguliers.',
    etapes: [
      { titre: 'Accordage', minutes: 2, texte: tune, cordes: true },
      { titre: 'Cordes à vide', minutes: 5, texte: 'Joue chaque corde à vide avec un long coup d’archet : 4 temps vers le bas, 4 temps vers le haut, à 60 au métronome. Garde l’archet parallèle au chevalet, avec un son égal du début à la fin.', metro: { bpm: 60, mesure: 2 } },
      { titre: 'Tes noms de notes', minutes: 4, texte: 'Les cordes sonnent Fa, Do, Sol, Ré. Ce sont les noms SONORES, ceux que ton ami entend sur son accordéon en Do. Sur ton doigté, tu joues comme si le violon était accordé normalement (Sol-Ré-La-Mi) : le nom « doigté » est un ton plus haut. Dis tout haut le nom sonore en jouant.' },
      { titre: 'Jeu avec bourdon', minutes: 4, texte: 'Laisse tourner le bourdon de Do et joue la corde de Do à vide, puis la corde de Sol à vide. Écoute comme ça sonne calme et stable.', bourdon: [C.C4] },
    ],
    ecoute: ['Le son ne grince pas et ne siffle pas.', 'Les deux sons accordés ensemble ne « battent » plus.'], autoeval: ['Je peux nommer les 4 cordes (Fa, Do, Sol, Ré).', 'Mon archet reste droit.'] },
  { jour: 2, semaine: 1, type: 'pratiquer', titre: 'Cordes à vide en rythme de two-step', minutes: 15, objectif: 'Alterner entre les cordes Do et Sol avec un pouls de two-step (2 temps).',
    etapes: [
      { titre: 'Accordage', minutes: 2, texte: tune, cordes: true },
      { titre: 'Pouls à deux temps', minutes: 6, texte: 'Joue un coup d’archet vers le bas (temps 1) et un vers le haut (temps 2), sur la corde de Do. Fais accent sur le temps 1. 70 au métronome.', metro: { bpm: 70, mesure: 2 } },
      { titre: 'Passer de corde en corde', minutes: 7, texte: 'Alterne : 4 mesures sur la corde de Do, 4 mesures sur la corde de Sol. Change de corde sans bruit : c’est le bras qui bouge, pas le poignet seul.', metro: { bpm: 70, mesure: 2 } },
    ],
    ecoute: ['Le temps 1 est plus fort que le temps 2.'], autoeval: ['Je change de corde sans accrocher l’autre.'] },
  { jour: 3, semaine: 1, type: 'apprendre', titre: 'Do Ré Mi Fa sur la corde de Do', minutes: 20, cle: 'C', objectif: 'Placer les doigts 1, 2, 3 pour jouer Ré, Mi, Fa sur la corde de Do.',
    etapes: [
      { titre: 'Accordage', minutes: 2, texte: tune, cordes: true },
      { titre: 'Forme de la main', minutes: 5, texte: 'Sur la corde de Do : à vide = Do, doigt 1 = Ré, doigt 2 = Mi, doigt 3 = Fa. Les doigts 2 et 3 sont collés (demi-ton Mi–Fa). C’est ta « forme haute 2 » : même forme qu’un violoniste accordé normalement qui joue Ré Mi Fa♯ Sol.' },
      { titre: 'La gamme, lentement', minutes: 8, texte: 'Joue Do-Ré-Mi-Fa et redescends, une note par coup d’archet, avec le bourdon de Do. Écoute chaque note pour qu’elle sonne « calme » contre le bourdon.', gamme: { cle: 'C', de: 60, a: 65 }, bourdon: [C.C4], metro: { bpm: 60, mesure: 2 } },
      { titre: 'Retiens', minutes: 3, texte: 'Regarde le manche à droite : les chiffres sont tes doigts, les noms sont ce que tu entends.' },
    ],
    ecoute: ['Mi et Fa sonnent proches l’un de l’autre (demi-ton).', 'Le Sol à vide sonne « juste » après Fa + doigt 3.'], autoeval: ['Mes doigts 2 et 3 sont collés.', 'Je joue Do-Ré-Mi-Fa sans regarder.'] },
  { jour: 4, semaine: 1, type: 'apprendre', titre: 'Sol La Si Do : la gamme de Do au complet', minutes: 20, cle: 'C', objectif: 'Reproduire la même forme sur la corde de Sol pour finir l’octave de Do majeur.',
    etapes: [
      { titre: 'Accordage', minutes: 2, texte: tune, cordes: true },
      { titre: 'Même forme, autre corde', minutes: 6, texte: 'Sur la corde de Sol : à vide = Sol, 1 = La, 2 = Si, 3 = Do. Exactement la même forme que sur la corde de Do. Voilà pourquoi la gamme de Do est « facile » : deux cordes, une seule forme.', gamme: { cle: 'C', de: 67, a: 72 } },
      { titre: 'Gamme complète', minutes: 9, texte: 'Joue Do-Ré-Mi-Fa-Sol-La-Si-Do, puis redescends. 60 au métronome, un coup d’archet par note, avec le bourdon de Do.', gamme: { cle: 'C', de: 60, a: 72 }, bourdon: [C.C4], metro: { bpm: 60, mesure: 2 } },
      { titre: 'Autoévaluation', minutes: 3, texte: 'Joue la gamme une fois sans te corriger, en écoutant seulement. Quelles notes sonnent trop hautes ou trop basses ?' },
    ],
    ecoute: ['Le Sol de la 2ᵉ corde à vide sonne bien avec le Do doigté juste avant.', 'Si → Do est un demi-ton.'], autoeval: ['Je joue la gamme de Do sans me tromper de doigt.'] },
  { jour: 5, semaine: 1, type: 'apprendre', titre: 'Forme haute 2 contre forme basse 2', minutes: 20, objectif: 'Entendre la différence entre un doigt 2 haut et un doigt 2 bas.',
    etapes: [
      { titre: 'Accordage', minutes: 2, texte: tune, cordes: true },
      { titre: 'Doigt 2 haut', minutes: 6, texte: 'Sur la corde de Sol : Sol-La-Si (doigt 2 haut, loin du 1) : c’est le Si de la gamme de Do et de Sol.', gamme: { cle: 'C', de: 67, a: 71 }, bourdon: [67] },
      { titre: 'Doigt 2 bas', minutes: 6, texte: 'Sur la même corde, recule le doigt 2 contre le 1 : Sol-La-Si♭. C’est le Si♭ de la gamme de Fa. Alterne Si et Si♭ lentement. Écoute le changement de couleur.', gamme: { cle: 'F', de: 67, a: 70 }, bourdon: [67] },
      { titre: 'Remarque', minutes: 4, texte: 'Pour jouer en Do ou en Sol, tu utilises surtout « 2 haut ». Pour Fa (Si♭), tu utilises « 2 bas » sur les cordes aiguës.' },
    ],
    ecoute: ['Si♭ sonne plus « triste » que Si.'], autoeval: ['Je peux passer du doigt 2 haut au doigt 2 bas sans regarder.'] },
  { jour: 6, semaine: 1, type: 'apprendre', titre: 'Résonance : écoute le doigt 3', minutes: 20, objectif: 'Utiliser les cordes à vide voisines pour vérifier la justesse du doigt 3.',
    etapes: [
      { titre: 'Accordage', minutes: 2, texte: tune, cordes: true },
      { titre: 'Doigt 3 = corde voisine', minutes: 8, texte: 'Sur la corde de Do, joue le Fa avec le doigt 3. Il doit faire résonner la corde de Fa à vide, une octave plus bas. Sur la corde de Sol, le Do avec le doigt 3 fait vibrer la corde de Do. Ajuste le doigt jusqu’à sentir la corde voisine vibrer.', bourdon: [C.C4] },
      { titre: 'Ajuste tes doigts', minutes: 7, texte: 'Rejoue la gamme de Do lentement. À chaque doigt 3, vérifie la résonance.', gamme: { cle: 'C', de: 60, a: 72 } },
      { titre: 'Facultatif', minutes: 3, texte: 'Colle de petites marques (ruban) sur le manche aux endroits justes, au début. Retire-les plus tard.' },
    ],
    ecoute: ['La corde voisine vibre quand le doigt 3 est juste.'], autoeval: ['Je sens la résonance sur au moins une note.'] },
  { jour: 7, semaine: 1, type: 'revue', titre: 'Révision de la semaine 1', minutes: 15, objectif: 'Accorder sans aide, jouer les cordes à vide en 2/4 et en 3/4, nommer les notes.',
    etapes: [
      { titre: 'Accordage sans aide', minutes: 3, texte: 'Accorde seul, puis vérifie avec les cordes à vide ci-dessous.', cordes: true },
      { titre: 'Cordes à vide 2/4 et 3/4', minutes: 7, texte: 'Quatre mesures en 2/4 (70), puis quatre mesures en 3/4 (90) : accent sur le temps 1.', metro: { bpm: 70, mesure: 2 } },
      { titre: 'La gamme de Do', minutes: 5, texte: 'Joue Do majeur de bas en haut, en disant les noms sonores.', gamme: { cle: 'C', de: 60, a: 72 }, bourdon: [C.C4] },
    ],
    ecoute: ['Ton accord tient entre le début et la fin de la séance.'], autoeval: ['Je peux accorder mon violon seul.', 'Je connais les noms sonores de mes cordes.'] },
  { jour: 8, semaine: 2, type: 'pratiquer', titre: 'Do majeur à 60', minutes: 20, cle: 'C', objectif: 'Jouer Do4–Do5 en noires, avec un bourdon de Do.',
    etapes: [
      { titre: 'Accordage', minutes: 2, texte: tune, cordes: true },
      { titre: 'Noires à 60', minutes: 10, texte: 'Un coup d’archet par note. Reste détendu dans l’épaule et dans le poignet.', gamme: { cle: 'C', de: 60, a: 72 }, bourdon: [C.C4], metro: { bpm: 60, mesure: 2 } },
      { titre: 'Écoute-toi', minutes: 8, texte: 'Joue chaque note en cherchant à faire « disparaître » le battement avec le bourdon.', bourdon: [C.C4] },
    ],
    ecoute: ['Pas de battement avec le bourdon.'], autoeval: ['Ma gamme est régulière.'] },
  { jour: 9, semaine: 2, type: 'pratiquer', titre: 'Do majeur en croches (two-step)', minutes: 20, cle: 'C', objectif: 'Deux notes par temps, archet bas–haut, pour sentir le rythme du two-step.',
    etapes: [
      { titre: 'Accordage', minutes: 2, texte: tune, cordes: true },
      { titre: 'Deux coups d’archet par note', minutes: 10, texte: 'Joue chaque note deux fois (bas–haut) sur le battement : Do-Do, Ré-Ré, Mi-Mi… à 70.', gamme: { cle: 'C', de: 60, a: 72 }, metro: { bpm: 70, mesure: 2 } },
      { titre: 'Accélère', minutes: 8, texte: 'Monte à 80 si c’est facile. Descends à 60 si les notes se mélangent.', metro: { bpm: 80, mesure: 2 } },
    ],
    ecoute: ['Les deux coups d’archet par temps sont égaux.'], autoeval: ['Je garde le rythme sans me presser.'] },
  { jour: 10, semaine: 2, type: 'apprendre', titre: 'Degrés 1-3-5 et 1-4-5', minutes: 20, cle: 'C', objectif: 'Reconnaître Do, Mi, Sol (accord de Do) et Do, Fa, Sol (les trois accords).',
    etapes: [
      { titre: 'Accordage', minutes: 2, texte: tune, cordes: true },
      { titre: 'Do–Mi–Sol', minutes: 8, texte: 'Joue Do-Mi-Sol-Mi-Do. Ce sont les notes de l’accord de Do.', gamme: { cle: 'C', de: 60, a: 67, type: 'pentatonique' }, bourdon: [C.C4] },
      { titre: 'Do–Fa–Sol', minutes: 8, texte: 'Joue Do-Fa-Sol-Fa-Do. Ce sont les trois « accords » du Do : I (Do), IV (Fa), V (Sol).' },
      { titre: 'Résumé', minutes: 2, texte: 'En Do, le I est Do, le IV est Fa, le V est Sol. Retiens-les : c’est la base du seconder.' },
    ],
    ecoute: ['Le Sol sonne « en attente », le Do sonne « à la maison ».'], autoeval: ['Je peux dire quel est le I, le IV et le V en Do.'] },
  { jour: 11, semaine: 2, type: 'apprendre', titre: 'Étendre vers le grave : Sol, La, Si', minutes: 20, cle: 'C', objectif: 'Jouer Sol3, La3, Si3 sur la corde de Fa avec un doigt 3 haut.',
    etapes: [
      { titre: 'Accordage', minutes: 2, texte: tune, cordes: true },
      { titre: 'Corde de Fa', minutes: 10, texte: 'Sur la corde de Fa : à vide = Fa, 1 = Sol, 2 = La, 3 = Si♭ (bas) ou Si (avec le doigt 3 haut). En Do majeur on joue Si, donc doigt 3 haut, loin du doigt 2.', gamme: { cle: 'C', de: 55, a: 59 } },
      { titre: 'Gamme étendue', minutes: 8, texte: 'Joue Sol3 jusqu’à Do5 et redescends.', gamme: { cle: 'C', de: 55, a: 72 }, bourdon: [C.C4] },
    ],
    ecoute: ['Si3 sonne « tendu » juste avant Do4.'], autoeval: ['Je joue Sol-La-Si sur la corde de Fa.'] },
  { jour: 12, semaine: 2, type: 'pratiquer', titre: 'Toute l’étendue en Do', minutes: 25, cle: 'C', objectif: 'Jouer Sol3 à Sol5 en première position.',
    etapes: [
      { titre: 'Accordage', minutes: 2, texte: tune, cordes: true },
      { titre: 'Montée-descente', minutes: 15, texte: 'Une note par coup d’archet, de Sol3 à Sol5, à 60 avec le bourdon de Do.', gamme: { cle: 'C', de: 55, a: 79 }, bourdon: [C.C4], metro: { bpm: 60, mesure: 2 } },
      { titre: 'Sans regarder', minutes: 8, texte: 'Joue la gamme les yeux fermés. Vérifie avec le bourdon.' },
    ],
    ecoute: ['Chaque changement de corde garde le même volume.'], autoeval: ['Je joue toute l’étendue sans m’arrêter.'] },
  { jour: 13, semaine: 2, type: 'pratiquer', titre: 'Do majeur en 3/4 (valse)', minutes: 20, cle: 'C', objectif: 'Trois notes par coup d’archet : sentir le balancement de la valse.',
    etapes: [
      { titre: 'Accordage', minutes: 2, texte: tune, cordes: true },
      { titre: 'Trois temps', minutes: 10, texte: 'Joue les notes de la gamme par groupes de 3 (Do-Ré-Mi, Ré-Mi-Fa, Mi-Fa-Sol…) sur un temps ternaire, accent sur la première note.', gamme: { cle: 'C', de: 60, a: 72 }, metro: { bpm: 90, mesure: 3 } },
      { titre: 'Balancement', minutes: 8, texte: 'Bouge légèrement le corps sur le temps 1. La valse cadienne balance, elle ne marche pas.', metro: { bpm: 100, mesure: 3 } },
    ],
    ecoute: ['Le temps 1 se sent « lourd », les temps 2 et 3 « légers ».'], autoeval: ['Je sens le 1-2-3 dans le corps.'] },
  { jour: 14, semaine: 2, type: 'revue', titre: 'Révision de la semaine 2', minutes: 20, cle: 'C', objectif: 'Do majeur à 72, écouter le bourdon, vérifier Mi et Si.',
    etapes: [
      { titre: 'Accordage', minutes: 2, texte: tune, cordes: true },
      { titre: 'Do majeur à 72', minutes: 10, texte: 'Joue la gamme de Do deux octaves avec le bourdon, sans pause.', gamme: { cle: 'C', de: 55, a: 79 }, bourdon: [C.C4], metro: { bpm: 72, mesure: 2 } },
      { titre: 'Mi et Si', minutes: 8, texte: 'Ces deux notes sont souvent trop basses. Vérifie-les contre le bourdon.', bourdon: [C.C4] },
    ],
    ecoute: ['Mi et Si ne battent pas avec le bourdon.'], autoeval: ['J’ai joué Do majeur à 72 sans erreur.'] },
]
export const DAYS: Day[] = [...BASE_DAYS, ...GEN_DAYS]
export const ALL_EN = { ...BASE_EN, ...GEN_DAYS_EN }
export function dayOf(n: number): Day | undefined {
  const d = DAYS.find((x) => x.jour === n)
  if (!d || i18n.lang === 'fr') return d
  const e = ALL_EN[n]
  if (!e) return d
  return { ...d, titre: e.titre, objectif: e.objectif, ecoute: e.ecoute, autoeval: e.autoeval, etapes: d.etapes.map((s, i) => ({ ...s, ...e.etapes[i] })) }
}
