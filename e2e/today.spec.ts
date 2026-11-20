import { test, expect } from '@playwright/test'

// Page du jour : marquer fait, série, persistance.

test('marquer fait : série mise à jour et persistante', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Marquer comme fait' }).click()
  await expect(page.locator('.meta')).toContainText('1/84')
  await expect(page.locator('.meta')).toContainText(/Série\s*:\s*1 jour\b/)
  await page.reload()
  await expect(page.locator('.meta')).toContainText('1/84')
  await expect(page.locator('.kicker')).toContainText(/Jour\s*2\b/i)
})
