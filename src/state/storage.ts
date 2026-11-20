// Accès localStorage sûr : ne lève jamais d'exception (mode privé, stockage bloqué, quota).
export function safeGet(key: string): string | null {
  try { return localStorage.getItem(key) } catch { return null }
}
export function safeSet(key: string, value: string): boolean {
  try { localStorage.setItem(key, value); return true } catch { return false }
}
export function safeRemove(key: string): boolean {
  try { localStorage.removeItem(key); return true } catch { return false }
}
/** Vrai si on peut réellement écrire puis relire dans localStorage. */
export function storageAvailable(): boolean {
  const k = 'cfd.probe'
  try {
    localStorage.setItem(k, '1')
    const ok = localStorage.getItem(k) === '1'
    localStorage.removeItem(k)
    return ok
  } catch { return false }
}
/** Demande un stockage persistant (non effaçable par le navigateur) quand c'est possible. */
export async function requestPersist(): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
      if (navigator.storage.persisted && (await navigator.storage.persisted())) return true
      return await navigator.storage.persist()
    }
  } catch { /* ignoré */ }
  return false
}
