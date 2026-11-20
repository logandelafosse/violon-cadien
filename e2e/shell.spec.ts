import { test, expect } from '@playwright/test'
import { nav, axeClean } from './helpers'

// Coque de l'application : en-tête, langue, thème, progression, barre d'onglets, polices, hors ligne.

test('premier chargement : leçon du jour 1 en français', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Violon cadien')
  await expect(page.locator('.kicker')).toContainText(/Jour\s*1\b/i)
  await expect(page.locator('.meta')).toContainText('0/84')
})

test('changement de langue : interface et noms de notes', async ({ page }) => {
  await page.goto('/#/chansons/1')
  await expect(page.locator('body')).toContainText(/\b(Do|Ré|Sol)\b/)
  const langue = page.getByRole('group', { name: 'Langue' })
  await expect(langue.getByRole('button', { name: 'FR' })).toHaveAttribute('aria-pressed', 'true')
  await langue.getByRole('button', { name: 'EN' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  // le nom du groupe suit la langue : il s'appelle maintenant « Language »
  await expect(page.getByRole('group', { name: 'Language' }).getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Day by Day')
  await expect(page.locator('nav')).toContainText('Settings')
  await expect(page.locator('body')).not.toContainText(/\b(Ré|Mi bémol)\b/)
  await expect(page.locator('body')).toContainText(/\b[CDEFGAB]\b/)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('thème : le bouton ouvre le choix, data-theme change, persiste, et la couleur de la barre suit', async ({ page }) => {
  await page.goto('/')
  const bouton = page.getByRole('button', { name: /^Thème :/ })
  await expect(bouton).toHaveAttribute('aria-expanded', 'false')
  await bouton.click()
  await expect(bouton).toHaveAttribute('aria-expanded', 'true')
  const choix = page.getByRole('group', { name: 'Thème' })
  // le focus va sur le thème actif
  await expect(choix.getByRole('radio', { checked: true })).toBeFocused()
  await choix.getByRole('radio', { name: 'Minuit' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'minuit')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0b0a08')
  // le panneau reste ouvert pour comparer, et le bouton annonce le thème courant
  await expect(choix).toBeVisible()
  await expect(bouton).toHaveAttribute('aria-label', 'Thème : Minuit')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'minuit')
  await nav(page, /Réglages/)
  await page.locator('.th').nth(2).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'papier')
})

test('thème : Échap ferme le panneau et rend le focus au bouton ; un clic dehors le ferme aussi', async ({ page }) => {
  await page.goto('/')
  const bouton = page.getByRole('button', { name: /^Thème :/ })
  const choix = page.getByRole('group', { name: 'Thème' })
  await bouton.click()
  await expect(choix).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(choix).toHaveCount(0)
  await expect(bouton).toBeFocused()
  await expect(bouton).toHaveAttribute('aria-expanded', 'false')
  await bouton.click()
  await expect(choix).toBeVisible()
  // Clic en dehors du panneau : juste sous lui s'il reste de la place (sur un petit téléphone il peut couvrir tout le contenu ;
  // dans ce cas, la fermeture se fait par Échap ou par le bouton Fermer, testés autour).
  const box = (await choix.boundingBox())!
  const vh = page.viewportSize()!.height
  if (box.y + box.height + 12 < vh - 80) {
    await page.mouse.click(8, box.y + box.height + 12)
    await expect(choix).toHaveCount(0)
  } else {
    await page.keyboard.press('Escape')
    await expect(choix).toHaveCount(0)
  }
  // le bouton fermer rend aussi le focus
  await bouton.click()
  await page.getByRole('button', { name: 'Fermer le choix du thème' }).click()
  await expect(choix).toHaveCount(0)
  await expect(bouton).toBeFocused()
})

test('thème : les flèches changent de thème dans le panneau ouvert', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /^Thème :/ }).click()
  const choix = page.getByRole('group', { name: 'Thème' })
  await expect(choix.getByRole('radio', { name: 'Drapeau' })).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'bayou')
  await expect(choix.getByRole('radio', { name: 'Bayou' })).toBeFocused()
})

test('accessibilité : le panneau de thème ouvert passe axe', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /^Thème :/ }).click()
  await expect(page.getByRole('group', { name: 'Thème' })).toBeVisible()
  await axeClean(page)
})

test('progression : 12 segments, étiquette parlante qui suit les jours faits', async ({ page }) => {
  await page.goto('/')
  const barre = page.locator('.weeks')
  await expect(barre).toHaveAttribute('role', 'img')
  await expect(barre.locator('.seg')).toHaveCount(12)
  await expect(barre).toHaveAttribute('aria-label', '0 jours faits sur 84, semaine 1 sur 12')
  await page.getByRole('button', { name: 'Marquer comme fait' }).click()
  await expect(barre).toHaveAttribute('aria-label', '1 jours faits sur 84, semaine 1 sur 12')
  // le premier segment est rempli à 1/7 (14 %)
  await expect(barre.locator('.seg').first()).toHaveAttribute('style', /--p:\s*14%/)
  await expect(barre.locator('.seg').nth(1)).toHaveAttribute('style', /--p:\s*0%/)
})

test('barre d’onglets : liens avec aria-current sur la page courante', async ({ page }) => {
  await page.goto('/')
  const barre = page.getByRole('navigation', { name: 'Navigation principale' })
  const liens = barre.getByRole('link')
  await expect(liens).toHaveCount(5)
  await expect(barre.getByRole('link', { name: /Aujourd’hui/ })).toHaveAttribute('aria-current', 'page')
  await expect(barre.getByRole('link', { name: /Plan/ })).not.toHaveAttribute('aria-current', /.+/)
  await nav(page, /Chansons/)
  await expect(page).toHaveURL(/#\/chansons/)
  await expect(barre.getByRole('link', { name: /Chansons/ })).toHaveAttribute('aria-current', 'page')
  await expect(barre.getByRole('link', { name: /Aujourd’hui/ })).not.toHaveAttribute('aria-current', /.+/)
  // un jour précis reste sous l'onglet Aujourd'hui
  await page.goto('/#/jour/3')
  await expect(barre.getByRole('link', { name: /Aujourd’hui/ })).toHaveAttribute('aria-current', 'page')
})

test('polices auto-hébergées chargées', async ({ page }) => {
  await page.goto('/')
  const ok = await page.evaluate(async () => {
    await document.fonts.ready
    return document.fonts.check('700 20px "Zilla Slab"') && document.fonts.check('400 16px "Atkinson Hyperlegible"')
  })
  expect(ok).toBe(true)
})

test('hors ligne : rechargement via le service worker, polices comprises', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Violon cadien')
  const fonts = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('700 20px "Zilla Slab"') })
  expect(fonts).toBe(true)
  await context.setOffline(false)
})
