import { freq } from '../theory/fiddle'
import { getA4 } from './a4'
import { unlockAudio, installLifecycle, holdAwake, releaseAwake } from './session'

let ctx: AudioContext | null = null
const stoppers = new Set<() => void>()
/** Enregistre une action d'arrêt (chansons en cours…) appelée par stopAll(). Renvoie la fonction de retrait. */
export function addStopper(f: () => void) { stoppers.add(f); return () => { stoppers.delete(f) } }
/** Coupe tout ce qui joue (bourdon, métronome, chansons) et libère le verrou d'écran. */
export function stopAll() { stopDrone(); stopMetronome(); [...stoppers].forEach((f) => f()) }

export function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new AC()
    installLifecycle(() => ctx, stopAll)
  }
  unlockAudio(ctx)
  return ctx
}

// --- réverbération partagée (impulsion bruitée, courte) ---
let verb: ConvolverNode | null = null
function reverb(c: AudioContext) {
  if (verb) return verb
  const len = Math.floor(c.sampleRate * 1.3)
  const buf = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8)
  }
  verb = c.createConvolver(); verb.buffer = buf
  const wet = c.createGain(); wet.gain.value = 0.35
  verb.connect(wet); wet.connect(c.destination)
  return verb
}

/** Voix de violon : dents de scie légèrement désaccordées, filtre qui s'ouvre, vibrato retardé, résonances du corps. */
export function reed(c: AudioContext, midi: number, t: number, dur: number, gain: number, dest: AudioNode) {
  const f0 = freq(midi, getA4())
  const g = c.createGain()
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.7
  lp.frequency.setValueAtTime(900, t); lp.frequency.linearRampToValueAtTime(3200, t + 0.12)
  const body1 = c.createBiquadFilter(); body1.type = 'peaking'; body1.frequency.value = 450; body1.gain.value = 4
  const body2 = c.createBiquadFilter(); body2.type = 'peaking'; body2.frequency.value = 2200; body2.gain.value = 3
  const lfo = c.createOscillator(), lfoG = c.createGain()
  lfo.frequency.value = 5.3
  lfoG.gain.setValueAtTime(0, t); lfoG.gain.linearRampToValueAtTime(7, t + Math.min(0.35, dur)) // cents
  lfo.connect(lfoG)
  const oscs = [-3, 3].map((det) => {
    const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f0; o.detune.value = det
    lfoG.connect(o.detune); o.connect(lp); return o
  })
  lp.connect(body1); body1.connect(body2); body2.connect(g); g.connect(dest); g.connect(reverb(c))
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + 0.05)
  g.gain.setValueAtTime(gain * 0.9, t + Math.max(dur - 0.08, 0.06))
  g.gain.linearRampToValueAtTime(0, t + dur)
  lfo.start(t); oscs.forEach((o) => o.start(t))
  lfo.stop(t + dur + 0.1); oscs.forEach((o) => o.stop(t + dur + 0.1))
}

/** Voix d'accordéon (anches « musette » : une anche légèrement plus haute, une octave plus bas en sourdine). */
export function accordion(c: AudioContext, midi: number, t: number, dur: number, gain: number, dest: AudioNode) {
  const f0 = freq(midi, getA4())
  const g = c.createGain()
  const bp = c.createBiquadFilter(); bp.type = 'lowpass'; bp.frequency.value = 2600
  const nasal = c.createBiquadFilter(); nasal.type = 'peaking'; nasal.frequency.value = 1100; nasal.gain.value = 6; nasal.Q.value = 1.2
  ;[
    { type: 'sawtooth' as const, f: f0, det: -8, v: 0.5 },
    { type: 'sawtooth' as const, f: f0, det: 8, v: 0.5 },
    { type: 'square' as const, f: f0 / 2, det: 0, v: 0.25 },
  ].forEach((r) => {
    const o = c.createOscillator(), og = c.createGain()
    o.type = r.type; o.frequency.value = r.f; o.detune.value = r.det; og.gain.value = r.v
    o.connect(og); og.connect(bp); o.start(t); o.stop(t + dur + 0.05)
  })
  bp.connect(nasal); nasal.connect(g); g.connect(dest); g.connect(reverb(c))
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0005, t + dur)
}

/** Joue une suite de notes sonores (MIDI). */
export function playNotes(notes: number[], bpm = 80, beats = 1) {
  const c = audio(), d = (60 / bpm) * beats
  notes.forEach((m, i) => reed(c, m, c.currentTime + 0.05 + i * d, d * 0.95, 0.12, c.destination))
  return notes.length * d
}

export function playTone(midi: number, dur = 1.5) { reed(audio(), midi, audio().currentTime + 0.02, dur, 0.15, audio().destination) }

// --- bourdon ---
let droneNodes: { stop: () => void } | null = null
export const droneOn = () => droneNodes !== null
export function startDrone(midis: number[], volume = 0.08) {
  stopDrone()
  const c = audio()
  const master = c.createGain(); master.gain.value = volume; master.connect(c.destination)
  const stops: (() => void)[] = []
  for (const m of midis) {
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1400; f.connect(master)
    for (const det of [-5, 5]) {
      const o = c.createOscillator(); o.type = 'sawtooth'
      o.frequency.value = freq(m, getA4()); o.detune.value = det
      o.connect(f); o.start(); stops.push(() => o.stop())
    }
  }
  droneNodes = { stop: () => { stops.forEach((s) => s()); master.disconnect() } }
  holdAwake('drone')
}
export function stopDrone() { droneNodes?.stop(); droneNodes = null; releaseAwake('drone') }

// --- métronome ---
let timer: number | null = null
export const metroOn = () => timer !== null
export function startMetronome(bpm: number, beatsPerBar: 2 | 3 | 4, onBeat?: (beat: number) => void) {
  stopMetronome()
  const c = audio()
  let next = c.currentTime + 0.1, beat = 0
  const interval = 60 / bpm
  timer = window.setInterval(() => {
    while (next < c.currentTime + 0.12) {
      const o = c.createOscillator(), g = c.createGain()
      const strong = beat % beatsPerBar === 0
      o.frequency.value = strong ? 1500 : 1000
      g.gain.setValueAtTime(strong ? 0.35 : 0.2, next); g.gain.exponentialRampToValueAtTime(0.001, next + 0.06)
      o.connect(g); g.connect(c.destination); o.start(next); o.stop(next + 0.07)
      const b = beat % beatsPerBar
      setTimeout(() => onBeat?.(b), Math.max(0, (next - c.currentTime) * 1000))
      next += interval; beat++
    }
  }, 25)
  holdAwake('metro')
}
export function stopMetronome() { if (timer !== null) clearInterval(timer); timer = null; releaseAwake('metro') }
