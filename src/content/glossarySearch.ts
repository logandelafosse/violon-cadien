import type { Term } from './glossary'

/** Minuscules, sans accents, apostrophes droites : « Ténor » et « tenor » se valent. */
export function norm(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’‘]/g, "'").trim()
}

/** Termes qui contiennent tous les mots cherchés (français ou anglais, nom ou définition). Les noms passent avant les définitions. */
export function searchGlossary(terms: readonly Term[], query: string): Term[] {
  const words = norm(query).split(/\s+/).filter(Boolean)
  if (!words.length) return [...terms]
  const scored: { term: Term; score: number; i: number }[] = []
  terms.forEach((term, i) => {
    const names = norm(`${term.fr} ${term.en}`)
    const rest = norm(`${term.defFr} ${term.defEn} ${term.livre}`)
    let score = 0
    for (const w of words) {
      if (names.includes(w)) score += 2
      else if (rest.includes(w)) score += 1
      else return
    }
    scored.push({ term, score, i })
  })
  return scored.sort((a, b) => b.score - a.score || a.i - b.i).map((s) => s.term)
}
