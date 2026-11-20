import { test, expect } from '@playwright/test'
import { nav } from './helpers'

test('vocabulaire : liste les termes', async ({ page }) => {
  await page.goto('/')
  await nav(page, /Vocabulaire/)
  expect(await page.locator('dt').count()).toBeGreaterThan(3)
})
