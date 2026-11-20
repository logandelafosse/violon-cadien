// Géométrie du manche, partagée par le grand manche (Fingerboard) et les petits manches par mesure.
// Fonctions pures : positions en pourcentage de la largeur / hauteur du manche.
import { OPEN, position, type KeyName } from './fiddle'

/** Abscisse de chaque corde (Fa, Do, Sol, Ré) en % de la largeur. */
export const STRING_X = [14.8, 38.3, 61.7, 85.2] as const
/** Épaisseur des cordes (px dans la maquette) : du Fa grave au Ré aigu. */
export const THICK_LARGE = [4, 3.2, 2.4, 1.6] as const
export const THICK_MEASURE = [3, 2.4, 1.8, 1.2] as const
/** Repères (rubans) du débutant : demi-tons 2, 4 et 5 au-dessus de la corde à vide. */
export const TAPES = [2, 4, 5] as const
/** Le manche montre au moins 5 demi-tons ; le doigt 4 (ex. Do sur la corde de Fa) en demande 7. */
export const MIN_SLOTS = 5
export const MAX_SLOTS = 7

/** Demi-tons au-dessus de la corde à vide pour une note jouée en première position (0 = corde à vide). */
export function semitone(midi: number, key: KeyName): number | null {
  const p = position(midi, key)
  return p ? midi - OPEN[p.string] : null
}

/** Nombre de demi-tons à dessiner : au moins 5, plus si une note monte plus haut. */
export function slots(midis: number[], key: KeyName): number {
  let max = MIN_SLOTS
  for (const m of midis) {
    const s = semitone(m, key)
    if (s !== null && s > max) max = s
  }
  return Math.min(max, MAX_SLOTS)
}

/** Position verticale d'un demi-ton sur le manche, en % de la hauteur (0 = sillet). */
export const yOf = (semis: number, slotCount: number): number => (semis / slotCount) * 100
