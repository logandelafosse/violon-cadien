import { TOTAL } from '../content/days'
import { load, save, loadState, clear, nextDay, streak, markDone, undoDone, setRating, emptyProgress, type Progress, type LoadState } from './progress'
import { storageAvailable, requestPersist } from './storage'

/** Progression de l'utilisateur, partagée par toutes les pages (plus besoin de la passer en props). */
export const store = $state<{ p: Progress }>({ p: load() })

/** État du stockage au démarrage : lisible, corrompu, ou écrit par une version plus récente. */
export const loadProblem: LoadState = loadState()
export const storageOk = storageAvailable()
requestPersist()

const commit = (np: Progress) => { store.p = np; save(np) }

export const markDay = (n: number) => commit(markDone(store.p, n))
export const undoDay = (n: number) => commit(undoDone(store.p, n))
export const rateDay = (n: number, r: number) => commit(setRating(store.p, n, r))
export const replaceProgress = commit
export function resetProgress() { clear(); commit(emptyProgress()) }

/** Prochain jour non fait (ou le dernier). */
export const currentDay = () => nextDay(store.p, TOTAL)
export const currentStreak = () => streak(store.p)
export const doneCount = () => Object.keys(store.p.done).length
