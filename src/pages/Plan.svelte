<script lang="ts">
  import { dayOf } from '../content/days'
  import { WEEKS, OUTLINE } from '../content/curriculum'
  import { store, currentDay } from '../state/store.svelte'
  import { i18n, t, tf } from '../i18n.svelte'
  import Icon from '../ui/Icon.svelte'

  const current = $derived(currentDay())
  const outlineTitle = (n: number) => {
    const o = OUTLINE.find((x) => x.jour === n)
    return o ? (i18n.lang === 'en' ? o.titreEn : o.titre) : t('bientot')
  }
  const titleOf = (n: number) => dayOf(n)?.titre ?? outlineTitle(n)
  const isReview = (n: number) => (dayOf(n)?.type ? dayOf(n)!.type === 'revue' : n % 7 === 0)

  function cellLabel(n: number): string {
    const parts = [`${t('plan_jour')} ${n} · ${titleOf(n)}`]
    if (isReview(n)) parts.push(t('leg_revision'))
    if (store.p.done[n]) parts.push(t('leg_fait'))
    if (n === current) parts.push(t('leg_aujourdhui'))
    return parts.join(', ')
  }
</script>

<div class="plan">
<h2>{t('plan_titre')}</h2>
<p class="intro">{t('plan_intro')}</p>

<ul class="legend">
  <li><span class="key key-done"><Icon name="star" size={12} /></span>{t('leg_fait')}</li>
  <li><span class="key key-review"></span>{t('leg_revision')}</li>
  <li><span class="key key-today"></span>{t('leg_aujourdhui')}</li>
</ul>

{#each WEEKS as w (w.semaine)}
  {@const days = Array.from({ length: 7 }, (_, k) => (w.semaine - 1) * 7 + k + 1)}
  {@const count = days.filter((n) => store.p.done[n]).length}
  {@const complete = count === 7}
  {@const rating = store.p.done[days[6]]?.rating}
  <section class="week" class:complete class:now={days.includes(current) && !complete} aria-labelledby="wk{w.semaine}">
    <div class="wh">
      <h3 id="wk{w.semaine}" class="wk"><span class="wn">{t('plan_semaine')} {w.semaine} ·</span> {i18n.lang === 'en' ? w.titreEn : w.titre}</h3>
      <span class="count" class:full={complete}>{count}/7</span>
    </div>
    <div class="grid">
      {#each days as n (n)}
        {@const done = !!store.p.done[n]}
        {@const review = isReview(n)}
        <a class="cell" class:done class:review class:today={n === current} href="#/jour/{n}" aria-label={cellLabel(n)} title={titleOf(n)}>
          <span class="num">{n}</span>
          <span class="mark" aria-hidden="true">
            {#if done}<Icon name="star" size={13} />{:else if review}<Icon name="revision" size={13} />{/if}
          </span>
        </a>
      {/each}
    </div>
    {#if complete}
      <div class="done-row">
        <span class="lys"><Icon name="lys" size={24} /></span>
        <b class="grow">{t('plan_boucle')}</b>
        {#if rating}
          <span class="stars" role="img" aria-label={tf('plan_note_rev', { n: rating })}>
            {#each [1, 2, 3, 4, 5] as s}<span class:off={s > rating}><Icon name="star" size={17} /></span>{/each}
          </span>
          <span class="score">{rating}/5</span>
        {/if}
      </div>
    {/if}
  </section>
{/each}
</div>

<style>
  .plan { container: page / inline-size }
  h2 { margin: 4px 0 var(--s-2); font-size: var(--t-xl) }
  .intro { margin: 0 0 var(--s-3); color: var(--muted) }
  .legend { list-style: none; margin: 0 0 var(--s-4); padding: 0; display: flex; flex-wrap: wrap; gap: var(--s-2) var(--s-4); font-size: var(--t-sm); color: var(--muted) }
  .legend li { display: inline-flex; align-items: center; gap: 6px }
  .key { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 5px; box-sizing: border-box }
  .key-done { background: var(--gold-text); color: var(--card) }
  .key-review { border: 2px dashed var(--muted) }
  .key-today { box-shadow: 0 0 0 3px var(--fg); width: 14px; height: 14px; margin: 3px }

  .week { background: var(--card); border: 1px solid var(--line); border-radius: var(--r); padding: var(--s-3); margin: 0 0 var(--s-3); display: flex; flex-direction: column; gap: 10px }
  .week.now { border: 2px solid var(--accent) }
  .week.complete { border: 2px solid var(--gold-text) }
  .wh { display: flex; justify-content: space-between; align-items: baseline; gap: var(--s-2) }
  .wk { margin: 0; font-family: var(--font-text); font-size: 1.125rem; line-height: 1.25 }
  .wn { color: var(--muted); font-weight: 400 }
  .count { flex: none; font-size: var(--t-sm); font-weight: 700; font-variant-numeric: tabular-nums; color: var(--muted) }
  .count.full { color: var(--gold-text) }

  .grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px }
  .cell { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; min-height: 48px; border-radius: 9px; box-sizing: border-box; text-decoration: none; font-weight: 700; font-size: var(--t-sm); font-variant-numeric: tabular-nums; background: var(--bg); color: var(--fg); border: 1.5px solid var(--line) }
  .cell.review { border: 1.5px dashed var(--muted) }
  .cell.done { background: var(--gold-text); color: var(--card); border-color: var(--gold-text) }
  .cell.today { box-shadow: 0 0 0 3px var(--card), 0 0 0 6px var(--fg) }
  .mark { display: flex; min-height: 13px; line-height: 1 }
  @container page (min-width: 600px) { .cell { min-height: 56px } }

  .done-row { display: flex; align-items: center; gap: 10px; padding-top: 6px; border-top: 1px dashed var(--line); font-size: var(--t-base) }
  .grow { flex: 1 }
  .lys { color: var(--accent2); display: inline-flex }
  .stars { display: inline-flex; gap: 2px; color: var(--gold-text) }
  .stars .off { color: var(--line) }
  .score { font-weight: 700; color: var(--gold-text) }
</style>
