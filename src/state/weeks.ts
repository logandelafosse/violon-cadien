/** Les 84 jours se découpent en 12 semaines de 7 jours : la barre de progression de l'en-tête a un segment par semaine. */
export const WEEKS_TOTAL = 12
export const DAYS_PER_WEEK = 7

/** Semaine (1 à 12) d'un jour (1 à 84) ; les valeurs hors plage sont ramenées dans l'intervalle. */
export const weekOf = (day: number): number => Math.min(WEEKS_TOTAL, Math.max(1, Math.ceil(day / DAYS_PER_WEEK)))

/** Nombre de jours faits dans chacune des 12 semaines (0 à 7). Les jours hors 1–84 et les doublons sont ignorés. */
export function weekCounts(doneDays: Iterable<number>): number[] {
  const counts = Array.from({ length: WEEKS_TOTAL }, () => 0)
  const seen = new Set<number>()
  for (const d of doneDays) {
    if (!Number.isInteger(d) || d < 1 || d > WEEKS_TOTAL * DAYS_PER_WEEK || seen.has(d)) continue
    seen.add(d)
    counts[weekOf(d) - 1]++
  }
  return counts
}

/** Part remplie d'un segment, en pourcentage entier (0 à 100). */
export const weekPercent = (n: number): number => Math.round((Math.min(DAYS_PER_WEEK, Math.max(0, n)) / DAYS_PER_WEEK) * 100)
