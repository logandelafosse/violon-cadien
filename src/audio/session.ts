// Robustesse audio : déverrouillage iOS, reprise du contexte, verrou d'écran.
let ctxRef: (() => AudioContext | null) | null = null
let installed = false
let silent: HTMLAudioElement | null = null

// WAV silencieux (1 échantillon, 8 kHz, mono) : l'astuce <audio> fait passer le son malgré le commutateur silencieux d'iOS
const SILENT_WAV = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQIAAAAAAA=='

/** À appeler quand le contexte est créé / utilisé (idéalement dans un geste utilisateur). */
export function unlockAudio(c: AudioContext) {
  try {
    const nav = navigator as Navigator & { audioSession?: { type: string } }
    if (nav.audioSession) nav.audioSession.type = 'playback' // iOS 17+ : joue malgré le commutateur silencieux
  } catch { /* ignoré */ }
  if (!silent && typeof Audio !== 'undefined') {
    try {
      silent = new Audio(SILENT_WAV); silent.loop = true; silent.setAttribute('playsinline', '')
      silent.play().catch(() => { silent = null })
    } catch { silent = null }
  }
  if (c.state !== 'running') c.resume().catch(() => {})
}

/** Reprend le contexte au retour d'onglet et à chaque geste ; coupe tout quand la page est quittée. */
export function installLifecycle(getCtx: () => AudioContext | null, stopAll: () => void) {
  ctxRef = getCtx
  if (installed || typeof document === 'undefined') return
  installed = true
  const resume = () => {
    const c = ctxRef?.()
    if (c && c.state !== 'running' && (c.state as string) !== 'closed') c.resume().catch(() => {})
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') { resume(); if (holders.size) void acquire() }
  })
  for (const ev of ['pointerdown', 'keydown', 'touchend']) document.addEventListener(ev, resume, { passive: true })
  window.addEventListener('pagehide', stopAll)
}

// --- verrou d'écran (Screen Wake Lock) ---
let sentinel: WakeLockSentinel | null = null
const holders = new Set<string>()

async function acquire() {
  if (sentinel || typeof navigator === 'undefined' || !('wakeLock' in navigator)) return
  try {
    const s = await navigator.wakeLock.request('screen')
    if (holders.size === 0) { s.release().catch(() => {}); return } // arrêté entre-temps
    sentinel = s
    s.addEventListener('release', () => { if (sentinel === s) sentinel = null })
  } catch { sentinel = null /* refusé (économie d'énergie…) : on continue sans */ }
}

/** Demande le verrou pour une source (« metro », « drone », « song »). Idempotent. */
export function holdAwake(who: string) { holders.add(who); void acquire() }
export function releaseAwake(who: string) {
  holders.delete(who)
  if (holders.size === 0) {
    const s = sentinel; sentinel = null
    s?.release().catch(() => {})
  }
}
