import AxeBuilder from '@axe-core/playwright'
import { expect, type Page } from '@playwright/test'

/** Collecte les erreurs de page et de console ; à vérifier avec `expect(errors).toEqual([])`. */
export function trackErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  return errors
}

/** Clique un onglet de la navigation, que ce soit un bouton ou un lien (la barre peut changer de balise). */
export const nav = (page: Page, name: RegExp) => page.locator('nav').getByText(name).first().click()

/** Vérifie qu'axe ne trouve aucune violation WCAG 2 A/AA (+ 2.1) sur la page ouverte. */
export async function axeClean(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  expect(violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ') + ' ' + (n.any[0]?.message ?? '')).join(' | ')}`)).toEqual([])
}

export const THEMES = ['drapeau', 'bayou', 'papier', 'minuit', 'epure'] as const
export const SCREENS: [string, string][] = [
  ['aujourd’hui', '/'],
  ['plan', '/plan'],
  ['chansons', '/chansons/1'],
  ['vocabulaire', '/vocabulaire'],
  ['réglages', '/reglages'],
]
