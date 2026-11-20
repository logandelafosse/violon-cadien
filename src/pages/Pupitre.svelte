<script lang="ts">
  // Vue plein écran du mode pupitre : une étape à la fois, très gros texte, sans en-tête ni barre d'onglets.
  // App.svelte la monte quand `pupitre.on` est vrai sur une page de jour.
  import { onMount, tick, untrack } from 'svelte'
  import { dayOf } from '../content/days'
  import { markDay, store } from '../state/store.svelte'
  import { go } from '../router.svelte'
  import { t, i18n } from '../i18n.svelte'
  import { setPupitre } from '../pupitre.svelte'
  import { OPEN, stringLabel, majorScale, pentatonic } from '../theory/fiddle'
  import { playNotes, playTone, startDrone, stopDrone, startMetronome, stopMetronome, stopAll } from '../audio/engine'
  import { holdAwake, releaseAwake } from '../audio/session'
  import Fingerboard from '../ui/Fingerboard.svelte'
  import Beats from '../ui/Beats.svelte'
  import Icon from '../ui/Icon.svelte'

  let { dayNum }: { dayNum: number } = $props()

  const day = $derived(dayOf(dayNum))
  const steps = $derived(day?.etapes ?? [])
  let i = $state(0)
  const step = $derived(steps[i])
  const last = $derived(i >= steps.length - 1)
  const done = $derived(!!store.p.done[dayNum])

  let drone = $state(false)
  let metro = $state(false)
  let beat = $state(-1)
  let bpm = $state(60)
  let cur = $state<number | undefined>(undefined)
  let seconds = $state(0)
  let heading: HTMLHeadingElement | undefined = $state()
  let started = false

  const clock = $derived(`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`)

  // Nouveau jour : on repart de la première étape et du chronomètre.
  $effect(() => { void dayNum; untrack(() => { i = 0; seconds = 0 }) })

  // Nouvelle étape : on coupe tout (bourdon, métronome, lecture), on remet le tempo de l'étape et on place le focus sur le titre.
  $effect(() => {
    const s = step
    untrack(() => {
      stopAll(); drone = false; metro = false; beat = -1; cur = undefined
      bpm = s?.metro?.bpm ?? 60
    })
    if (started) tick().then(() => heading?.focus())
  })

  onMount(() => {
    document.documentElement.dataset.pupitre = ''
    holdAwake('pupitre')
    const timer = window.setInterval(() => { seconds += 1 }, 1000)
    started = true
    heading?.focus()
    return () => {
      clearInterval(timer)
      stopAll()
      releaseAwake('pupitre')
      delete document.documentElement.dataset.pupitre
    }
  })

  const quit = () => setPupitre(false)
  const prev = () => { if (i > 0) i -= 1 }
  function next() {
    if (!last) { i += 1; return }
    if (day && !done) markDay(day.jour)
    setPupitre(false)
    go('/')
  }

  function onKey(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey) return
    const el = e.target as HTMLElement | null
    if (el && ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) return
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    else if (e.key === 'Escape') { e.preventDefault(); quit() }
  }

  function toggleDrone() { drone = !drone; if (drone) startDrone(step!.bourdon!); else stopDrone() }
  function toggleMetro() {
    metro = !metro
    if (metro) startMetronome(bpm, step!.metro!.mesure, (b) => (beat = b)); else { stopMetronome(); beat = -1 }
  }
  const bump = (d: number) => { bpm = Math.min(160, Math.max(40, bpm + d * 2)) }

  /** Écoute la gamme ou les notes de l'étape ; `cur` suit la note qui joue (halo sur le manche). */
  function listen() {
    const s = step!
    if (s.notes?.ensemble) { s.notes.notes.forEach((m) => playTone(m, 1.6)); return }
    const base = s.notes
      ? s.notes.notes
      : s.gamme!.type === 'pentatonique' ? pentatonic(s.gamme!.cle, s.gamme!.de, s.gamme!.a) : majorScale(s.gamme!.cle, s.gamme!.de, s.gamme!.a)
    const seq = [...base, ...base.slice(0, -1).reverse()]
    playNotes(seq, 90, 0.9, (k) => { cur = k === null ? undefined : k < base.length ? k : 2 * (base.length - 1) - k })
  }
</script>

<svelte:window onkeydown={onKey} />

