import { test, expect } from '@playwright/test'
import { nav } from './helpers'

test('vocabulaire : liste les termes', async ({ page }) => {
  await page.goto('/')
  await nav(page, /Vocabulaire/)
  // assertion avec attente : la navigation par ancre est asynchrone (les onglets sont maintenant des liens)
  await expect.poll(() => page.locator('dt').count()).toBeGreaterThan(3)
})
