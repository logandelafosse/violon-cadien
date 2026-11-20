// Mode pupitre : un mode sauvegardé (pas un thème). Fonctionne avec n'importe quel thème.
// Cette base ne fait que garder l'état ; la vue et son interrupteur sont remplis par la branche feat/mode-pupitre.
const KEY = 'cfd.pupitre'

function initial(): boolean {
  try { return localStorage.getItem(KEY) === '1' } catch { return false }
}

export const pupitre = $state<{ on: boolean }>({ on: initial() })

export function setPupitre(on: boolean) {
  pupitre.on = on
  try { localStorage.setItem(KEY, on ? '1' : '0') } catch { /* ignoré */ }
}
