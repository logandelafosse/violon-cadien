import { test, expect } from '@playwright/test'

// Mode pupitre : la vue arrive avec la branche feat/mode-pupitre. En attendant : l'état par défaut est « désactivé ».

test('pupitre : désactivé par défaut, la page du jour reste normale', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('nav')).toBeVisible()
  await expect(page.locator('html')).not.toHaveAttribute('data-pupitre', /.*/)
})
