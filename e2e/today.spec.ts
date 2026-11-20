import { test, expect } from '@playwright/test'
import { trackErrors, axeClean } from './helpers'

// Page du jour : marquer fait (carte « c'est fait »), série, persistance, cartes d'étapes.

test('marquer fait : carte « c’est fait », série mise à jour, puis jour suivant', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Marquer comme fait' }).click()
  // on reste sur le jour 1 et on voit la carte
  const card = page.getByRole('status').filter({ hasText: 'c’est fait' })
  await expect(card).toContainText('Jour 1')
  await expect(page.locator('.kicker')).toContainText(/Jour\s*1\b/i)
  await expect(page.locator('.meta')).toContainText('1/84')
  await expect(page.locator('.meta')).toContainText(/Série\s*:\s*1 jour\b/)
  // la carte survit à un rechargement (l'ancre reste sur le jour 1)
  await page.reload()
  await expect(page.getByRole('status').filter({ hasText: 'c’est fait' })).toContainText('Jour 1')
  await expect(page.locator('.meta')).toContainText('1/84')
  // « Jour suivant » mène au jour 2
  await page.getByRole('link', { name: /Jour suivant/ }).click()
  await expect(page.locator('.kicker')).toContainText(/Jour\s*2\b/i)
  // et l'ouverture normale de l'appli propose maintenant le jour 2
  await page.goto('/')
  await expect(page.locator('.kicker')).toContainText(/Jour\s*2\b/i)
})

test('marquer fait : annuler remet le bouton', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Marquer comme fait' }).click()
  await page.getByRole('button', { name: /annuler/ }).click()
  await expect(page.getByRole('button', { name: 'Marquer comme fait' })).toBeVisible()
  await expect(page.locator('.meta')).toContainText('0/84')
})

test('cartes d’étapes : cordes, bourdon, métronome, autoévaluation', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#/jour/3')
  // cordes à vide : quatre pastilles
  await page.goto('/#/jour/1')
  for (const n of ['Fa', 'Do', 'Sol', 'Ré']) await expect(page.getByRole('button', { name: n, exact: true }).first()).toBeVisible()
  // bourdon : bascule avec aria-pressed
  await page.goto('/#/jour/3')
  const drone = page.getByRole('button', { name: /Bourdon de/ }).first()
  await expect(drone).toHaveAttribute('aria-pressed', 'false')
  await drone.click()
  await expect(drone).toHaveAttribute('aria-pressed', 'true')
  await expect(drone).toContainText('en cours')
  await drone.click()
  await expect(drone).toHaveAttribute('aria-pressed', 'false')
  // métronome : Démarrer → Arrêter, tempo modifiable puis bloqué en marche
  const start = page.getByRole('button', { name: 'Démarrer' }).first()
  await start.click()
  await expect(page.getByRole('button', { name: 'Arrêter' }).first()).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('spinbutton', { name: 'Tempo' }).first()).toBeDisabled()
  await page.getByRole('button', { name: 'Arrêter' }).first().click()
  const tempo = page.getByRole('spinbutton', { name: 'Tempo' }).first()
  const before = Number(await tempo.inputValue())
  await page.getByRole('button', { name: 'Plus vite' }).first().click()
  await expect(tempo).toHaveValue(String(before + 1))
  // autoévaluation : cases cochables, non enregistrées
  const box = page.getByRole('checkbox').first()
  await box.check()
  await expect(box).toBeChecked()
  await page.reload()
  await expect(page.getByRole('checkbox').first()).not.toBeChecked()
  expect(errors).toEqual([])
})

test('lien chanson : mène aux chansons du jour', async ({ page }) => {
  await page.goto('/#/jour/17')
  await page.getByRole('link', { name: /Pratique avec une chanson/ }).click()
  await expect(page).toHaveURL(/#\/chansons\/17/)
})

test('jour de révision : note de 1 à 5 après « fait »', async ({ page }) => {
  await page.goto('/#/jour/7')
  await page.getByRole('button', { name: 'Marquer comme fait' }).click()
  await page.getByRole('button', { name: /Note 4\/5/ }).click()
  await expect(page.getByRole('button', { name: /Note 4\/5/ })).toHaveAttribute('aria-pressed', 'true')
})

test('axe : page du jour et carte « c’est fait »', async ({ page }) => {
  await page.goto('/#/jour/3')
  await axeClean(page)
  await page.getByRole('button', { name: 'Marquer comme fait' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'c’est fait' })).toBeVisible()
  await axeClean(page)
})
