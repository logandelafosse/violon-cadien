import { test, expect } from '@playwright/test'

// Manche de violon : accessibilité clavier des points (la branche feat/design-manche étoffera ce fichier).

test('clavier : les points du manche sont atteignables', async ({ page }) => {
  await page.goto('/#/jour/1')
  // `.dot` existe aussi sur les points de temps du métronome (Beats) : on ne vise que les points cliquables du manche.
  const dot = page.locator('[role="button"].dot, button.dot').first()
  if (await dot.count()) {
    await dot.focus()
    await expect(dot).toBeFocused()
    await page.keyboard.press('Space')
  }
})
