<script lang="ts">
  import { detectPitch, nearestString, verdict, nearestMidi, a4FromReference, A4_DEFAULT, A4_MIN, A4_MAX } from '../audio/pitch'
  import { getA4, setA4 } from '../audio/a4'
  import { stringLabel, noteName } from '../theory/fiddle'
  import { t } from '../i18n.svelte'

  let { onclose }: { onclose?: () => void } = $props()

  let mode = $state<'tune' | 'calib'>('tune')
  let running = $state(false)
  let error = $state<'' | 'refuse' | 'absent' | 'erreur'>('')
  let a4 = $state(getA4())
  let hz = $state<number | null>(null)
  let measured = $state<number | null>(null) // fréquence stable (calibrage)

  let stream: MediaStream | null = null
  let ac: AudioContext | null = null
  let raf = 0
  let recent: number[] = []

  const target = $derived(hz ? nearestString(hz, a4) : null)
  const v = $derived(target ? verdict(target.cents) : null)
  const needle = $derived(target ? Math.max(-50, Math.min(50, target.cents)) : 0)
  const proposed = $derived(measured ? a4FromReference(measured, nearestMidi(measured)) : null)
  const refNote = $derived(measured ? noteName(nearestMidi(measured), 'C', true) : '')

  function median(a: number[]) { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] }

  async function start() {
    error = ''
    if (!navigator.mediaDevices?.getUserMedia) { error = 'absent'; return }
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
    } catch (e) {
      const n = (e as DOMException)?.name
      error = n === 'NotAllowedError' || n === 'SecurityError' ? 'refuse' : n === 'NotFoundError' || n === 'OverconstrainedError' ? 'absent' : 'erreur'
      return
    }
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ac = new AC() // contexte séparé : le micro n'est jamais relié aux haut-parleurs
      await ac.resume()
      const an = ac.createAnalyser(); an.fftSize = 4096
      ac.createMediaStreamSource(stream).connect(an)
      const buf = new Float32Array(an.fftSize)
      running = true
      let last = 0
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop)
        if (now - last < 60) return
        last = now
        an.getFloatTimeDomainData(buf)
        const p = detectPitch(buf, ac!.sampleRate)
        if (p && p.clarity > 0.85) {
          recent.push(p.freq); if (recent.length > 5) recent.shift()
          hz = median(recent)
          const spread = Math.max(...recent) / Math.min(...recent)
          if (recent.length >= 5 && spread < 1.006) measured = hz
        } else { recent = []; hz = null }
      }
      raf = requestAnimationFrame(loop)
    } catch { stop(); error = 'erreur' }
  }

  function stop() {
    cancelAnimationFrame(raf)
    stream?.getTracks().forEach((tr) => tr.stop()); stream = null
    ac?.close().catch(() => {}); ac = null
    running = false; hz = null; recent = []
  }
  function close() { stop(); onclose?.() }

  function apply() { if (proposed) { setA4(proposed); a4 = getA4() } }
  function reset() { setA4(A4_DEFAULT); a4 = getA4() }

  $effect(() => { const onVis = () => { if (document.visibilityState === 'hidden') stop() }
    document.addEventListener('visibilitychange', onVis)
    return () => { document.removeEventListener('visibilitychange', onVis); stop() } })

  const hint = $derived(v ? t(('tuner_' + v) as 'tuner_juste') : t('tuner_attente'))
</script>

<div class="tuner">
  <div class="head">
    <strong>{t('tuner_titre')}</strong>
    <button onclick={close}>{t('tuner_fermer')}</button>
  </div>

  <div class="row" role="group">
    <button class:on={mode === 'tune'} onclick={() => (mode = 'tune')}>{t('tuner_titre')}</button>
    <button class:on={mode === 'calib'} onclick={() => (mode = 'calib')}>{t('calib_titre')}</button>
  </div>

  {#if !running}
    <button class="go" onclick={start}>{t('tuner_demarrer')}</button>
  {:else}
    <button onclick={stop}>{t('tuner_arret')}</button>
  {/if}

  {#if error}
    <p class="err" role="alert">{t(('tuner_' + error) as 'tuner_refuse')}</p>
  {/if}

  {#if running && mode === 'tune'}
    <div class="meter" aria-hidden="true">
      <i class="zone"></i><i class="mid"></i>
      {#if target}<i class="needle" class:ok={v === 'juste'} style="left:{50 + needle}%"></i>{/if}
    </div>
    <div class="scale" aria-hidden="true"><span>−50</span><span>0</span><span>+50 {t('tuner_cents')}</span></div>
    <p class="big" class:ok={v === 'juste'}>
      {#if target}{t('tuner_cible')} : <b>{stringLabel(target.index)}</b> · {Math.round(target.cents)} {t('tuner_cents')}{/if}
    </p>
    <p class="hint" role="status" aria-live="polite">{hint}</p>
  {/if}

  {#if running && mode === 'calib'}
    <p>{t('calib_aide')}</p>
    <p role="status" aria-live="polite">
      {#if measured}{t('calib_mesure')} : {measured.toFixed(1)} Hz ({refNote}){#if proposed} · {t('calib_propose')} : <b>{proposed.toFixed(1)} Hz</b>{/if}{:else}{t('tuner_attente')}{/if}
    </p>
    <div class="row">
      <button class="go" disabled={!proposed} onclick={apply}>{t('calib_appliquer')}</button>
    </div>
  {/if}

  <div class="row ref">
    <label>{t('tuner_ref')}
      <input type="number" step="0.5" min={A4_MIN} max={A4_MAX} value={a4}
        onchange={(e) => { setA4(parseFloat(e.currentTarget.value)); a4 = getA4(); e.currentTarget.value = String(a4) }} /> Hz
    </label>
    {#if a4 !== A4_DEFAULT}<button onclick={reset}>{t('calib_reset')}</button>{/if}
  </div>
  <p class="note">{t('tuner_ref_note')} {t('calib_note')}</p>
</div>

<style>
  .tuner { border: 1px dashed var(--line); border-radius: 10px; padding: 10px; margin-top: 10px; display: grid; gap: 8px }
  .head { display: flex; justify-content: space-between; align-items: center; gap: 8px }
  .row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center }
  button { min-height: 44px; padding: 8px 14px; border-radius: 8px; border: 1px solid var(--line); background: var(--card); color: inherit; font-size: 1rem }
  button.on, button.go { background: var(--accent); color: var(--on-accent); border-color: var(--accent) }
  button:disabled { opacity: 0.5 }
  input { width: 76px; min-height: 40px; font-size: 1rem; padding: 0 6px }
  .meter { position: relative; height: 34px; border: 1px solid var(--line); border-radius: 8px; overflow: hidden }
  .meter .zone { position: absolute; left: 45%; width: 10%; top: 0; bottom: 0; background: color-mix(in srgb, var(--accent) 25%, transparent) }
  .meter .mid { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: var(--line) }
  .needle { position: absolute; top: 2px; bottom: 2px; width: 6px; margin-left: -3px; border-radius: 3px; background: currentColor; transition: left 0.08s linear }
  .needle.ok { background: var(--accent) }
  .scale { display: flex; justify-content: space-between; font-size: 0.8rem; opacity: 0.7 }
  .big { margin: 0 }
  .hint { margin: 0; font-size: 1.15rem; font-weight: 600 }
  .big.ok + .hint { color: var(--accent) }
  .err { color: #b3261e; margin: 0 }
  .note { font-size: 0.85rem; opacity: 0.7; margin: 0 }
  @media (prefers-reduced-motion: reduce) { .needle { transition: none } }
</style>
