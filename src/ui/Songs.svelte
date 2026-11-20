<script lang="ts">
  import { tick } from 'svelte'
  import { songsFor, chordName, songTitle, songDesc, type Song, type Accord } from '../content/songs'
  import { DOUBLING, CHORD_KEY, STYLES, type Style } from '../content/seconding'
  import { noteName, keyName, shapeName } from '../theory/fiddle'
  import { slots as slotsFor } from '../theory/neck'
  import { playSong, type Handle } from '../audio/song'
  import { t, tf, type Key } from '../i18n.svelte'
  import Icon from './Icon.svelte'
  import Stepper from './Stepper.svelte'
  import MeasureNeck from './MeasureNeck.svelte'

  const LOOPS = 4
  let { jour = 1, onjour }: { jour?: number; onjour?: (n: number) => void } = $props()

  const lessons = Array.from({ length: 84 }, (_, i) => i + 1).filter((n) => songsFor(n).songs.length)
  const jr = $derived(lessons.filter((n) => n <= jour).pop() ?? lessons[0])
  const found = $derived(songsFor(jr))
  const lessonSongs = $derived([...found.songs].sort((a, b) => a.mesure - b.mesure))
  let selId = $state('')
  const sel = $derived(lessonSongs.find((s) => s.id === selId) ?? lessonSongs[0])
  const key = $derived(sel.cle ?? 'C')
  let bpm = $state(80)
  $effect(() => { bpm = sel.tempo })
  let melodie = $state(true), accompagnement = $state(true)
  let segondeur = $state<Style | 'off'>('off')
  const usedChords = $derived([...new Set(sel.accords)] as Accord[])

  // lecture : indice de la note qui sonne et numéro du tour
  let playing = $state(false), cur = $state<number | null>(null), loop = $state(0)
  let h: Handle | null = null
  function choose(s: Song) { stop(); selId = s.id }
  function play() {
    stop(); playing = true; loop = 0
    h = playSong(sel, { bpm, melodie, accompagnement, segondeur, loops: LOOPS }, (i, l) => { cur = i; if (l !== undefined) loop = l }, () => (playing = false))
  }
  function stop() { h?.stop(); h = null; playing = false; cur = null }
  $effect(() => () => stop())

  // clavier des onglets : flèches, début, fin
  async function onTabKey(e: KeyboardEvent) {
    const n = lessonSongs.length
    const i = lessonSongs.findIndex((s) => s.id === sel.id)
    const j = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1
    if (j < 0) return
    e.preventDefault()
    choose(lessonSongs[j])
    await tick()
    document.getElementById(`tab-${lessonSongs[j].id}`)?.focus()
  }

  // regroupe les notes par mesure
  type BarNote = { i: number; m: number; d: number; at: number }
  const bars = $derived.by(() => {
    const out: { n: number; accord: Accord; notes: BarNote[] }[] = []
    let i = 0
    for (const a of sel.accords) {
      const notes: BarNote[] = []
      let sum = 0
      while (sum < sel.mesure - 1e-6 && i < sel.melodie.length) { notes.push({ i, ...sel.melodie[i], at: sum }); sum += sel.melodie[i].d; i++ }
      out.push({ n: out.length, accord: a, notes })
    }
    return out
  })
  // mesure et temps de chaque note, pour l'indication « Mesure 3 · temps 2 »
  const where = $derived(bars.flatMap((b) => b.notes.map((x) => ({ bar: b.n, beat: Math.floor(x.at + 1e-6) + 1 }))))

  const songSlots = $derived(slotsFor(sel.melodie.map((x) => x.m), key))
  const dblSlots = $derived(Math.max(...usedChords.map((a) => slotsFor([...DOUBLING[a]], CHORD_KEY[a]))))
  const names = (ms: number[], k: string) => ms.map((m) => noteName(m, k)).join(', ')
</script>

