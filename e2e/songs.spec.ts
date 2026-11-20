import { test, expect } from '@playwright/test'
import { nav, trackErrors, axeClean } from './helpers'

test('chansons : sélecteur de leçon et Jouer/Stop sans erreur', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/')
  await nav(page, /Chansons/)
  const picker = page.locator('label.lesson select')
  const values = await picker.locator('option').evaluateAll((o) => o.map((x) => (x as HTMLOptionElement).value))
  const last = values[values.length - 1]
  await picker.selectOption(last)
  await expect(page).toHaveURL(new RegExp(`#/chansons/${last}$`))
  const play = page.locator('button.main')
  await play.click()
  await expect(play).toHaveClass(/on/)
  await play.click()
  await expect(play).not.toHaveClass(/on/)
  expect(errors).toEqual([])
})

test('chansons : onglets des titres, clavier et tempo', async ({ page }) => {
  await page.goto('/#/chansons/1')
  const tabs = page.getByRole('tab')
  await expect(tabs).toHaveCount(2)
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true')
  // les onglets portent les titres des chansons, pas « two-step / valse »
  await expect(tabs.first()).toContainText('Two-step')
  await expect(tabs.last()).toContainText('Valse')
  await tabs.first().focus()
  await page.keyboard.press('ArrowRight')
  await expect(tabs.last()).toHaveAttribute('aria-selected', 'true')
  await expect(tabs.last()).toBeFocused()
  await expect(page.getByRole('tabpanel')).toBeVisible()

  // compteur de tempo : − / + et champ numérique accessible
  const tempo = page.getByRole('spinbutton', { name: 'Tempo' })
  const before = Number(await tempo.inputValue())
  await page.getByRole('button', { name: 'Plus vite' }).click()
  await expect(tempo).toHaveValue(String(before + 1))
  await page.getByRole('button', { name: 'Moins vite' }).click()
  await expect(tempo).toHaveValue(String(before))
})

test('chansons : le tempo est bloqué pendant la lecture, la mesure en cours est marquée', async ({ page }) => {
  await page.goto('/#/chansons/1')
  const play = page.locator('button.main')
  await play.click()
  await expect(play).toHaveAttribute('aria-pressed', 'true')
  await expect(play).toContainText(/tour 1 sur 4/)
  await expect(page.getByRole('spinbutton', { name: 'Tempo' })).toBeDisabled()
  await expect(page.locator('.songs .measure.cur')).toHaveCount(1, { timeout: 8000 })
  await play.click()
  await expect(play).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('.songs .measure.cur')).toHaveCount(0)
})

test('chansons : doublings défilants au clavier et grille de mesures', async ({ page }) => {
  await page.goto('/#/chansons/1')
  const rail = page.getByRole('region', { name: /Doublings/ })
  await expect(rail).toHaveAttribute('tabindex', '0')
  await rail.focus()
  await expect(rail).toBeFocused()
  // les doublings sont de vrais petits manches : un résumé parlé par accord
  expect(await rail.locator('.measure').count()).toBeGreaterThan(0)
  await expect(page.locator('.grid .measure')).toHaveCount(8)
  // la longue explication est repliée dans « Comment lire ces manches »
  await expect(page.locator('details.how')).not.toHaveAttribute('open', '')
  await page.locator('details.how summary').click()
  await expect(page.locator('details.how')).toHaveAttribute('open', '')
})

test('chansons : 2 colonnes sur téléphone, 4 sur tablette', async ({ page }) => {
  const cols = () => page.locator('.songs .grid').evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(' ').length)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#/chansons/1')
  expect(await cols()).toBe(2)
  await page.setViewportSize({ width: 820, height: 1100 })
  await expect.poll(cols).toBe(4)
})

test('chansons : en anglais les titres, le tempo et le résumé suivent la langue', async ({ page }) => {
  // la langue est choisie par le stockage, sans dépendre du contrôle de l'en-tête (qui change de forme)
  await page.addInitScript(() => localStorage.setItem('cfd.lang', 'en'))
  await page.goto('/#/chansons/1')
  await expect(page.getByRole('button', { name: 'Faster' })).toBeVisible()
  await expect(page.locator('button.main')).toContainText('Play')
  await expect(page.locator('.grid .measure .sr').first()).toContainText(/^Bar 1, chord C/)
})

test('chansons : axe propre au repos et en lecture', async ({ page }) => {
  await page.goto('/#/chansons/1')
  await axeClean(page)
  await page.locator('button.main').click()
  await axeClean(page)
  await page.locator('button.main').click()
})
