import { test, expect } from '@playwright/test'
import { nav, axeClean } from './helpers'

test('plan : la grille mène à un jour', async ({ page }) => {
  await page.goto('/')
  await nav(page, /Plan/)
  await expect(page.locator('.cell')).toHaveCount(84)
  await page.locator('.cell').nth(2).click()
  await expect(page).toHaveURL(/#\/jour\/3$/)
  await expect(page.locator('.kicker')).toContainText(/Jour\s*3\b/i)
})

test('plan : une carte par semaine, avec le compte des jours faits', async ({ page }) => {
  await page.goto('/#/plan')
  await expect(page.locator('section.week')).toHaveCount(12)
  await expect(page.locator('section.week').first()).toContainText('0/7')
  // le jour courant (1) est repéré, les révisions (7, 14…) ont une marque pointillée
  await expect(page.locator('.cell.today')).toHaveCount(1)
  await expect(page.locator('.cell.review')).toHaveCount(12)
})

test('plan : marquer des jours faits met à jour la semaine, sans verrouiller le reste', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Marquer comme fait/ }).click()
  await page.goto('/#/plan')
  await expect(page.locator('section.week').first()).toContainText('1/7')
  await expect(page.locator('.cell.done')).toHaveCount(1)
  await expect(page.locator('.cell.today')).toHaveAttribute('aria-label', /Jour 2/)
  // un jour lointain reste ouvrable
  await page.locator('.cell').nth(40).click()
  await expect(page).toHaveURL(/#\/jour\/41$/)
})

test('plan : axe en passant (cartes, jour fait, jour courant)', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Marquer comme fait/ }).click()
  await page.goto('/#/plan')
  await axeClean(page)
})

test('plan : tous les jours sont des liens atteignables au clavier', async ({ page }) => {
  await page.goto('/#/plan')
  const cell = page.locator('.cell').nth(5)
  await cell.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#\/jour\/6$/)
})