<div class="songs">
  <h2>{t('ch_titre')}</h2>
  {#if found.from !== jr}<p class="hint">{t('songs_from')} {found.from}.</p>{/if}
  <p class="hint">{t('ch_intro')}</p>

  <label class="lesson">
    <span class="lab">{t('jour_n')}</span>
    <span class="selwrap">
      <select value={jr} onchange={(e) => { stop(); onjour?.(Number(e.currentTarget.value)) }}>
        {#each lessons as n}<option value={n}>{tf('lecon_option', { n, titre: songTitle(songsFor(n).songs[0]) })}</option>{/each}
      </select>
      <span class="chev"><Icon name="chevron" size={22} /></span>
    </span>
  </label>

  <div class="tabs" role="tablist" aria-label={t('tabs_label')} tabindex="-1" onkeydown={onTabKey}>
    {#each lessonSongs as s}
      <button
        type="button" role="tab" id="tab-{s.id}" aria-selected={s.id === sel.id} aria-controls="songs-panel"
        tabindex={s.id === sel.id ? 0 : -1} class="tab" class:on={s.id === sel.id} onclick={() => choose(s)}
      >{songTitle(s)}</button>
    {/each}
  </div>

  <div role="tabpanel" id="songs-panel" aria-labelledby="tab-{sel.id}" class="panel">
    <div class="head">
      <h3>{songTitle(sel)}</h3>
      <span class="hint">{sel.mesure === 2 ? t('two_step') : t('valse')} · {t('sonne_en')} {keyName(key)} · {t('forme_de')} {shapeName(key)}</span>
    </div>
    <p class="desc">{songDesc(sel)}</p>

    <div class="card">
      <button type="button" class="main" class:on={playing} aria-pressed={playing} onclick={() => (playing ? stop() : play())}>
        <Icon name={playing ? 'stop' : 'play'} size={24} />
        {playing ? tf('tour_stop', { n: loop + 1, m: LOOPS }) : t('jouer')}
      </button>
      <p class="hint center">
        {#if playing && cur !== null && where[cur]}{tf('hint_mesure', { n: where[cur].bar + 1, b: where[cur].beat })}{:else}{t('hint_decompte')}{/if}
      </p>

      <div class="controls">
        <div class="field">
          <span class="lab">{t('tempo')}</span>
          <Stepper bind:value={bpm} min={50} max={140} label={t('tempo')} decLabel={t('tempo_moins')} incLabel={t('tempo_plus')} disabled={playing} />
        </div>
        <div class="checks">
          <label class="chk"><input type="checkbox" bind:checked={melodie} disabled={playing} /> {t('melodie')}</label>
          <label class="chk"><input type="checkbox" bind:checked={accompagnement} disabled={playing} /> {t('accompagnement')}</label>
        </div>
      </div>

      <label class="field">
        <span class="lab">{t('segondeur')}</span>
        <span class="selwrap">
          <select bind:value={segondeur} disabled={playing}>
            <option value="off">{t('sty_off')}</option>
            {#each STYLES as st}<option value={st}>{t(('sty_' + st) as Key)}</option>{/each}
          </select>
          <span class="chev"><Icon name="chevron" size={20} /></span>
        </span>
      </label>
      {#if segondeur !== 'off'}<p class="hint">{t(('desc_' + segondeur) as Key)}</p>{/if}
      <p class="hint">{t('seconde_note')}</p>
      <p class="hint">{t('ch_note')}</p>
    </div>
  </div>

  <section class="card dbl">
    <div class="between">
      <h3>{t('doublings')}</h3>
      <span class="hint">{t('doublings_hint')}</span>
    </div>
    <p class="hint">{t('doublings_note')}</p>
    <!-- zone défilante : focalisable au clavier (règle axe « scrollable-region-focusable ») -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div class="rail" role="region" aria-label={t('doublings')} tabindex="0">
      {#each usedChords as a}
        <div class="rail-item">
          <MeasureNeck
            chord={chordName(a)} notes={[...DOUBLING[a]]} keyName={CHORD_KEY[a]} showPath={false} showLetters={false} slotCount={dblSlots}
            summary={tf('doubling_sr', { accord: chordName(a), notes: names([...DOUBLING[a]], CHORD_KEY[a]) })}
          />
        </div>
      {/each}
    </div>
  </section>

  <section class="meas">
    <h3>{t('melodie_titre')}</h3>
    <p class="hint">{t('legende_manches')}</p>
    <div class="grid">
      {#each bars as bar}
        {@const idx = bar.notes.findIndex((x) => x.i === cur)}
        <MeasureNeck
          num={bar.n + 1} chord={chordName(bar.accord)} notes={bar.notes.map((x) => x.m)} keyName={key} slotCount={songSlots}
          current={idx >= 0} playing={idx}
          summary={tf('mesure_sr', { n: bar.n + 1, accord: chordName(bar.accord), notes: names(bar.notes.map((x) => x.m), key) })}
        />
      {/each}
    </div>
    <details class="how">
      <summary>{t('comment_lire')}</summary>
      <p class="hint">{@html t('ch_manches')}</p>
    </details>
  </section>
</div>

<style>
  .songs { container: songs / inline-size; display: flex; flex-direction: column; gap: var(--s-4) }
  h2 { margin: 0; font-size: var(--t-xl) }
  h3 { margin: 0; font-size: var(--t-lg) }
  .hint { margin: 0; color: var(--muted); font-size: var(--t-sm) }
  .hint.center { text-align: center }
  .lab { font-size: var(--t-sm); font-weight: 700; color: var(--muted) }

  /* menus : fond carte, bord 2 px, chevron dessiné */
  .lesson, .field { display: flex; flex-direction: column; gap: 6px }
  .selwrap { position: relative; display: flex; align-items: center }
  select {
    appearance: none; width: 100%; min-height: 52px; padding: 0 44px 0 14px; border: 2px solid var(--fg); border-radius: var(--r);
    background: var(--card); color: var(--fg); font-size: var(--t-base); cursor: pointer;
  }
  select:disabled { border-color: var(--line); color: var(--muted); cursor: default }
  .chev { position: absolute; right: 12px; display: flex; pointer-events: none; color: var(--fg) }

  /* onglets : titres des chansons de la leçon */
  .tabs { display: flex; border-bottom: 1px solid var(--line) }
  .tab {
    flex: 1; min-height: 52px; padding: 0 8px; border: 0; border-bottom: 4px solid transparent; background: transparent;
    color: var(--muted); font-size: var(--t-base); cursor: pointer;
  }
  .tab.on { color: var(--fg); font-weight: 700; border-bottom-color: var(--accent2) }

  .panel { display: flex; flex-direction: column; gap: var(--s-2) }
  .head { display: flex; flex-direction: column; gap: 2px }
  .desc { margin: 0 }

  .card { background: var(--card); border: 1px solid var(--line); border-radius: var(--r); padding: var(--s-4); display: flex; flex-direction: column; gap: 14px }
  .main {
    min-height: 60px; border-radius: 14px; border: 0; display: flex; align-items: center; justify-content: center; gap: 10px;
    background: var(--accent); color: var(--on-accent); font-size: var(--t-md); font-weight: 700; cursor: pointer;
  }
  .main.on { background: var(--fg); color: var(--bg) }
  .controls { display: flex; align-items: flex-end; gap: var(--s-3); flex-wrap: wrap }
  .checks { display: flex; flex-direction: column }
  .chk { display: flex; align-items: center; gap: 10px; min-height: 44px; font-size: var(--t-base); cursor: pointer }
  .chk input { accent-color: var(--accent) }

  .between { display: flex; align-items: baseline; justify-content: space-between; gap: var(--s-3) }
  .dbl { padding-right: 0 }
  .dbl > :not(.rail) { padding-right: var(--s-4) }
  .rail { display: flex; gap: 10px; overflow-x: auto; padding: 2px var(--s-4) 4px 2px; scroll-snap-type: x proximity }
  .rail-item { flex: none; width: 128px; scroll-snap-align: start }

  .meas { display: flex; flex-direction: column; gap: 10px }
  .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; padding: 6px 4px 8px }
  @container songs (min-width: 600px) {
    .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px }
    .rail-item { width: 140px }
  }
  .how summary { min-height: 44px; display: flex; align-items: center; cursor: pointer; font-weight: 700; color: var(--accent) }
  .how p { margin: 4px 0 0 }
</style>
