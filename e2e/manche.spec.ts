import { test, expect } from '@playwright/test'
import { THEMES, axeClean, trackErrors } from './helpers'

// Manche de violon : points = vrais boutons, clavier, mode des noms, accessibilité dans les thèmes.

test('clavier : les points du manche sont de vrais boutons atteignables, Entrée et Espace les jouent', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/jour/3')
  const dot = page.locator('button.dot').first()
  await expect(dot).toBeVisible()
  await dot.focus()
  await expect(dot).toBeFocused()
  await page.keyboard.press('Space')
  await page.keyboard.press('Enter')
  expect(errors).toEqual([])
})

test('le nom accessible d’un point commence par son chiffre visible', async ({ page }) => {
  await page.goto('/#/jour/3')
  const dots = page.locator('button.dot')
  const n = await dots.count()
  expect(n).toBeGreaterThan(3)
  for (let i = 0; i < n; i++) {
    const text = (await dots.nth(i).textContent())!.trim()
    const label = (await dots.nth(i).getAttribute('aria-label'))!
    expect(label.startsWith(text)).toBe(true)
  }
})

test('dièses et bémols sont dits en toutes lettres (français puis anglais)', async ({ page }) => {
  await page.goto('/#/jour/22') // Sol majeur : contient du Fa♯
  const labels = await page.locator('button.dot').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''))
  expect(labels.some((l) => /dièse/.test(l))).toBe(true)
  expect(labels.some((l) => /[♯♭]/.test(l))).toBe(false)
  await page.evaluate(() => localStorage.setItem('cfd.lang', 'en')) // indépendant de la forme du sélecteur de langue
  await page.reload()
  await expect(page.locator('button.dot').first()).toBeVisible()
  const en = await page.locator('button.dot').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''))
  expect(en.some((l) => /sharp/.test(l))).toBe(true)
})

test('le choix Sonore / Doigté / Les deux change les noms affichés et garde aria-pressed', async ({ page }) => {
  await page.goto('/#/jour/3')
  const group = page.getByRole('group', { name: 'Noms des notes' }).first()
  const both = group.getByRole('button', { name: 'Les deux' })
  await expect(both).toHaveAttribute('aria-pressed', 'true')
  const stage = page.locator('.stage').first()
  const doigte = group.getByRole('button', { name: 'Doigté' })
  await doigte.click()
  await expect(doigte).toHaveAttribute('aria-pressed', 'true')
  await expect(both).toHaveAttribute('aria-pressed', 'false')
  await expect(stage.locator('.lab .son')).toHaveCount(0)
  await group.getByRole('button', { name: 'Sonore' }).click()
  await expect(stage.locator('.lab .doi')).toHaveCount(0)
  await expect(stage.locator('.lab .son').first()).toBeVisible()
})

test('le manche est plus haut quand une note descend jusqu’au doigt 3 grave (jusqu’à 7 demi-tons)', async ({ page }) => {
  await page.goto('/#/jour/3') // do ré mi fa : 5 demi-tons
  const h3 = await page.locator('.stage').first().evaluate((e) => e.getBoundingClientRect().height)
  await page.goto('/#/jour/23') // Sol3 à Sol4 : Si3 à 6 demi-tons au-dessus du Fa
  const h23 = await page.locator('.stage').first().evaluate((e) => e.getBoundingClientRect().height)
  expect(h23).toBeGreaterThan(h3)
})

for (const theme of THEMES) {
  test(`axe : un jour avec manche / ${theme}`, async ({ page }) => {
    await page.addInitScript((th) => localStorage.setItem('cfd.theme', th), theme)
    await page.goto('/#/jour/3')
    await expect(page.locator('button.dot').first()).toBeVisible()
    await axeClean(page)
  })
}

test('les points restent dans le manche à 320 px de large (pas de défilement horizontal)', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/#/jour/22')
  await expect(page.locator('button.dot').first()).toBeVisible()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})
