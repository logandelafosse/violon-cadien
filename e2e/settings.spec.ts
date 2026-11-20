import { test, expect } from '@playwright/test'
import { nav } from './helpers'

test('réglages : la page s’ouvre et propose export et import', async ({ page }) => {
  await page.goto('/')
  await nav(page, /Réglages/)
  await expect(page.getByRole('button', { name: /Exporter/ })).toBeVisible()
  await expect(page.getByText(/Importer une sauvegarde/)).toBeVisible()
})
