import { test, expect } from '@playwright/test'
import { nav } from './helpers'

// Coque de l'application : en-tête, langue, thème, polices, hors ligne.

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

test('thème : data-theme change, persiste, et la couleur de la barre suit', async ({ page }) => {
  await page.goto('/')
  await page.locator('.themesel select').selectOption('minuit')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'minuit')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0b0a08')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'minuit')
  await nav(page, /Réglages/)
  await page.locator('.th').nth(2).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'papier')
})

test('polices auto-hébergées chargées', async ({ page }) => {
  await page.goto('/')
  const ok = await page.evaluate(async () => {
    await document.fonts.ready
    return document.fonts.check('700 20px "Zilla Slab"') && document.fonts.check('400 16px "Atkinson Hyperlegible"')
  })
  expect(ok).toBe(true)
})

test('hors ligne : rechargement via le service worker, polices comprises', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Violon cadien')
  const fonts = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('700 20px "Zilla Slab"') })
  expect(fonts).toBe(true)
  await context.setOffline(false)
})
