<script lang="ts">
  import { dayOf } from '../content/days'
  import { WEEKS, OUTLINE } from '../content/curriculum'
  import { store } from '../state/store.svelte'
  import { go } from '../router.svelte'
  import { i18n, t } from '../i18n.svelte'
  import Icon from '../ui/Icon.svelte'

  const outlineTitle = (n: number) => { const o = OUTLINE.find((x) => x.jour === n); return o ? (i18n.lang === 'en' ? o.titreEn : o.titre) : t('bientot') }
</script>

<h2>{t('plan')}</h2>
{#each WEEKS as w}
  <h3 class="wk">{t('plan_semaine')} {w.semaine} · {i18n.lang === 'en' ? w.titreEn : w.titre}</h3>
  <div class="grid">
    {#each Array(7) as _, k}
      {@const n = (w.semaine - 1) * 7 + k + 1}
      {@const d = dayOf(n)}
      <button class="cell" class:done={store.p.done[n]} class:soon={!d} onclick={() => go(`/jour/${n}`)} title={d?.titre ?? outlineTitle(n)}>
        {n}{#if d?.type === 'revue'}<small>{t('revision')}{#if store.p.done[n]?.rating} <Icon name="star" size={9} />{store.p.done[n].rating}{/if}</small>{/if}
      </button>
    {/each}
  </div>
{/each}
<p class="note">{t('plan_note')}</p>

<style>
  h2 { margin: 4px 0 }
  .grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px }
  .cell { aspect-ratio: 1; border-radius: 8px; border: 1px solid var(--line); background: var(--card); color: inherit; font-size: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center }
  .cell small { font-size: 0.55rem }
  .cell.done { background: var(--accent2); color: var(--on-accent2); border-color: var(--accent2) }
  .cell.soon { opacity: 0.45 }
  .wk { margin: 14px 0 6px; font-size: 0.95rem; color: var(--accent2) }
  .note { color: var(--muted); font-size: 0.9rem }
</style>
