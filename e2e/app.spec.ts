import { test, expect, type Page } from '@playwright/test'

function trackErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  return errors
}
const nav = (page: Page, name: RegExp) => page.locator('nav').getByRole('button', { name }).click()

test('premier chargement : leçon du jour 1 en français', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Violon cadien')
  await expect(page.locator('.kicker')).toContainText(/Jour\s*1\b/i)
  await expect(page.locator('.meta')).toContainText('0/84')
})

test('changement de langue : interface et noms de notes', async ({ page }) => {
  await page.goto('/#/chansons/1')
  await expect(page.locator('body')).toContainText(/\b(Do|Ré|Sol)\b/)
  await page.getByRole('switch').click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Day by Day')
  await expect(page.locator('nav')).toContainText('Settings')
  await expect(page.locator('body')).not.toContainText(/\b(Ré|Mi bémol)\b/)
  await expect(page.locator('body')).toContainText(/\b[CDEFGAB]\b/)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('thème : data-theme change et persiste', async ({ page }) => {
  await page.goto('/')
  await page.locator('.themesel select').selectOption('minuit')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'minuit')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'minuit')
  await nav(page, /Réglages/)
  await page.locator('.th').nth(2).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'papier')
})

test('marquer fait : série mise à jour et persistante', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Marquer comme fait' }).click()
  await expect(page.locator('.meta')).toContainText('1/84')
  await expect(page.locator('.meta')).toContainText(/Série\s*:\s*1 jour\b/)
  await page.reload()
  await expect(page.locator('.meta')).toContainText('1/84')
  await expect(page.locator('.kicker')).toContainText(/Jour\s*2\b/i)
})

test('plan : la grille mène à un jour', async ({ page }) => {
  await page.goto('/')
  await nav(page, /Plan/)
  await expect(page.locator('.cell')).toHaveCount(84)
  await page.locator('.cell').nth(2).click()
  await expect(page).toHaveURL(/#\/jour\/3$/)
  await expect(page.locator('.kicker')).toContainText(/Jour\s*3\b/i)
})

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

test('vocabulaire : liste les termes', async ({ page }) => {
  await page.goto('/')
  await nav(page, /Vocabulaire/)
  expect(await page.locator('dt').count()).toBeGreaterThan(3)
})

test('hors ligne : rechargement via le service worker', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Violon cadien')
  await context.setOffline(false)
})