<main class="pup">
  {#if day && step}
    <div class="top">
      <span class="count">{t('pup_etape')} <b>{i + 1}</b> / {steps.length}</span>
      <span class="time" aria-hidden="true"><Icon name="timer" size={26} />{clock}</span>
      <button type="button" class="quit" aria-label={t('pup_quitter')} onclick={quit}><Icon name="close" size={28} /></button>
    </div>

    <h1 bind:this={heading} tabindex="-1">{step.titre}</h1>
    <p class="cue">{step.texte}</p>

    {#if step.cordes}
      <div class="strings" role="group" aria-label={t('pup_cordes')}>
        {#each OPEN as m, k}<button type="button" class="big" onclick={() => playTone(m, 2)}>{stringLabel(k)}</button>{/each}
      </div>
    {/if}

    {#if step.notes || step.gamme}
      <div class="board">
        {#if step.notes}
          <Fingerboard cle={step.notes.cle} notes={step.notes.notes} compact titre={i18n.lang === 'en' ? (step.notes.titreEn ?? step.notes.titre) : step.notes.titre} playing={cur} />
        {:else if step.gamme}
          <Fingerboard cle={step.gamme.cle} de={step.gamme.de} a={step.gamme.a} type={step.gamme.type} compact playing={cur} />
        {/if}
      </div>
      <button type="button" class="big" onclick={listen}><Icon name="play" size={22} />{t('ecouter')}</button>
    {/if}

    {#if step.bourdon}
      <button type="button" class="big" class:on={drone} aria-pressed={drone} onclick={toggleDrone}><Icon name={drone ? 'stop' : 'drone'} size={24} />{drone ? t('stop_bourdon') : t('bourdon')}</button>
    {/if}

    {#if step.metro}
      <div class="metro">
        <button type="button" class="round" aria-label={metro ? t('stop') : t('metro')} aria-pressed={metro} onclick={toggleMetro}><Icon name={metro ? 'stop' : 'metronome'} size={28} /></button>
        <span class="bpm">
          <span class="num">
            <button type="button" class="step" aria-label={t('pup_moins')} disabled={metro || bpm <= 40} onclick={() => bump(-1)}>−</button>
            <b role="img" aria-label="{t('tempo')} {bpm}">{bpm}</b>
            <button type="button" class="step" aria-label={t('pup_plus')} disabled={metro || bpm >= 160} onclick={() => bump(1)}>+</button>
          </span>
          <span class="unit">{t('pup_a_la_noire')}</span>
        </span>
        <span class="beats"><Beats count={step.metro.mesure} current={metro ? beat : -1} /></span>
      </div>
    {/if}

    <div class="nav">
      <button type="button" class="big" disabled={i === 0} onclick={prev}><span class="flip"><Icon name="next" size={22} /></span>{t('pup_avant')}</button>
      <button type="button" class="big fill" onclick={next}>
        {#if last}{done ? t('pup_terminer') : t('marquer')}<Icon name="check" size={22} />{:else}{t('pup_suivante')}<Icon name="next" size={22} />{/if}
      </button>
    </div>
  {:else}
    <div class="top">
      <span class="count"></span><span></span>
      <button type="button" class="quit" aria-label={t('pup_quitter')} onclick={quit}><Icon name="close" size={28} /></button>
    </div>
    <h1 bind:this={heading} tabindex="-1">{t('pup_sans_lecon')}</h1>
  {/if}
</main>

<style>
  .pup { min-height: 100dvh; max-width: 760px; margin: 0 auto; padding: 1rem 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.6rem; background: var(--bg); color: var(--fg) }
  .top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem }
  .count { font-size: 0.86rem; font-weight: 700; color: var(--muted); font-variant-numeric: tabular-nums }
  .count b { color: var(--fg); font-size: 1.15rem }
  .time { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 1rem; font-weight: 700; color: var(--accent); font-variant-numeric: tabular-nums }
  .quit { width: 2.4rem; height: 2.4rem; min-height: 0; border-radius: var(--r-lg); border: 2px solid var(--line); background: transparent; color: var(--fg); display: flex; align-items: center; justify-content: center; padding: 0; cursor: pointer }
  h1 { margin: 0; font-family: var(--font-title); font-weight: 700; font-size: 1.5rem; line-height: 1.05; outline: none }
  .cue { margin: 0; font-size: 1rem; line-height: 1.3 }
  .board { display: flex; justify-content: center }
  .strings { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.4rem }
  .big { min-height: 3rem; border-radius: var(--r-lg); border: 2px solid var(--fg); background: transparent; color: var(--fg); font-weight: 700; font-size: 0.875rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem; cursor: pointer }
  .big.on { background: var(--accent); border-color: var(--accent); color: var(--on-accent) }
  .big.fill { background: var(--fg); color: var(--bg) }
  .big:disabled { border-color: var(--line); color: var(--muted); cursor: default }
  .metro { margin-top: auto; display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0.65rem; border-radius: var(--r-lg); background: var(--card); border: 2px solid var(--accent) }
  .round { flex: none; width: 2.5rem; height: 2.5rem; min-height: 0; border-radius: 50%; border: 0; background: var(--accent); color: var(--on-accent); display: flex; align-items: center; justify-content: center; padding: 0; cursor: pointer }
  .bpm { display: flex; flex-direction: column; line-height: 1 }
  .num { display: inline-flex; align-items: center; gap: 0.2rem }
  .num b { font-size: 1.7rem; font-variant-numeric: tabular-nums; min-width: 2.2ch; text-align: center }
  .step { width: 1.7rem; height: 1.7rem; min-height: 0; border-radius: 50%; border: 2px solid var(--fg); background: transparent; color: var(--fg); font-size: 1rem; font-weight: 700; padding: 0; cursor: pointer }
  .step:disabled { border-color: var(--line); color: var(--muted); cursor: default }
  .unit { font-size: 0.65rem; color: var(--muted) }
  .beats { margin-left: auto; display: flex; transform: scale(1.35); transform-origin: right center }
  .nav { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; margin-top: auto }
  .metro + .nav { margin-top: 0 }
  .flip { display: inline-flex; transform: scaleX(-1) }
</style>
