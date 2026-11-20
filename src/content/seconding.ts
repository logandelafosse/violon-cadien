// Seconding (« bassing ») d'après la terminologie du livret Balfa/Schwarz (Folkways FM 8361) ; formules de jeu écrites pour l'app.
import type { Accord } from './songs'

export type Style = 'droite' | 'rythme' | 'shuffle'
export const STYLES: Style[] = ['droite', 'rythme', 'shuffle']

/** Doublings (deux cordes à la fois), hauteurs sonores. D'après les diagrammes du livret, accordage Fa-Do-Sol-Ré. */
export const DOUBLING: Record<Accord, [number, number]> = {
  C: [60, 64],  // Do (corde de Fa, doigt 4 = Do à vide) + Mi (corde de Do, doigt 2)
  G: [67, 71],  // Sol (corde de Do, doigt 4) + Si (corde de Sol, doigt 2)
  F: [57, 60],  // La (corde de Fa, doigt 2) + Do à vide  (à vérifier avec l'enregistrement)
  Bb: [58, 62], // Si♭ (corde de Fa, doigt 3) + Ré (corde de Do, doigt 1)
  D: [62, 69],  // Ré (corde de Do, doigt 1) + La (corde de Sol, doigt 1)
}
/** Autre doubling du Sol, plus grave (corde de Fa et corde de Do). */
export const DOUBLING_LOW_G: [number, number] = [55, 62]
/** Tonalité d'épellation pour placer les doigts (Si♭ demande la gamme de Fa). */
export const CHORD_KEY: Record<Accord, 'C' | 'F'> = { C: 'C', G: 'C', F: 'C', D: 'C', Bb: 'F' }

export interface Stroke { t: number; d: number; kind: 'accord' | 'roule' | 'court'; fort: boolean }

/** Coups d'archet d'une mesure. `roule` = long coup qui roule sur les cordes ; `court` = petit coup scié. */
export function strokes(style: Style, mesure: 2 | 3): Stroke[] {
  const s = (t: number, d: number, kind: Stroke['kind'], fort = false): Stroke => ({ t, d, kind, fort })
  if (style === 'droite') return Array.from({ length: mesure }, (_, b) => s(b, 1, 'accord', b === 0))
  if (style === 'rythme') return Array.from({ length: mesure * 2 }, (_, i) => s(i / 2, 0.5, 'accord', i % 2 === 0))
  // shuffle : un long (qui roule) puis deux courts, par temps en two-step ; un long puis deux courts dans la mesure en valse
  if (mesure === 2) return [0, 1].flatMap((b) => [s(b, 0.5, 'roule', true), s(b + 0.5, 0.25, 'court'), s(b + 0.75, 0.25, 'court')])
  return [s(0, 1, 'roule', true), s(1, 1, 'court'), s(2, 1, 'court')]
}
