<script lang="ts">
  import type { Step } from '../content/types'
  import Fingerboard from './Fingerboard.svelte'
  import { OPEN, stringLabel, majorScale, pentatonic } from '../theory/fiddle'
  import { playNotes, playTone, startDrone, stopDrone, startMetronome, stopMetronome } from '../audio/engine'
  import { t } from '../i18n.svelte'
  let { step, index }: { step: Step; index: number } = $props()
  let drone = $state(false), metro = $state(false), beat = $state(-1)
  let bpm = $state(step.metro?.bpm ?? 60)

  function toggleDrone() { drone = !drone; if (drone) startDrone(step.bourdon!); else stopDrone() }
  function toggleMetro() {
    metro = !metro
    if (metro) startMetronome(bpm, step.metro!.mesure, (b) => (beat = b)); else { stopMetronome(); beat = -1 }
  }
  function listenNotes() {
    const n = step.notes!.notes
    playNotes([...n, ...n.slice(0, -1).reverse()], 80, 1)
  }
  function listen() {
    const g = step.gamme!
    const up = g.type === 'pentatonique' ? pentatonic(g.cle, g.de, g.a) : majorScale(g.cle, g.de, g.a)
    playNotes([...up, ...up.slice(0, -1).reverse()], 90, 0.9)
  }
  $effect(() => () => { stopDrone(); stopMetronome() })
</script>

<section class="card">
  <h3><span class="n">{index + 1}</span> {step.titre} <small>{step.minutes} {t('min')}</small></h3>
  <p>{step.texte}</p>
  {#if step.cordes}
    <div class="row">
      {#each OPEN as m, i}<button onclick={() => playTone(m, 2)}>{stringLabel(i)}</button>{/each}
    </div>
  {/if}
  {#if step.notes}
    <Fingerboard cle={step.notes.cle} notes={step.notes.notes} titre={step.notes.titre} />
    <button onclick={listenNotes}>{t('ecouter')}</button>
  {/if}
  {#if step.gamme}
    <Fingerboard cle={step.gamme.cle} de={step.gamme.de} a={step.gamme.a} type={step.gamme.type} />
    <button onclick={listen}>{t('ecouter')}</button>
  {/if}
  <div class="row">
    {#if step.bourdon}<button class:on={drone} onclick={toggleDrone}>{drone ? t('stop_bourdon') : t('bourdon')}</button>{/if}
    {#if step.metro}
      <button class:on={metro} onclick={toggleMetro}>{metro ? t('stop') : t('metro')}</button>
      <label>{t('tempo')} <input type="number" min="40" max="160" bind:value={bpm} disabled={metro} /></label>
      {#if metro}<span class="beat" aria-hidden="true">{#each Array(step.metro.mesure) as _, i}<i class:hit={beat === i}></i>{/each}</span>{/if}
    {/if}
  </div>
</section>

<style>
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px; margin: 12px 0 }
  h3 { margin: 0 0 6px; font-size: 1.05rem }
  h3 small { opacity: 0.6; font-weight: 400; margin-left: 6px }
  .n { display: inline-grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: var(--accent); color: var(--on-accent); font-size: 0.85rem; margin-right: 4px }
  p { line-height: 1.5; margin: 6px 0 }
  .row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 8px }
  button { min-height: 44px; padding: 8px 14px; border-radius: 8px; border: 1px solid var(--line); background: var(--card); color: inherit; font-size: 1rem }
  button.on { background: var(--accent); color: var(--on-accent); border-color: var(--accent) }
  input { width: 64px; min-height: 40px; font-size: 1rem; padding: 0 6px }
  .beat { display: inline-flex; gap: 6px }
  .beat i { width: 16px; height: 16px; border-radius: 50%; background: var(--line) }
  .beat i.hit { background: var(--accent) }
</style>
