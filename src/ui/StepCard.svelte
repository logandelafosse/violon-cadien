<script lang="ts">
  import type { Step } from '../content/types'
  import Fingerboard from './Fingerboard.svelte'
  import Tuner from './Tuner.svelte'
  import Icon from './Icon.svelte'
  import Stepper from './Stepper.svelte'
  import Beats from './Beats.svelte'
  import { OPEN, stringLabel, noteName, majorScale, pentatonic } from '../theory/fiddle'
  import { playNotes, playTone, startDrone, stopDrone, startMetronome, stopMetronome } from '../audio/engine'
  import { t, i18n } from '../i18n.svelte'
  let { step, index }: { step: Step; index: number } = $props()
  let drone = $state(false), metro = $state(false), beat = $state(-1)
  let tuner = $state(false)
  let sounding = $state<number | null>(null) // corde qui sonne (2 s)
  let cur = $state<number | null>(null)       // note en cours dans « Écouter »
  let bpm = $state(step.metro?.bpm ?? 60)
  let soundTimer: ReturnType<typeof setTimeout> | undefined

  const droneNames = $derived((step.bourdon ?? []).map((m) => noteName(m)).join(' + '))

  function pressString(i: number, m: number) {
    playTone(m, 2)
    sounding = i
    clearTimeout(soundTimer)
    soundTimer = setTimeout(() => (sounding = null), 2000)
  }
  function toggleDrone() { drone = !drone; if (drone) startDrone(step.bourdon!); else stopDrone() }
  function toggleMetro() {
    metro = !metro
    if (metro) startMetronome(bpm, step.metro!.mesure, (b) => (beat = b)); else { stopMetronome(); beat = -1 }
  }
  // La lecture monte puis redescend : l'indice joué est ramené à l'indice de la note dans la liste affichée.
  const shown = (i: number | null, n: number) => (i === null ? null : i < n ? i : 2 * (n - 1) - i)
  function listenNotes() {
    const n = step.notes!.notes
    if (step.notes!.ensemble) n.forEach((m) => playTone(m, 1.6))
    else playNotes([...n, ...n.slice(0, -1).reverse()], 80, 1, (i) => (cur = shown(i, n.length)))
  }
  function listen() {
    const g = step.gamme!
    const up = g.type === 'pentatonique' ? pentatonic(g.cle, g.de, g.a) : majorScale(g.cle, g.de, g.a)
    playNotes([...up, ...up.slice(0, -1).reverse()], 90, 0.9, (i) => (cur = shown(i, up.length)))
  }
  $effect(() => () => { stopDrone(); stopMetronome(); clearTimeout(soundTimer) })
</script>

<article class="card" aria-labelledby="step-{index}">
  <div class="head">
    <span class="n" aria-hidden="true">{index + 1}</span>
    <div class="title">
      <h3 id="step-{index}">{step.titre}</h3>
      <span class="mins">{step.minutes} {t('min')}</span>
    </div>
  </div>
  <p class="txt">{step.texte}</p>

  {#if step.cordes}
    <div class="strings">
      {#each OPEN as m, i}
        <button type="button" class="pill" class:sounding={sounding === i} onclick={() => pressString(i, m)}>
          {#if sounding === i}<Icon name="listen" size={16} />{/if}{stringLabel(i)}
        </button>
      {/each}
    </div>
    {#if !tuner}<button type="button" class="outline" onclick={() => (tuner = true)}><Icon name="tune" size={20} />{t('tuner_ouvrir')}</button>{/if}
    {#if tuner}<Tuner onclose={() => (tuner = false)} />{/if}
  {/if}

  {#if step.notes}
    <div class="fb"><Fingerboard cle={step.notes.cle} notes={step.notes.notes} titre={i18n.lang === 'en' ? (step.notes.titreEn ?? step.notes.titre) : step.notes.titre} playing={cur ?? undefined} /></div>
    <button type="button" class="outline" onclick={listenNotes}><Icon name="play" size={20} />{t('ecouter')}</button>
  {/if}
  {#if step.gamme}
    <div class="fb"><Fingerboard cle={step.gamme.cle} de={step.gamme.de} a={step.gamme.a} type={step.gamme.type} playing={cur ?? undefined} /></div>
    <button type="button" class="outline" onclick={listen}><Icon name="play" size={20} />{t('ecouter_gamme')}</button>
  {/if}

  {#if step.bourdon}
    <button type="button" class="toggle" class:on={drone} aria-pressed={drone} onclick={toggleDrone}>
      <Icon name={drone ? 'stop' : 'drone'} size={22} />{t('bourdon_de')} {droneNames}{drone ? ` · ${t('en_cours')}` : ''}
    </button>
  {/if}

  {#if step.metro}
    <div class="metro">
      <button type="button" class="primary" aria-pressed={metro} onclick={toggleMetro}>
        <Icon name={metro ? 'stop' : 'metronome'} size={20} />{metro ? t('stop') : t('demarrer')}
      </button>
      <label class="tempo"><span>{t('tempo')}</span>
        <Stepper bind:value={bpm} min={40} max={160} label={t('tempo')} decLabel={t('moins_vite')} incLabel={t('plus_vite')} disabled={metro} />
      </label>
      <div class="beats"><Beats count={step.metro.mesure} current={metro ? beat : -1} /></div>
    </div>
  {/if}
</article>

<style>
  .card { background: var(--card); border: 1px solid var(--line); border-radius: var(--r); padding: var(--s-4); display: flex; flex-direction: column; gap: 14px }
  .head { display: flex; align-items: flex-start; gap: var(--s-3) }
  .n { flex: none; width: 40px; height: 40px; border-radius: 50%; background: var(--fg); color: var(--bg); display: flex; align-items: center; justify-content: center; font-family: var(--font-title); font-weight: 700; font-size: var(--t-md) }
  .title { flex: 1; display: flex; flex-direction: column; gap: 2px }
  h3 { margin: 0; font-size: var(--t-md); font-weight: 700; line-height: 1.25 }
  .mins { font-size: var(--t-sm); color: var(--muted) }
  .txt { margin: 0; font-size: var(--t-base); line-height: var(--lh) }
  .strings { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--s-2) }
  .pill { min-height: 56px; border-radius: var(--r-pill); border: 2px solid var(--fg); background: transparent; color: var(--fg); font-weight: 700; font-size: 1.125rem; display: flex; align-items: center; justify-content: center; gap: 4px; cursor: pointer }
  .pill.sounding { background: var(--fg); color: var(--bg) }
  .fb { display: flex; justify-content: center }
  .outline, .toggle, .primary { min-height: 48px; border-radius: var(--r); font-weight: 700; font-size: 1.0625rem; display: flex; align-items: center; justify-content: center; gap: var(--s-2); cursor: pointer }
  .outline { border: 2px solid var(--accent); background: transparent; color: var(--accent) }
  .toggle { min-height: 56px; border: 2px solid var(--accent); background: transparent; color: var(--accent); font-size: 1.125rem; gap: 10px }
  .toggle.on, .primary { background: var(--accent); color: var(--on-accent); border: 2px solid var(--accent) }
  .primary { min-height: 52px; padding: 0 18px }
  .metro { display: flex; align-items: flex-end; gap: var(--s-3); flex-wrap: wrap }
  .tempo { display: flex; flex-direction: column; gap: 4px; font-size: var(--t-sm); font-weight: 700; color: var(--muted) }
  .beats { margin-left: auto; min-height: 52px; display: flex; align-items: center }
</style>
