import { describe, expect, it } from 'vitest'
import { MODULES, i18n, t, tf, fill, type Key } from '../i18n.svelte'

describe('modules de textes', () => {
  it('aucune clé n’apparaît dans deux modules', () => {
    const seen = new Map<string, number>()
    MODULES.forEach((m, i) => {
      for (const k of Object.keys(m.fr)) {
        expect(seen.has(k), `clé en double : ${k} (modules ${seen.get(k)} et ${i})`).toBe(false)
        seen.set(k, i)
      }
    })
  })
  it('le français et l’anglais ont exactement les mêmes clés', () => {
    for (const m of MODULES) expect(Object.keys(m.en).sort()).toEqual(Object.keys(m.fr).sort())
  })
  it('aucun texte français ne dit « cajun » (on dit cadien)', () => {
    for (const m of MODULES) for (const [k, v] of Object.entries(m.fr)) expect(v, k).not.toMatch(/cajun/i)
  })
  it('plus aucun glyphe de lecture dans les textes (ce sont des icônes)', () => {
    for (const m of MODULES) for (const lang of ['fr', 'en'] as const) for (const [k, v] of Object.entries(m[lang])) {
      expect(v, `${lang}.${k}`).not.toMatch(/[♪▶■⏱✓★]/)
    }
  })
  it('aucun texte vide', () => {
    for (const m of MODULES) for (const lang of ['fr', 'en'] as const) for (const [k, v] of Object.entries(m[lang])) {
      expect((v as string).length, `${lang}.${k}`).toBeGreaterThan(0)
    }
  })
})

describe('t et tf', () => {
  it('t suit la langue', () => {
    i18n.lang = 'fr'
    expect(t('nav_plan')).toBe('Plan')
    i18n.lang = 'en'
    expect(t('nav_jour')).toBe('Today')
    i18n.lang = 'fr'
  })
  it('fill remplace les {paramètres} et laisse les inconnus', () => {
    expect(fill('Jour {n} sur {m} {x}', { n: 3, m: 84 })).toBe('Jour 3 sur 84 {x}')
    expect(fill('{n} jours · {n}', { n: 1 })).toBe('1 jours · 1')
  })
  it('tf sans paramètre dans le texte renvoie le texte', () => {
    expect(tf('nav_plan' as Key, { n: 1 })).toBe('Plan')
  })
})
