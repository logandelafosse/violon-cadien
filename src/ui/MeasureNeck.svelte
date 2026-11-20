<script lang="ts">
  // Petit manche à quatre cordes pour une mesure (ou pour un doubling) : bois, sillet, cordes, notes en ivoire.
  // Dessin purement visuel (aria-hidden) ; le résumé parlé est dans `summary`.
  import { OPEN, position, type KeyName } from '../theory/fiddle'
  import { STRING_X, THICK_MEASURE, slots as slotsFor } from '../theory/neck'
  import { t, tf } from '../i18n.svelte'
  import Icon from './Icon.svelte'

  let {
    num, chord, notes, keyName, current = false, playing = -1, showPath = true, showLetters = true, slotCount, summary,
  }: {
    num?: number            // numéro de mesure (rien si absent)
    chord: string           // nom de l'accord, déjà dans la langue de l'interface
    notes: number[]         // hauteurs sonores (MIDI), dans l'ordre
    keyName: KeyName
    current?: boolean       // mesure en cours de lecture
    playing?: number        // indice (dans `notes`) de la note qui sonne, -1 si aucune
    showPath?: boolean
    showLetters?: boolean
    slotCount?: number      // nombre de demi-tons dessinés ; commun à toute la grille pour des manches de même hauteur
    summary: string
  } = $props()

  // Unités de la maquette : un manche de 170 de large (tout est ensuite mis à l'échelle en cqw).
  const U = 170, OPEN_Y = 14, NUT_TOP = 28, NUT_H = 7, SLOT = 24
  const n = $derived(slotCount ?? slotsFor(notes, keyName))
  const boardH = $derived(NUT_H + n * SLOT + 8)
  const areaH = $derived(NUT_TOP + boardH + 4)
  const cq = (u: number) => `${((u / U) * 100).toFixed(3)}cqw`

  const dots = $derived(
    notes.flatMap((m, k) => {
      const p = position(m, keyName)
      if (!p) return []
      const open = p.finger === 0
      const y = open ? OPEN_Y : NUT_TOP + NUT_H + (m - OPEN[p.string] - 0.5) * SLOT
      return [{ k, f: p.finger, open, s: p.string, x: STRING_X[p.string], y, yPct: (y / areaH) * 100, on: k === playing }]
    }),
  )
  const points = $derived(dots.map((d) => `${((d.x / 100) * U).toFixed(1)},${d.y.toFixed(1)}`).join(' '))
  const pct = (v: number) => `${v.toFixed(3)}%`
</script>

