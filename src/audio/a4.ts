import { A4_DEFAULT, clampA4 } from './pitch'
const KEY = 'cfd.a4'
let a4 = A4_DEFAULT
try { const s = localStorage.getItem(KEY); if (s) a4 = clampA4(s) } catch { /* ignoré */ }
const subs = new Set<(v: number) => void>()

export const getA4 = () => a4
export function setA4(v: number) {
  a4 = clampA4(v)
  try { if (a4 === A4_DEFAULT) localStorage.removeItem(KEY); else localStorage.setItem(KEY, String(a4)) } catch { /* ignoré */ }
  subs.forEach((f) => f(a4))
}
export function onA4(f: (v: number) => void) { subs.add(f); return () => { subs.delete(f) } }
