<script lang="ts">
  import { OPEN, stringLabel, SHIFT, noteName, position, shapeKey, shapeName, keyName, majorScale, pentatonic, type KeyName } from '../theory/fiddle'
  import { playTone } from '../audio/engine'
  import { t } from '../i18n.svelte'
  // `playing` : indice de la note en cours de lecture (halo). Sans effet tant que la branche feat/design-manche ne l'a pas branché.
  let { cle, de = 0, a = 0, type = 'majeure', notes: given, titre, compact = false, playing = undefined }: { cle: KeyName; de?: number; a?: number; type?: 'majeure' | 'pentatonique'; notes?: number[]; titre?: string; compact?: boolean; playing?: number } = $props()
  $effect(() => { void playing })
  let mode = $state<'son' | 'doigte' | 'les deux'>('les deux')

  const notes = $derived(given ?? (type === 'pentatonique' ? pentatonic(cle, de, a) : majorScale(cle, de, a)))
  const shape = $derived(shapeKey(cle))
  const dots = $derived(
    notes.flatMap((m) => {
      const p = position(m, cle)
      return p ? [{ m, ...p }] : []
    }),
  )
  const W = 370, H = 400, left = 36, gap = 98, top = 78, rowH = 42
  const x = (s: number) => left + s * gap
  // cordes à vide au-dessus du manche ; doigts sur le manche
  const cy = (d: { m: number; string: number; finger: number }) => (d.finger === 0 ? top - 28 : top + (d.m - OPEN[d.string]) * rowH)
  const fing = (m: number) => noteName(m + SHIFT, shape)
  const snd = (m: number) => noteName(m, cle)
  // le nom accessible commence par le texte visible (WCAG 2.5.3)
  const label = (d: { m: number; finger: number }) => `${d.finger} ${mode === 'doigte' ? fing(d.m) : snd(d.m)}${mode === 'les deux' ? ` (${fing(d.m)})` : ''}`
</script>

<div class="fb">
  {#if !compact}<div class="tog" role="group" aria-label="Affichage des noms">
    {#each ['son', 'doigte', 'les deux'] as const as o}
      <button class:on={mode === o} onclick={() => (mode = o)}>{o === 'son' ? t('sonore') : o === 'doigte' ? t('doigte') : t('les_deux')}</button>
    {/each}
  </div>{/if}
  <p class="cap">{#if titre}<b>{titre}</b>{:else}{t('sonne_en')} <b>{keyName(cle)}</b> · {t('forme_de')} <b>{shapeName(cle)}</b>{/if}</p>
  <svg viewBox="0 0 {W} {H}" role="group" aria-label={t("manche_aria")}>
    <rect x={left - 14} y={top - 12} width={gap * 3 + 28} height={rowH * 7 + 24} rx="6" class="board" />
    {#each OPEN as _, s}
      <line x1={x(s)} x2={x(s)} y1={top - 12} y2={top + rowH * 7 + 12} class="str" />
      <text x={x(s)} y="16" text-anchor="middle" class="lbl">{stringLabel(s)}</text>
    {/each}
    {#each dots as d}
      <g class="dot" onclick={() => playTone(d.m, 1)} onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); playTone(d.m, 1) } }} role="button" tabindex="0" aria-label="{label(d)}: {t('corde_de')} {stringLabel(d.string)}, {t('doigt')} {d.finger}, {t('sonne')} {snd(d.m)}, {t('doigte_n')} {fing(d.m)}">
        <circle cx={x(d.string)} cy={cy(d)} r="15" class:open={d.finger === 0} />
        <text x={x(d.string)} y={cy(d) + 5} text-anchor="middle" class="num">{d.finger}</text>{" "}
        <text x={x(d.string) + 22} y={cy(d) + (mode === 'les deux' ? -1 : 5)} class="nm">{mode === 'doigte' ? fing(d.m) : snd(d.m)}</text>{" "}
        {#if mode === 'les deux'}<text x={x(d.string) + 22} y={cy(d) + 12} class="nm2">({fing(d.m)})</text>{/if}
      </g>
    {/each}
  </svg>
</div>

<style>
  .fb { margin: 0.5rem 0 }
  .tog { display: flex; gap: 6px; margin-bottom: 4px }
  .tog button { padding: 6px 12px; border-radius: 16px; border: 1px solid var(--line); background: transparent; color: inherit }
  .tog button.on { background: var(--accent); color: var(--on-accent); border-color: var(--accent) }
  .cap { font-size: 0.9rem; margin: 4px 0; opacity: 0.85 }
  svg { width: 100%; max-width: 420px; height: auto }
  /* anciennes couleurs du manche, en attendant la refonte (--board et --str sont maintenant le bois et l'ivoire) */
  .board { fill: var(--board-legacy) }
  .str { stroke: var(--str-legacy); stroke-width: 2 }
  .lbl { fill: currentColor; font-size: 13px; font-weight: 600 }
  .dot { cursor: pointer }
  .dot circle { fill: var(--accent) }
  .dot circle.open { fill: transparent; stroke: var(--accent); stroke-width: 2 }
  .num { fill: var(--on-accent); font-size: 14px; font-weight: 700 }
  .dot circle.open + .num { fill: currentColor }
  .nm { fill: currentColor; font-size: 12px; font-weight: 600 }
  .nm2 { fill: currentColor; font-size: 10px; opacity: 0.7 }
</style>
