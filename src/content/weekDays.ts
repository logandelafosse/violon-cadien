// Jours 22 à 84, rassemblés. Le contenu est dans weeks4to6.ts, weeks7to9.ts et weeks10to12.ts ; les gabarits dans dayKit.ts.
import type { Day } from './types'
import type { DayEn } from './days.en'
import { DAYS_PART as P1 } from './weeks4to6'
import { DAYS_PART as P2 } from './weeks7to9'
import { DAYS_PART as P3 } from './weeks10to12'

const out = [...P1, ...P2, ...P3]
export const WEEK_DAYS: Day[] = out.map((o) => o[0])
export const WEEK_DAYS_EN: Record<number, DayEn> = Object.fromEntries(out.map((o) => [o[0].jour, o[1]]))
