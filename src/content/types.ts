import type { KeyName } from '../theory/fiddle'
export interface Step {
  titre: string; minutes: number; texte: string
  bourdon?: number[]               // MIDI sonores
  metro?: { bpm: number; mesure: 2 | 3 }
  gamme?: { cle: KeyName; de: number; a: number; type?: 'majeure' | 'pentatonique' }
  notes?: { cle: KeyName; notes: number[]; titre?: string; titreEn?: string; ensemble?: boolean } // triade ou doubling : notes sonores explicites
  cordes?: boolean                 // afficher les cordes à vide à écouter
}
export interface Day {
  jour: number; semaine: number; type: 'apprendre' | 'pratiquer' | 'revue'
  titre: string; objectif: string; minutes: number; cle?: KeyName
  etapes: Step[]; ecoute: string[]; autoeval: string[]
}
