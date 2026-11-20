<script lang="ts">
  import { SONGS, chordName, songTitle, songDesc, type Song, type Accord } from '../content/songs'
  import { DOUBLING, CHORD_KEY, STYLES, type Style } from '../content/seconding'
  import Fingerboard from './Fingerboard.svelte'
  import type { Key } from '../i18n.svelte'
  import { OPEN, stringLabel, noteName, position } from '../theory/fiddle'
  import { playSong, type Handle } from '../audio/song'
  import { t } from '../i18n.svelte'

  let { jour = 1, onjour }: { jour?: number; onjour?: (n: number) => void } = $props()
  const lessons = [...new Set(SONGS.map((s) => s.jour))].sort((a, b) => a - b)
  const lessonSongs = $derived(SONGS.filter((s) => s.jour === jour).sort((a, b) => a.mesure - b.mesure))
  let selId = $state('')
  const sel = $derived(lessonSongs.find((s) => s.id === selId) ?? lessonSongs[0])
  let bpm = $state(80)
  $effect(() => { bpm = sel.tempo })
  let melodie = $state(true), accompagnement = $state(true)
  let segondeur = $state<Style | 'off'>('off')
  const usedChords = $derived([...new Set(sel.accords)] as Accord[])
  let playing = $state(false), cur = $state<number | null>(null)
  let h: Handle | null = null

  function choose(s: Song) { stop(); selId = s.id }
  function play() {
    stop(); playing = true
    h = playSong(sel, { bpm, melodie, accompagnement, segondeur, loops: 4 }, (i) => (cur = i), () => (playing = false))
  }
  function stop() { h?.stop(); h = null; playing = false; cur = null }
  $effect(() => () => stop())

  const NW = 176, NT = 40, RH = 22, NH = NT + RH * 7 + 16
  const SX = (si: number) => 26 + si * 41
  function place(m: number) {
    const p = position(m, 'C')
    if (!p) return null
    const semis = m - OPEN[p.string]
    return { x: SX(p.string), y: p.finger === 0 ? NT - 18 : NT + semis * RH, f: p.finger }
  }
  const pt = (m: number) => { const q = place(m); return q ? `${q.x},${q.y}` : '' }


  // regroupe les notes par mesure
  const bars = $derived.by(() => {
    const out: { n: number; accord: string; notes: { i: number; m: number; d: number; at: number }[] }[] = []
    let i = 0
    for (const a of sel.accords) {
      const notes: { i: number; m: number; d: number; at: number }[] = []
      let sum = 0
      while (sum < sel.mesure - 1e-6 && i < sel.melodie.length) { notes.push({ i, ...sel.melodie[i], at: sum }); sum += sel.melodie[i].d; i++ }
      out.push({ n: out.length, accord: a, notes })
    }
    return out
  })
</script>

<h2>{t('ch_titre')}</h2>
<p class="note">{t('ch_intro')}</p>

