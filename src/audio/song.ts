import { audio, reed, accordion, addStopper } from './engine'
import { getA4 } from './a4'
import { freq } from '../theory/fiddle'
import { holdAwake, releaseAwake } from './session'
import { BASS, CHUCK, type Song } from '../content/songs'
import { DOUBLING, strokes, type Style } from '../content/seconding'

export interface Handle { stop: () => void; duration: number }

/** Joue la chanson `loops` fois : décompte d'une mesure, puis mélodie et/ou accompagnement.
 * `onNote(i, loop)` : indice de la note qui joue et numéro du tour (0 à loops - 1) ; `onNote(null)` à l'arrêt. */
export function playSong(
  song: Song, opts: { bpm: number; melodie: boolean; accompagnement: boolean; segondeur: Style | 'off'; loops: number },
  onNote: (i: number | null, loop?: number) => void, onEnd: () => void,
): Handle {
  const c = audio()
  const beat = 60 / opts.bpm
  const a4 = getA4()
  const master = c.createGain(); master.gain.value = 1; master.connect(c.destination)
  const t0 = c.currentTime + 0.1
  const count = song.mesure // temps de décompte
  const barBeats = song.mesure
  const total = song.accords.length * barBeats
  const timers: number[] = []

  const click = (t: number, strong: boolean) => {
    const o = c.createOscillator(), g = c.createGain()
    o.frequency.value = strong ? 1500 : 1000
    g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.06)
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.07)
  }
  const bass = (m: number, t: number) => {
    const f = freq(m, a4)
    const g = c.createGain(), lp = c.createBiquadFilter()
    lp.type = 'lowpass'; lp.frequency.value = 700
    ;[['triangle', f, 0.4], ['sawtooth', f, 0.12], ['sine', f / 2, 0.2]].forEach(([ty, fr, v]) => {
      const o = c.createOscillator(), og = c.createGain()
      o.type = ty as OscillatorType; o.frequency.value = fr as number; og.gain.value = v as number
      o.connect(og); og.connect(lp); o.start(t); o.stop(t + beat)
    })
    lp.connect(g); g.connect(master)
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.55, t + 0.012); g.gain.exponentialRampToValueAtTime(0.001, t + beat * 0.85)
  }
  const chuck = (ms: number[], t: number) => ms.forEach((m) => accordion(c, m, t, beat * 0.28, 0.06, master))

  for (let i = 0; i < count; i++) click(t0 + i * beat, i === 0)

  for (let L = 0; L < opts.loops; L++) {
    const start = t0 + (count + L * total) * beat
    if (opts.accompagnement) {
      song.accords.forEach((a, bar) => {
        for (let b = 0; b < barBeats; b++) {
          const t = start + (bar * barBeats + b) * beat
          if (b === 0) bass(BASS[a], t); else chuck(CHUCK[a], t)
        }
      })
    }
    if (opts.segondeur !== 'off') {
      const st = strokes(opts.segondeur, song.mesure)
      song.accords.forEach((a, bar) => {
        const [lo, hi] = DOUBLING[a]
        st.forEach((k) => {
          const t = start + (bar * barBeats + k.t) * beat
          const g = k.fort ? 0.09 : 0.06
          if (k.kind === 'roule') {
            // le long coup roule de la corde grave vers l'aiguë : trois sons très rapprochés
            ;[lo - 12, lo, hi].forEach((m, i) => reed(c, m, t + i * 0.025, k.d * beat * 0.95, g, master))
          } else {
            reed(c, lo, t, k.d * beat * 0.9, g, master)
            reed(c, hi, t, k.d * beat * 0.9, g, master)
          }
        })
      })
    }
    let pos = 0
    song.melodie.forEach((n, i) => {
      const t = start + pos * beat
      if (opts.melodie) reed(c, n.m, t, n.d * beat * 0.95, 0.12, master)
      timers.push(window.setTimeout(() => onNote(i, L), Math.max(0, (t - c.currentTime) * 1000)))
      pos += n.d
    })
  }
  const end = (count + opts.loops * total) * beat
  const id = 'song' + Math.random()
  holdAwake(id)
  let done = false
  const finish = () => { if (done) return false; done = true; unreg(); releaseAwake(id); return true }
  const unreg = addStopper(() => handle.stop())
  timers.push(window.setTimeout(() => { finish(); onNote(null); onEnd() }, (t0 - c.currentTime + end) * 1000))
  const handle: Handle = {
    duration: end,
    stop() {
      finish()
      timers.forEach(clearTimeout)
      master.gain.cancelScheduledValues(c.currentTime); master.gain.setTargetAtTime(0, c.currentTime, 0.02)
      setTimeout(() => master.disconnect(), 200)
      onNote(null)
    },
  }
  return handle
}
