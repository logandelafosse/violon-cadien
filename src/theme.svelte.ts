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

export function setTheme(n: Theme) {
  theme.name = n
  document.documentElement.dataset.theme = n
  try { localStorage.setItem(KEY, n) } catch { /* ignoré */ }
}
export const SWATCH: Record<Theme, [string, string, string]> = {
  drapeau: ['#1b3a8c', '#ffffff', '#c8102e'],
  bayou: ['#12201a', '#8fd19e', '#e9a23b'],
  papier: ['#f3ead7', '#7a2e1d', '#2f5d62'],
  minuit: ['#0b0b0d', '#ffb347', '#ff6b57'],
  epure: ['#ffffff', '#2457d6', '#1a7f4b'],
}
