import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test'

const THEMES = ['drapeau', 'bayou', 'papier', 'minuit', 'epure']
const SCREENS: [string, string][] = [
  ['aujourd’hui', '/'],
  ['plan', '/plan'],
  ['chansons', '/chansons/1'],
  ['vocabulaire', '/vocabulaire'],
  ['réglages', '/reglages'],
]

for (const scheme of ['light', 'dark'] as const) {
  for (const theme of THEMES) {
    for (const [name, route] of SCREENS) {
      test(`axe : ${name} / ${theme} / ${scheme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme })
        await page.addInitScript((th) => localStorage.setItem('cfd.theme', th), theme)
        await page.goto(`/#${route}`)
        await expect(page.locator('main h2').first()).toBeVisible()
        const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
        expect(violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ') + ' ' + (n.any[0]?.message ?? '')).join(' | ')}`)).toEqual([])
      })
    }
  }
}

test('clavier : les points du manche et les cases du plan sont atteignables', async ({ page }) => {
  await page.goto('/#/jour/1')
  const dot = page.locator('.dot').first()
  if (await dot.count()) {
    await dot.focus()
    await expect(dot).toBeFocused()
    await page.keyboard.press('Space')
  }
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
