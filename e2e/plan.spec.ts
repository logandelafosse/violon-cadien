import { test, expect } from '@playwright/test'
import { nav } from './helpers'

test('plan : la grille mène à un jour', async ({ page }) => {
  await page.goto('/')
  await nav(page, /Plan/)
  await expect(page.locator('.cell')).toHaveCount(84)
  await page.locator('.cell').nth(2).click()
  await expect(page).toHaveURL(/#\/jour\/3$/)
  await expect(page.locator('.kicker')).toContainText(/Jour\s*3\b/i)
})
