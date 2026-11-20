<script lang="ts">
  import { dayOf } from '../content/days'
  import { store, undoDay, currentStreak, doneCount } from '../state/store.svelte'
  import { t, tf } from '../i18n.svelte'
  import Icon from './Icon.svelte'

  // Carte « c'est fait » : remplace le saut au jour suivant. Série, total, jours restants dans la semaine, bande de la semaine.
  let { jour, semaine }: { jour: number; semaine: number } = $props()

  const first = $derived((semaine - 1) * 7 + 1)
  const cells = $derived(
    Array.from({ length: 7 }, (_, k) => {
      const d = first + k
      return { d, done: !!store.p.done[d], now: d === jour, revue: dayOf(d)?.type === 'revue' || d % 7 === 0 }
    }),
  )
  const doneInWeek = $derived(cells.filter((c) => c.done).length)
  const remaining = $derived(7 - doneInWeek)
  const streak = $derived(currentStreak())
  const date = $derived(store.p.done[jour]?.date ?? '')
</script>

<div class="done" role="status">
  <div class="stamp"><Icon name="star" size={40} /></div>
  <div class="msg">{t('jour_n')} {jour}, {t('cest_fait')}</div>
  <div class="stats">
    {t('carte_serie')} <b>{streak} {streak > 1 ? t('jours') : t('jour')}</b> · {doneCount()}/84 ·
    {remaining === 0 ? tf('semaine_bouclee', { s: semaine }) : tf('reste_semaine', { n: remaining, s: semaine })}
  </div>
  <div class="week" role="img" aria-label={tf('semaine_aria', { s: semaine, n: doneInWeek })}>
    {#each cells as c}
      <span class="cell" class:done={c.done} class:now={c.now} class:revue={c.revue && !c.done}>
        {#if c.done}<Icon name="star" size={18} />{:else}{c.d}{/if}
      </span>
    {/each}
  </div>
  <a class="next" href={jour < 84 ? `#/jour/${jour + 1}` : '#/plan'}>
    {jour < 84 ? t('jour_suivant') : t('voir_plan')}<Icon name="next" size={20} />
  </a>
  <button type="button" class="undo" onclick={() => undoDay(jour)}>
    <Icon name="check" size={18} />{tf('fait_le_court', { d: date })} — <u>{t('annuler')}</u>
  </button>
</div>

<style>
  .done { margin-top: var(--s-2); border: 2px solid var(--gold-text); border-radius: var(--r-lg); padding: 20px var(--s-4) var(--s-4); display: flex; flex-direction: column; align-items: center; gap: var(--s-3); background: var(--card); text-align: center }
  .stamp { width: 72px; height: 72px; border-radius: 50%; border: 2px dashed var(--gold-text); color: var(--gold-text); display: flex; align-items: center; justify-content: center; animation: press 200ms ease-out }
  .msg { font-family: var(--font-title); font-size: var(--t-lg); font-weight: 700 }
  .stats { font-size: var(--t-base); color: var(--muted) }
  .stats b { color: var(--gold-text) }
  .week { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; width: 100%; max-width: 320px }
  .cell { aspect-ratio: 1; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: var(--t-sm); border: 1.5px solid var(--line); color: var(--muted) }
  .cell.revue { border-style: dashed }
  .cell.done { background: var(--gold-text); color: var(--card); border-color: var(--gold-text) }
  .cell.now { box-shadow: 0 0 0 3px var(--card), 0 0 0 5px var(--fg); transform: scale(1.06) }
  .next { width: 100%; box-sizing: border-box; min-height: 56px; border-radius: var(--r); background: var(--accent); color: var(--on-accent); font-weight: 700; font-size: var(--t-md); text-decoration: none; display: flex; align-items: center; justify-content: center; gap: var(--s-2) }
  .undo { min-height: 48px; padding: 0 var(--s-4); border-radius: var(--r); border: 2px solid var(--line); background: transparent; color: var(--fg); font-size: 1rem; display: inline-flex; align-items: center; gap: 6px; cursor: pointer }
  @keyframes press { from { transform: scale(1.4); opacity: 0 } to { transform: scale(1); opacity: 1 } }
  @media (prefers-reduced-motion: reduce) { .stamp { animation: none } }
</style>
