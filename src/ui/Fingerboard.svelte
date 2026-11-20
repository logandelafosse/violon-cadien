<script lang="ts">
  import { OPEN, stringLabel, SHIFT, noteName, position, shapeKey, shapeName, keyName, majorScale, pentatonic, type KeyName } from '../theory/fiddle'
  import { STRING_X, THICK_LARGE, TAPES, slots } from '../theory/neck'
  import { playTone } from '../audio/engine'
  import { t } from '../i18n.svelte'
  import Segmented from './Segmented.svelte'
  // `playing` : indice (dans `notes`) de la note en cours de lecture ; elle reçoit un halo.
  let { cle, de = 0, a = 0, type = 'majeure', notes: given, titre, compact = false, playing = undefined }: { cle: KeyName; de?: number; a?: number; type?: 'majeure' | 'pentatonique'; notes?: number[]; titre?: string; compact?: boolean; playing?: number } = $props()
  type Mode = 'son' | 'doigte' | 'les deux'
  let mode = $state<Mode>('les deux')

  const notes = $derived(given ?? (type === 'pentatonique' ? pentatonic(cle, de, a) : majorScale(cle, de, a)))
  const shape = $derived(shapeKey(cle))
  const dots = $derived(
    notes.flatMap((m, i) => {
      const p = position(m, cle)
      return p ? [{ i, m, string: p.string, finger: p.finger, semis: m - OPEN[p.string] }] : []
    }),
  )
  const fing = (m: number) => noteName(m + SHIFT, shape)
  const snd = (m: number) => noteName(m, cle)
  /** ♯ et ♭ dits en toutes lettres pour les lecteurs d'écran. */
  const spoken = (n: string) => n.replace('♯', ` ${t('diese')}`).replace('♭', ` ${t('bemol')}`)
  // le nom accessible commence par le texte visible (le doigt) : WCAG 2.5.3
  const aria = (d: { m: number; string: number; finger: number }) =>
    `${d.finger}, ${t('corde_de')} ${stringLabel(d.string)}, ${t('doigt')} ${d.finger}, ${t('sonne')} ${spoken(snd(d.m))}, ${t('doigte_n')} ${spoken(fing(d.m))}`

  // Géométrie en « unités de maquette » (la maquette fait 358 de large) : tout suit la largeur du composant (--u).
  const W = 358, NUT_TOP = 62, NUT_H = 10, SLOT = 52, OPEN_Y = 30
  const slotCount = $derived(slots(notes, cle))
  const boardH = $derived(NUT_H + slotCount * SLOT + 22)
  const totalH = $derived(NUT_TOP + boardH + 30)
  const yOf = (semis: number) => NUT_TOP + NUT_H + (semis - 0.5) * SLOT
  const u = (n: number) => `calc(${n} * var(--u))`
  const half = 'max(16px, calc(20 * var(--u)))' // demi-diamètre d'un point
</script>

