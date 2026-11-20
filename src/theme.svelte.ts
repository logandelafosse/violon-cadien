export const THEMES = ['drapeau', 'bayou', 'papier', 'minuit', 'epure'] as const
export type Theme = (typeof THEMES)[number]
const KEY = 'cfd.theme'

function initial(): Theme {
  try {
    const s = localStorage.getItem(KEY)
    if ((THEMES as readonly string[]).includes(s ?? '')) return s as Theme
  } catch { /* ignoré */ }
  return 'drapeau'
}

export const theme = $state<{ name: Theme }>({ name: initial() })

/** Aligne la couleur de la barre du navigateur sur le fond du thème actif (après application des variables CSS). */
function syncThemeColor() {
  if (typeof document === 'undefined') return
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
  if (!bg) return
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta) }
  meta.content = bg
}

export function setTheme(n: Theme) {
  theme.name = n
  document.documentElement.dataset.theme = n
  try { localStorage.setItem(KEY, n) } catch { /* ignoré */ }
  syncThemeColor()
}

// « Drapeau » suit le mode clair/sombre de l'appareil : la couleur de la barre doit suivre aussi.
if (typeof window !== 'undefined' && window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeColor)
}

/** Pastilles du sélecteur : [fond, accent, 2e accent, bois du manche] (valeurs de tokens.css). */
export const SWATCH: Record<Theme, [string, string, string, string]> = {
  drapeau: ['#f6f2e8', '#1b3a8c', '#c8102e', '#5e3a20'],
  bayou: ['#0f1f17', '#8fd19e', '#e9a23b', '#4a2d16'],
  papier: ['#f2e8d2', '#7a2e1d', '#2f5d62', '#6e4223'],
  minuit: ['#0b0a08', '#ffb347', '#ff6b57', '#2b1b0e'],
  epure: ['#ffffff', '#2457d6', '#1a7f4b', '#3d424b'],
}
/** Variante sombre de Drapeau (quand l'appareil est en mode sombre). */
export const SWATCH_DRAPEAU_SOMBRE: [string, string, string, string] = ['#0d1530', '#9db8ff', '#ff8a93', '#4e2f18']

/** Pastilles à afficher pour un thème, selon le mode de l'appareil. */
export function swatchFor(th: Theme, prefersDark: boolean): [string, string, string, string] {
  return th === 'drapeau' && prefersDark ? SWATCH_DRAPEAU_SOMBRE : SWATCH[th]
}
