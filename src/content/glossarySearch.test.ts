import { describe, expect, it } from 'vitest'
import { GLOSSARY } from './glossary'
import { norm, searchGlossary } from './glossarySearch'

describe('recherche dans le vocabulaire', () => {
  it('une recherche vide rend tous les termes', () => {
    expect(searchGlossary(GLOSSARY, '')).toHaveLength(GLOSSARY.length)
    expect(searchGlossary(GLOSSARY, '   ')).toHaveLength(GLOSSARY.length)
  })
  it('norm retire les accents, la casse et les apostrophes courbes', () => {
    expect(norm('Ténor')).toBe('tenor')
    expect(norm('Glisser dans l’accord')).toBe("glisser dans l'accord")
  })
  it('trouve par le nom français ou anglais, sans accent ni majuscule', () => {
    expect(searchGlossary(GLOSSARY, 'segondeur')[0].fr).toBe('Segondeur')
    expect(searchGlossary(GLOSSARY, 'SECOND FIDDLE').some((t) => t.fr === 'Segondeur')).toBe(true)
    expect(searchGlossary(GLOSSARY, 'tenor').some((t) => t.fr === 'Harmonie de ténor')).toBe(true)
    expect(searchGlossary(GLOSSARY, 'doubling').some((t) => t.fr === 'Doubler les cordes')).toBe(true)
  })
  it('trouve aussi dans les définitions', () => {
    expect(searchGlossary(GLOSSARY, 'accordéon').length).toBeGreaterThan(0)
  })
  it('tous les mots doivent être présents', () => {
    expect(searchGlossary(GLOSSARY, 'segondeur zzzzqq')).toHaveLength(0)
    expect(searchGlossary(GLOSSARY, 'rythmique archet').some((t) => t.fr === 'Archet rythmique')).toBe(true)
  })
  it('un terme introuvable donne une liste vide', () => {
    expect(searchGlossary(GLOSSARY, 'xyzzy')).toEqual([])
  })
  it('les noms passent avant les définitions', () => {
    const r = searchGlossary(GLOSSARY, 'shuffle')
    expect(r[0].fr.toLowerCase()).toContain('shuffle')
  })
})