<label class="lesson">{t('jour_n')}
  <select value={jour} onchange={(e) => { stop(); onjour?.(Number(e.currentTarget.value)) }}>
    {#each lessons as n}<option value={n}>{n}</option>{/each}
  </select>
</label>

<div class="tabs">
  {#each lessonSongs as s}<button class:on={s.id === sel.id} onclick={() => choose(s)}>{songTitle(s)}</button>{/each}
</div>

<section class="card">
  <h3>{songTitle(sel)} <small>{sel.mesure === 2 ? t('two_step') : t('valse')}</small></h3>
  <p>{songDesc(sel)}</p>
  <div class="row">
    <button class="main" class:on={playing} onclick={() => (playing ? stop() : play())}>{playing ? t('stop') : t('jouer')}</button>
    <label>{t('tempo')} <input type="number" min="50" max="140" bind:value={bpm} disabled={playing} /></label>
  </div>
  <div class="row">
    <label><input type="checkbox" bind:checked={melodie} disabled={playing} /> {t('melodie')}</label>
    <label><input type="checkbox" bind:checked={accompagnement} disabled={playing} /> {t('accompagnement')}</label>
  </div>
  <div class="row">
    <label>{t('segondeur')}
      <select bind:value={segondeur} disabled={playing}>
        <option value="off">{t('sty_off')}</option>
        {#each STYLES as st}<option value={st}>{t(('sty_' + st) as Key)}</option>{/each}
      </select>
    </label>
  </div>
  {#if segondeur !== 'off'}<p class="note">{t(('desc_' + segondeur) as Key)}</p>{/if}
  <p class="note">{t('seconde_note')}</p>
  <p class="note">{t('ch_note')}</p>
</section>

<section class="card">
  <h3>{t('doublings')}</h3>
  <p class="note">{t('doublings_note')}</p>
  <div class="dbl">
    {#each usedChords as a}
      <Fingerboard cle={CHORD_KEY[a]} notes={[...DOUBLING[a]]} titre={chordName(a)} compact />
    {/each}
  </div>
</section>

<section class="card">
  <p class="note">{@html t('ch_manches')}</p>
  <div class="necks">
    {#each bars as bar}
      <div class="neck" class:hot={bar.notes.some((n) => n.i === cur)}>
        <div class="ch">{t('mesure')} {bar.n + 1} · {chordName(bar.accord as 'C')}</div>
        <svg viewBox="0 0 {NW} {NH}" role="img" aria-label="{t('mesure')} {bar.n + 1}">
          <rect x="6" y={NT - 8} width={NW - 12} height={RH * 7 + 16} rx="5" class="board" />
          {#each [0, 1, 2, 3] as si}
            <line x1={SX(si)} x2={SX(si)} y1={NT - 8} y2={NT + RH * 7 + 8} class="sl" />
            <text x={SX(si)} y="12" text-anchor="middle" class="sn">{stringLabel(si)}</text>
          {/each}
          <polyline class="path" points={bar.notes.map((n) => pt(n.m)).filter(Boolean).join(' ')} />
          {#each bar.notes as nt, k}
            {@const q = place(nt.m)}
            {#if q}
              <circle cx={q.x} cy={q.y} r="10" class="nd" class:now={cur === nt.i} />
              <text x={q.x} y={q.y + 4} text-anchor="middle" class="fg" class:nowt={cur === nt.i}>{q.f}</text>
              <text x={q.x + 11} y={q.y - 8} class="ord">{'abcdef'[k]}</text>
            {/if}
          {/each}
        </svg>
        <div class="nm">{bar.notes.map((n, k) => `${'abcdef'[k]} ${noteName(n.m, 'C')}`).join('  ')}</div>
      </div>
    {/each}
  </div>
</section>

<style>
  .lesson { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; margin-top: 6px }
  .lesson select { min-height: 40px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--line); background: var(--card); color: inherit; padding: 0 8px }
  .dbl { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 8px }
  select { min-height: 40px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--line); background: var(--card); color: inherit; padding: 0 8px }
  .tabs { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0 }
  .tabs button, .main { min-height: 44px; padding: 8px 14px; border-radius: 8px; border: 1px solid var(--line); background: var(--card); color: inherit; font-size: 1rem }
  .tabs button.on, .main.on { background: var(--accent); color: var(--on-accent); border-color: var(--accent) }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px; margin: 12px 0 }
  h3 { margin: 0 0 6px } h3 small { opacity: 0.65; font-weight: 400; margin-left: 6px }
  .row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-top: 8px }
  input[type='number'] { width: 64px; min-height: 40px; font-size: 1rem; padding: 0 6px }
  input[type='checkbox'] { width: 20px; height: 20px }
  .note { opacity: 0.75; font-size: 0.9rem }
  .necks { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px }
  .neck { border: 1px solid var(--line); border-radius: 10px; padding: 6px; background: var(--bg) }
  .neck.hot { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent) }
  .neck svg { width: 100%; height: auto; display: block }
  .ch { color: var(--accent2); font-weight: 700; font-size: 0.85rem }
  .board { fill: var(--board) }
  .sl { stroke: var(--str); stroke-width: 1.8 }
  .sn { fill: currentColor; font-size: 11px; font-weight: 700 }
  .path { fill: none; stroke: var(--accent); stroke-width: 1.5; stroke-dasharray: 3 3; opacity: 0.6 }
  .nd { fill: var(--card); stroke: var(--accent); stroke-width: 2 }
  .nd.now { fill: var(--accent) }
  .fg { fill: currentColor; font-size: 11px; font-weight: 700 }
  .fg.nowt { fill: var(--on-accent) }
  .ord { fill: var(--accent2); font-size: 9px; font-weight: 700 }
  .nm { font-size: 0.8rem; opacity: 0.85; margin-top: 2px }
</style>
