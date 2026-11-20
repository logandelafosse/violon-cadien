import { test, expect } from '@playwright/test'
import { nav, trackErrors } from './helpers'

test('chansons : sélecteur de leçon et Jouer/Stop sans erreur', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/')
  await nav(page, /Chansons/)
  const picker = page.locator('label.lesson select')
  const values = await picker.locator('option').evaluateAll((o) => o.map((x) => (x as HTMLOptionElement).value))
  const last = values[values.length - 1]
  await picker.selectOption(last)
  await expect(page).toHaveURL(new RegExp(`#/chansons/${last}$`))
  const play = page.locator('button.main')
  await play.click()
  await expect(play).toHaveClass(/on/)
  await play.click()
  await expect(play).not.toHaveClass(/on/)
  expect(errors).toEqual([])
})