<div class="fb">
  {#if !compact}
    <Segmented
      label={t('noms_notes')}
      value={mode}
      onselect={(v) => (mode = v)}
      options={[{ value: 'son', label: t('sonore') }, { value: 'doigte', label: t('doigte') }, { value: 'les deux', label: t('les_deux') }]}
    />
  {/if}
  <div class="stage" role="group" aria-label={t('manche_aria')} style="--u: calc(100cqw / {W}); height: {u(totalH)}">
    {#each OPEN as _, s}
      <span class="above" aria-hidden="true" style="left: {STRING_X[s]}%; width: {u(THICK_LARGE[s])}; height: {u(NUT_TOP)}"></span>
    {/each}
    <div class="board wood" aria-hidden="true" style="top: {u(NUT_TOP)}; height: {u(boardH)}"></div>
    <span class="nut" aria-hidden="true" style="top: {u(NUT_TOP)}; height: {u(NUT_H)}"></span>
    {#each TAPES as k}
      <span class="tape" aria-hidden="true" style="top: {u(yOf(k) - 1.5)}; height: {u(3)}"></span>
    {/each}
    {#each OPEN as _, s}
      <span class="str" aria-hidden="true" style="left: {STRING_X[s]}%; width: {u(THICK_LARGE[s])}; top: {u(NUT_TOP)}; height: {u(boardH)}"></span>
      <span class="sname" aria-hidden="true" style="left: {STRING_X[s]}%; top: {u(NUT_TOP + boardH + 6)}">{stringLabel(s)}</span>
    {/each}
    {#each dots as d (d.i)}
      {@const open = d.finger === 0}
      {@const y = open ? OPEN_Y : yOf(d.semis)}
      {@const left = d.string === 3}
      <button type="button" class="dot" class:open class:now={playing === d.i} aria-label={aria(d)} onclick={() => playTone(d.m, 1)} style="left: {STRING_X[d.string]}%; top: {u(y)}">{d.finger}</button>
      <span class="lab" class:open class:left aria-hidden="true" style="top: {u(y)}; {left ? `right: calc(100% - ${STRING_X[d.string]}% + ${half} + ${u(6)})` : `left: calc(${STRING_X[d.string]}% + ${half} + ${u(6)})`}">
        <span class:son={mode !== 'doigte'} class:doi={mode === 'doigte'}>{mode === 'doigte' ? fing(d.m) : snd(d.m)}</span>
        {#if mode === 'les deux'}<span class="doi">{fing(d.m)}</span>{/if}
      </span>
    {/each}
  </div>
  <p class="legend"><strong>{#if titre}{titre}{:else}{t('sonne_en')} {keyName(cle)} · {t('forme_de')} {shapeName(cle)}{/if}</strong>{#if !compact} · <b>{t('leg_gras')}</b> = {t('leg_sonore')} · <i>{t('leg_ital')}</i> = {t('leg_doigte')}{/if}</p>
</div>

<style>
  .fb { container-type: inline-size; width: 100%; max-width: 420px; margin: 0.5rem auto; display: flex; flex-direction: column; gap: 12px }
  .stage { position: relative; width: 100% }
  .above, .str { position: absolute; transform: translateX(-50%) }
  .above { top: 0; background: var(--muted); opacity: 0.55 }
  .board { position: absolute; left: 3.35%; width: 93.3%; border-radius: 0 0 calc(14 * var(--u)) calc(14 * var(--u)); overflow: hidden }
  .nut { position: absolute; left: 3.35%; width: 93.3%; background: var(--nut); box-shadow: 0 2px 3px rgb(0 0 0 / 0.35) }
  .tape { position: absolute; left: 3.35%; width: 93.3%; background: var(--str); opacity: 0.22 }
  .str { background: var(--str); box-shadow: 1px 0 0 rgb(0 0 0 / 0.35) }
  .sname { position: absolute; transform: translateX(-50%); font-weight: 700; font-size: max(13px, calc(14 * var(--u))); color: var(--muted) }
  .dot {
    position: absolute; transform: translate(-50%, -50%); box-sizing: border-box; padding: 0; min-height: 0;
    width: max(32px, calc(40 * var(--u))); aspect-ratio: 1; border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: max(14px, calc(19 * var(--u)));
    background: var(--dot); color: var(--on-dot); border: 0; box-shadow: 0 2px 4px rgb(0 0 0 / 0.45); transition: width 120ms, box-shadow 120ms;
  }
  .dot::before { content: ''; position: absolute; left: 50%; top: 50%; width: max(100%, 44px); height: max(100%, 44px); transform: translate(-50%, -50%); border-radius: 50% }
  .dot.open { background: var(--bg); color: var(--fg); border: max(2px, calc(3 * var(--u))) solid var(--fg) }
  .dot.now { width: max(37px, calc(46 * var(--u))); box-shadow: 0 0 0 max(3px, calc(4 * var(--u))) var(--accent2), 0 2px 6px rgb(0 0 0 / 0.4) }
  .dot.open.now { background: var(--fg); color: var(--bg) }
  .lab { position: absolute; transform: translateY(-50%); display: flex; flex-direction: column; line-height: 1.05; white-space: nowrap; color: var(--dot); pointer-events: none }
  .lab.open { color: var(--fg) }
  .lab.left { align-items: flex-end }
  .son { font-weight: 700; font-size: max(13px, calc(17 * var(--u))) }
  .doi { font-style: italic; font-size: max(12px, calc(15 * var(--u))) }
  .lab .son + .doi { margin-top: calc(2 * var(--u)) }
  .legend { margin: 0; font-size: max(13px, 0.875rem); line-height: 1.4; color: var(--muted) }
  .legend strong { color: var(--fg) }
</style>
