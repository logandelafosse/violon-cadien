import { test, expect } from '@playwright/test'
import { axeClean, nav, trackErrors } from './helpers'

// Mode pupitre : un mode sauvegardé (clé cfd.pupitre), vue plein écran une étape à la fois.

const étape = (page: import('@playwright/test').Page, n: number) => page.locator('.count b').filter({ hasText: new RegExp(`^${n}$`) })

test('pupitre : désactivé par défaut, la page du jour reste normale', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('nav')).toBeVisible()
  await expect(page.locator('html')).not.toHaveAttribute('data-pupitre', /.*/)
})

test('pupitre : l’interrupteur des Réglages change son état et le mode persiste', async ({ page }) => {
  await page.goto('/#/reglages')
  const sw = page.getByRole('switch', { name: 'Mode pupitre' })
  await expect(sw).not.toBeChecked()
  await sw.check()
  await expect(sw).toBeChecked()
  expect(await page.evaluate(() => localStorage.getItem('cfd.pupitre'))).toBe('1')
  await page.reload()
  await expect(page.getByRole('switch', { name: 'Mode pupitre' })).toBeChecked()
  await page.getByRole('switch', { name: 'Mode pupitre' }).uncheck()
  expect(await page.evaluate(() => localStorage.getItem('cfd.pupitre'))).toBe('0')
})

test('pupitre : ouvrir depuis le jour, naviguer, quitter', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Ouvrir au pupitre' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-pupitre', '')
  await expect(page.locator('nav')).toHaveCount(0)
  await expect(étape(page, 1)).toBeVisible()
  const h1 = page.getByRole('heading', { level: 1 })
  const premier = await h1.textContent()
  await page.getByRole('button', { name: 'Suivante' }).click()
  await expect(étape(page, 2)).toBeVisible()
  await expect(h1).not.toHaveText(premier ?? '')
  await page.getByRole('button', { name: 'Avant' }).click()
  await expect(étape(page, 1)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Avant' })).toBeDisabled()
  // flèches du clavier
  await page.keyboard.press('ArrowRight')
  await expect(étape(page, 2)).toBeVisible()
  await page.keyboard.press('ArrowLeft')
  await expect(étape(page, 1)).toBeVisible()
  // le mode survit à un rechargement
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-pupitre', '')
  await page.getByRole('button', { name: 'Quitter le mode pupitre' }).click()
  await expect(page.locator('html')).not.toHaveAttribute('data-pupitre', /.*/)
  await expect(page.locator('nav')).toBeVisible()
  await page.reload()
  await expect(page.locator('nav')).toBeVisible()
  expect(errors).toEqual([])
})

test('pupitre : Échap quitte, la grosse police s’applique', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Ouvrir au pupitre' }).click()
  const taille = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize))
  expect(taille).toBeGreaterThan(24)
  await page.keyboard.press('Escape')
  await expect(page.locator('nav')).toBeVisible()
  const normale = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize))
  expect(normale).toBeLessThan(18)
})

test('pupitre : la dernière étape marque le jour comme fait', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Ouvrir au pupitre' }).click()
  const fin = page.getByRole('button', { name: 'Marquer comme fait' })
  for (let k = 0; k < 12 && !(await fin.isVisible()); k++) await page.getByRole('button', { name: 'Suivante' }).click()
  await fin.click()
  await expect(page.locator('nav')).toBeVisible()
  await expect(page.locator('.meta')).toContainText('1/84')
})

test('pupitre : le métronome et le bourdon se pilotent sans erreur', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/jour/3')
  await page.getByRole('button', { name: 'Ouvrir au pupitre' }).click()
  // jour 3, étape 3 : gamme avec bourdon et métronome
  for (let k = 0; k < 3 && !(await page.getByRole('button', { name: /Bourdon/ }).first().isVisible()); k++) await page.getByRole('button', { name: 'Suivante' }).click()
  const bourdon = page.getByRole('button', { name: /Bourdon/ }).first()
  await bourdon.click()
  await expect(page.getByRole('button', { name: /Arrêter le bourdon/ })).toHaveAttribute('aria-pressed', 'true')
  const metro = page.getByRole('button', { name: 'Métronome' })
  if (await metro.count()) {
    await metro.click()
    await expect(page.getByRole('button', { name: 'Arrêter', exact: true })).toHaveAttribute('aria-pressed', 'true')
  }
  await page.getByRole('button', { name: 'Suivante' }).click()
  // changer d’étape coupe tout : plus de bourdon actif
  await expect(page.getByRole('button', { name: /Arrêter le bourdon/ })).toHaveCount(0)
  expect(errors).toEqual([])
})

for (const [nom, theme, scheme] of [['drapeau clair', 'drapeau', 'light'], ['drapeau sombre', 'drapeau', 'dark'], ['minuit', 'minuit', 'dark']] as const) {
  test(`axe : mode pupitre / ${nom}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme })
    await page.addInitScript(([th]) => { localStorage.setItem('cfd.theme', th); localStorage.setItem('cfd.pupitre', '1') }, [theme])
    await page.goto('/#/jour/3')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await axeClean(page)
    // une étape avec manche, bourdon et métronome
    for (let k = 0; k < 3; k++) await page.getByRole('button', { name: 'Suivante' }).click()
    await axeClean(page)
  })
}

test('pupitre : le bouton de lancement est accessible depuis l’onglet Réglages → jour', async ({ page }) => {
  await page.goto('/')
  await nav(page, /Réglages/)
  await expect(page.getByRole('switch', { name: 'Mode pupitre' })).toBeVisible()
})
