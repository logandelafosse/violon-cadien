import { test, expect } from '@playwright/test'
import { THEMES, SCREENS, axeClean } from './helpers'

// Matrice d'accessibilité : 5 thèmes × clair/sombre × 5 écrans. À garder au vert après CHAQUE fusion.
for (const scheme of ['light', 'dark'] as const) {
  for (const theme of THEMES) {
    for (const [name, route] of SCREENS) {
      test(`axe : ${name} / ${theme} / ${scheme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme })
        await page.addInitScript((th) => localStorage.setItem('cfd.theme', th), theme)
        await page.goto(`/#${route}`)
        await expect(page.locator('main h2').first()).toBeVisible()
        await axeClean(page)
      })
    }
  }
}

test('clavier : les cases du plan sont atteignables', async ({ page }) => {
  await page.goto('/#/plan')
  const cell = page.locator('.cell').first()
  await cell.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#\/jour\/1$/)
})

test('focus visible et mouvement réduit', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#/plan')
  await page.keyboard.press('Tab')
  const outline = await page.evaluate(() => { const s = getComputedStyle(document.activeElement!); return s.outlineStyle + ' ' + s.outlineWidth })
  expect(outline).not.toMatch(/none|^\S+ 0px/)
  const dur = await page.evaluate(() => getComputedStyle(document.querySelector('.sw i')!).transitionDuration)
  expect(parseFloat(dur)).toBeLessThan(0.01)
})
