import { test, expect } from '@playwright/test'
import { nav, axeClean } from './helpers'

test('vocabulaire : liste les termes', async ({ page }) => {
  await page.goto('/')
  await nav(page, /Vocabulaire/)
  expect(await page.locator('dt').count()).toBeGreaterThan(3)
})

test('vocabulaire : la recherche filtre, sans accent ni majuscule, en français et en anglais', async ({ page }) => {
  await page.goto('/#/vocabulaire')
  const total = await page.locator('dt').count()
  await expect(page.getByRole('status')).toContainText(String(total))
  const search = page.getByRole('searchbox')

  await search.fill('SEGONDEUR')
  await expect(page.locator('dt').first()).toContainText('Segondeur')
  expect(await page.locator('dt').count()).toBeLessThan(total)

  await search.fill('tenor')
  await expect(page.locator('dt')).toContainText(['Harmonie de ténor'])

  await search.fill('doubling')
  await expect(page.locator('dt').first()).toContainText('Doubler les cordes')
  await expect(page.getByRole('status')).toContainText(/trouvé/)
})

test('vocabulaire : aucun résultat, puis on efface', async ({ page }) => {
  await page.goto('/#/vocabulaire')
  const total = await page.locator('dt').count()
  const search = page.getByRole('searchbox')
  await search.fill('xyzzy')
  await expect(page.locator('dt')).toHaveCount(0)
  await expect(page.getByRole('status')).toContainText(/Aucun mot/)
  await search.fill('')
  await expect(page.locator('dt')).toHaveCount(total)
})

test('vocabulaire : axe avec la recherche et les citations', async ({ page }) => {
  await page.goto('/#/vocabulaire')
  await page.getByRole('searchbox').fill('archet')
  await axeClean(page)
})
