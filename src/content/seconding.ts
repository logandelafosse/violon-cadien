// Seconding (« bassing ») d'après la terminologie du livret Balfa/Schwarz (Folkways FM 8361) ; formules de jeu écrites pour l'app.
import type { Accord } from './songs'

export type Style = 'droite' | 'rythme' | 'shuffle'
export const STYLES: Style[] = ['droite', 'rythme', 'shuffle']

/**
 * Doublings (deux cordes à la fois), hauteurs SONORES, accordage Fa-Do-Sol-Ré.
 * LU DANS LE LIVRET (relu sur les diagrammes : « Chords for 2nd fiddle bassing », octave/doubling de Fa, doubling de Si♭) :
 *  - C : corde de Fa doigt 4 (= Do) + corde de Do doigt 2 (Mi)
 *  - G : corde de Do doigt 4 (Sol) + corde de Sol doigt 2 (Si)
 *  - D : corde de Do doigt 1 (Ré) + corde de Sol doigt 1 (La)
 *  - F : corde de Fa doigt 2 (La) + Do à vide. Le diagramme « octave and doubling in the F chord » imprime un « 3 » à côté du La,
 *        mais la grille complète de l'accord de Fa le place au doigt 2 (+4 demi-tons de la corde de Fa). Le « 3 » semble une
 *        coquille du livret : c'est mon interprétation, la hauteur La + Do est elle lue sur le diagramme.
 *  - Bb : corde de Fa doigt 3 (Si♭) + corde de Do doigt 1 (Ré), diagramme « C and F again » du doubling de Si♭.
 */
export const DOUBLING: Record<Accord, [number, number]> = {
  C: [60, 64],  // Do + Mi
  G: [67, 71],  // Sol + Si
  F: [57, 60],  // La + Do à vide
  Bb: [58, 62], // Si♭ + Ré
  D: [62, 69],  // Ré + La
}
/** Autre doubling du Sol, plus grave (corde de Fa doigt 1 + corde de Do doigt 1) : livret, « You'll find another G on your F and C string ». */
export const DOUBLING_LOW_G: [number, number] = [55, 62]
/**
 * Autres formes données par le livret pour le même accord (mêmes pages) :
 *  - G : Sol grave (ci-dessus) et Si (corde de Fa, doigt 3) + Ré (corde de Do, doigt 1), second diagramme du « G chord » ;
 *  - D : Fa♯ (corde de Do, doigt 3) + La (corde de Sol, doigt 1), second diagramme du « D chord ».
 */
export const DOUBLING_ALT: Partial<Record<Accord, [number, number][]>> = {
  G: [DOUBLING_LOW_G, [59, 62]],
  D: [[66, 69]],
}
/** Tonalité d'épellation pour placer les doigts (Si♭ demande la gamme de Fa). */
export const CHORD_KEY: Record<Accord, 'C' | 'F'> = { C: 'C', G: 'C', F: 'C', D: 'C', Bb: 'F' }

export interface Stroke { t: number; d: number; kind: 'accord' | 'roule' | 'court'; fort: boolean }

/**
 * Coups d'archet d'une mesure. `roule` = long coup qui roule sur les cordes ; `court` = petit coup scié.
 * Ce que dit le livret (pages « Straight / Rhythm bow / Shuffle bow bassing », pistes 49 à 51 et 53 à 55 du mp3) :
 *  - droite : « sound the strings as a filler or a backing » : pas de schéma précis. Un coup par temps est MON interprétation.
 *  - rythme : « use your bow for the rhythm, like you would strum a guitar » ; en valse « ONE-two-three », beaucoup d'archet.
 *    Les croches bas-haut sont MON interprétation du « strum » ; pour la valse le livret décrit plutôt trois coups ONE-two-three
 *    (question ouverte, voir rapport).
 *  - shuffle (two-step) : un long coup tiré qui roule des trois cordes graves vers l'aiguë, puis DEUX petits coups sciés sur les
 *    cordes 1 et 2 ; ROLL-saw-saw ROLL-saw-saw, le roule suivant dans le sens contraire. Confirmé : un long + deux courts.
 *  - shuffle (valse) : « ROH-dle-dee » : tirer et rouler depuis l'accord le plus grave vers la corde 1 (trois sons distincts), puis
 *    pousser et rouler en revenant ; changer de sens après avoir touché la corde 1 (ou 1 et 2). Un long + deux courts par
 *    mesure est une lecture raisonnable ; l'alternance exacte des sens d'une mesure à l'autre est mon interprétation.
 *  - Pied de la valse (livret) : « three-ONE-(two)-three » : le trois est rapide, le UN lourd et dur, le deux silencieux.
 */
export function strokes(style: Style, mesure: 2 | 3): Stroke[] {
  const s = (t: number, d: number, kind: Stroke['kind'], fort = false): Stroke => ({ t, d, kind, fort })
  if (style === 'droite') return Array.from({ length: mesure }, (_, b) => s(b, 1, 'accord', b === 0))
  if (style === 'rythme') return Array.from({ length: mesure * 2 }, (_, i) => s(i / 2, 0.5, 'accord', i % 2 === 0))
  // shuffle : un long (qui roule) puis deux courts, par temps en two-step ; un long puis deux courts dans la mesure en valse
  if (mesure === 2) return [0, 1].flatMap((b) => [s(b, 0.5, 'roule', true), s(b + 0.5, 0.25, 'court'), s(b + 0.75, 0.25, 'court')])
  return [s(0, 1, 'roule', true), s(1, 1, 'court'), s(2, 1, 'court')]
}
