import { test, expect } from '@playwright/test'
import { nav, axeClean } from './helpers'

test('réglages : la page s’ouvre et propose export et import', async ({ page }) => {
  await page.goto('/')
  await nav(page, /Réglages/)
  await expect(page.getByRole('button', { name: /Exporter/ })).toBeVisible()
  await expect(page.getByText(/Importer une sauvegarde/)).toBeVisible()
})

test('réglages : le thème se choisit dans un groupe à cases radio, au clavier aussi', async ({ page }) => {
  await page.goto('/#/reglages')
  const group = page.getByRole('radiogroup', { name: /Thème/ })
  await expect(group.getByRole('radio')).toHaveCount(5)
  await group.getByRole('radio', { name: /Minuit/ }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'minuit')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'epure')
})

test('réglages : le bouton d’import s’atteint au clavier et ouvre le sélecteur de fichier', async ({ page }) => {
  await page.goto('/#/reglages')
  const button = page.getByRole('button', { name: /Importer une sauvegarde/ })
  await button.focus()
  const chooser = page.waitForEvent('filechooser')
  await page.keyboard.press('Enter')
  expect(await chooser).toBeTruthy()
})

test('réglages : importer un fichier invalide ne change rien et le dit', async ({ page }) => {
  await page.goto('/#/reglages')
  await page.locator('input[type=file]').setInputFiles({ name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('pas du json') })
  await expect(page.getByRole('status')).toContainText(/impossible/i)
})

test('réglages : exporter note la date du dernier export', async ({ page }) => {
  await page.goto('/#/reglages')
  await expect(page.getByText(/Dernier export : jamais/)).toBeVisible()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: /Exporter/ }).click()
  await download
  await expect(page.getByText(/Dernier export : jamais/)).toHaveCount(0)
  await expect(page.getByText(/Dernier export/)).toBeVisible()
  await page.reload()
  await expect(page.getByText(/Dernier export : jamais/)).toHaveCount(0)
})

test('réglages : le La de référence change, persiste et suit le pas du compteur', async ({ page }) => {
  await page.goto('/#/reglages')
  const input = page.getByRole('spinbutton', { name: /Diapason en hertz/ })
  await expect(input).toHaveValue('440')
  await page.getByRole('button', { name: 'Plus haut' }).click()
  await page.getByRole('button', { name: 'Plus haut' }).click()
  await expect(input).toHaveValue('442')
  await page.reload()
  await expect(page.getByRole('spinbutton', { name: /Diapason en hertz/ })).toHaveValue('442')
  await page.getByRole('button', { name: /Revenir à 440/ }).click()
  await expect(page.getByRole('spinbutton', { name: /Diapason en hertz/ })).toHaveValue('440')
})

test('réglages : réinitialiser demande une confirmation avec les chiffres', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Marquer comme fait/ }).click()
  await page.goto('/#/reglages')
  await page.getByRole('button', { name: /Réinitialiser…/ }).click()
  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toContainText(/1 jour fait/)
  await axeClean(page)
  // « Garder » referme sans rien effacer et rend le focus au bouton
  await dialog.getByRole('button', { name: 'Garder' }).click()
  await expect(page.getByRole('button', { name: /Réinitialiser…/ })).toBeFocused()
  await page.goto('/#/plan')
  await expect(page.locator('.cell.done')).toHaveCount(1)
  // confirmer efface
  await page.goto('/#/reglages')
  await page.getByRole('button', { name: /Réinitialiser…/ }).click()
  await page.getByRole('button', { name: /Oui, tout effacer/ }).click()
  await page.goto('/#/plan')
  await expect(page.locator('.cell.done')).toHaveCount(0)
})

test('réglages : axe sur la page entière', async ({ page }) => {
  await page.goto('/#/reglages')
  await axeClean(page)
})