<div class="measure" class:cur={current}>
  <div class="top" aria-hidden="true">
    {#if num}
      <span class="num" class:cur={current}>
        {#if current}<Icon name="play" size={14} />{/if}{current ? tf('mes_court', { n: num }) : num}
      </span>
    {:else}<span></span>{/if}
    <span class="chord">{chord}</span>
  </div>

  <div class="area" style="aspect-ratio: {U} / {areaH}" aria-hidden="true">
    {#each STRING_X as x, i}
      <span class="above" style="left: {pct(x)}; top: {pct((4 / areaH) * 100)}; height: {pct(((NUT_TOP - 4) / areaH) * 100)}; width: {cq(THICK_MEASURE[i])}"></span>
    {/each}
    <div class="board wood" style="top: {pct((NUT_TOP / areaH) * 100)}; height: {pct((boardH / areaH) * 100)}">
      <span class="nut" style="height: {pct((NUT_H / boardH) * 100)}"></span>
      {#each STRING_X as x, i}
        <span class="str" style="left: {pct(((x - 4) / 92) * 100)}; width: {cq(THICK_MEASURE[i])}"></span>
      {/each}
    </div>

    {#if showPath && dots.length > 1}
      <svg class="path" viewBox="0 0 {U} {areaH}" preserveAspectRatio="none">
        <polyline {points} class="under" />
        <polyline {points} class="over" />
      </svg>
    {/if}

    {#each dots as d}
      {@const size = d.on ? 31 : 24}
      <span
        class="dot"
        class:open={d.open}
        class:on={d.on}
        style="left: {pct(d.x)}; top: {pct(d.yPct)}; width: {cq(size)}; height: {cq(size)}; font-size: max(0.8125rem, {cq(d.on ? 17 : 14)})"
      >{d.f}</span>
      {#if showLetters}
        <span
          class="letter"
          class:open={d.open}
          style="left: calc({pct(d.x)} + {cq(size / 2)} - 2px); top: calc({pct(d.yPct)} - {cq(size / 2)} - 9px)"
        >{String.fromCharCode(97 + d.k)}</span>
      {/if}
    {/each}
  </div>

  <span class="sr">{summary}</span>
</div>

<style>
  .measure {
    container-type: inline-size;
    position: relative;
    width: 100%;
    padding: 6px 6px 8px;
    border-radius: var(--r);
    background: var(--card);
    border: 1px solid var(--line);
    color: var(--fg);
  }
  /* mesure en cours : anneau accent + marge de fond, sans changer la taille (pas de décalage de la grille) */
  .measure.cur { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent), 0 0 0 5px var(--bg), 0 6px 18px rgb(0 0 0 / 0.18) }
  .top { display: flex; align-items: center; justify-content: space-between; height: 32px; padding: 0 2px }
  .num { display: inline-flex; align-items: center; gap: 4px; font-size: var(--t-sm); font-weight: 700; color: var(--muted) }
  .num.cur { color: var(--accent) }
  .chord { padding: 2px 10px; border-radius: var(--r-pill); background: var(--accent2); color: var(--on-accent2); font-weight: 700; font-size: max(0.875rem, 9.4cqw); line-height: 1.3 }

  .area { position: relative; width: 100% }
  .above { position: absolute; transform: translateX(-50%); background: var(--muted); opacity: 0.45 }
  .board { position: absolute; left: 4%; width: 92%; border-radius: 0 0 8px 8px; overflow: hidden }
  .nut { position: absolute; left: 0; right: 0; top: 0; background: var(--nut) }
  .str { position: absolute; top: 0; bottom: 0; transform: translateX(-50%); background: var(--str) }
  .path { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none }
  .path polyline { fill: none; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke }
  .path .under { stroke: rgb(0 0 0 / 0.55); stroke-width: 3.5 }
  .path .over { stroke: var(--dot); stroke-width: 1.8; stroke-dasharray: 4 4 }

  .dot {
    position: absolute; z-index: 1; transform: translate(-50%, -50%);
    display: flex; align-items: center; justify-content: center; border-radius: 50%; box-sizing: border-box;
    font-weight: 700; font-variant-numeric: tabular-nums;
    background: var(--board); color: var(--dot); border: 2.5px solid var(--dot);
    transition: width 80ms, height 80ms;
  }
  .dot.open { background: var(--bg); color: var(--fg); border-color: var(--fg) }
  /* note qui sonne : plus grosse, pleine, double halo */
  .dot.on { background: var(--dot); color: var(--on-dot); border-color: var(--dot); box-shadow: 0 0 0 3px var(--accent2), 0 0 0 5px var(--dot) }
  .dot.open.on { background: var(--fg); color: var(--bg); border-color: var(--fg); box-shadow: 0 0 0 3px var(--accent2), 0 0 0 5px var(--bg) }
  .letter { position: absolute; z-index: 2; font-size: max(0.8125rem, 7.6cqw); font-weight: 700; line-height: 1; color: var(--dot); text-shadow: 0 1px 2px rgb(0 0 0 / 0.7) }
  .letter.open { color: var(--fg); text-shadow: none }

  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap }
  @media (forced-colors: active) {
    .dot { border: 2px solid CanvasText; forced-color-adjust: auto }
    .measure.cur { outline: 3px solid Highlight }
  }
</style>
