import core from './i18n/core'
import shell from './i18n/shell'
import today from './i18n/today'
import manche from './i18n/manche'
import songs from './i18n/songs'
import pages from './i18n/pages'
import pupitre from './i18n/pupitre'

export type Lang = 'fr' | 'en'
const KEY = 'cfd.lang'

function initial(): Lang {
  try {
    const s = localStorage.getItem(KEY)
    if (s === 'fr' || s === 'en') return s
  } catch { /* ignoré */ }
  return 'fr'
}

export const i18n = $state<{ lang: Lang }>({ lang: initial() })

export function setLang(l: Lang) {
  i18n.lang = l
  try { localStorage.setItem(KEY, l) } catch { /* ignoré */ }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = l
    document.title = t('titre_court')
  }
}

/** Tous les modules de textes, dans l'ordre. Chaque clé ne doit apparaître que dans un seul (vérifié par i18n.test.ts). */
export const MODULES = [core, shell, today, manche, songs, pages, pupitre] as const

const D = {
  fr: Object.assign({}, ...MODULES.map((m) => m.fr)) as typeof core.fr & typeof shell.fr & typeof today.fr & typeof manche.fr & typeof songs.fr & typeof pages.fr & typeof pupitre.fr,
  en: Object.assign({}, ...MODULES.map((m) => m.en)) as typeof core.en & typeof shell.en & typeof today.en & typeof manche.en & typeof songs.en & typeof pages.en & typeof pupitre.en,
}

export type Key = keyof typeof D.fr
export const t = (k: Key): string => D[i18n.lang][k]

/** Remplace les {paramètres} d'un gabarit : « {n} jours » + { n: 3 } → « 3 jours » ; un paramètre inconnu reste tel quel. */
export const fill = (template: string, params: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (m, name) => (name in params ? String(params[name]) : m))

/** Comme t(), avec des paramètres. */
export const tf = (k: Key, params: Record<string, string | number>): string => fill(t(k), params)
