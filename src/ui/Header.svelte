<script lang="ts">
  import { TOTAL } from '../content/days'
  import { store, currentStreak, doneCount, currentDay } from '../state/store.svelte'
  import { weekCounts, weekOf, weekPercent, WEEKS_TOTAL } from '../state/weeks'
  import { i18n, setLang, t, tf, type Lang } from '../i18n.svelte'
  import Icon from './Icon.svelte'
  import Segmented from './Segmented.svelte'
  import ThemeMenu from './ThemeMenu.svelte'

  const sr = $derived((store.p, currentStreak()))
  const done = $derived((store.p, doneCount()))
  const counts = $derived(weekCounts(Object.keys(store.p.done).map(Number)))
  const week = $derived((store.p, weekOf(currentDay())))
  const label = $derived(tf('prog_label', { done, total: TOTAL, w: week, weeks: WEEKS_TOTAL }))
  const langs: { value: Lang; label: string; title: string; lang: string }[] = [
    { value: 'fr', label: 'FR', title: 'Français', lang: 'fr' },
    { value: 'en', label: 'EN', title: 'English', lang: 'en' },
  ]
</script>

<header class="hd">
  <div class="row1">
    <h1>
      <span class="t1">{t('titre_court')}</span>
      <span class="t2">{t('sous_titre')}</span>
    </h1>
    <div class="actions">
      <ThemeMenu />
      <Segmented options={langs} value={i18n.lang} onselect={setLang} label={t('langue')} check={false} />
    </div>
  </div>

  <div class="prog">
    <div class="meta">
      <span class="streak"><Icon name="star" size={18} />{t('serie')} : {sr} {sr > 1 ? t('jours') : t('jour')}</span>
      <span class="count">{done}/{TOTAL} {t('faits')}</span>
    </div>
    <div class="weeks" role="img" aria-label={label}>
      {#each counts as n, i (i)}
        <span class="seg" style="--p:{weekPercent(n)}%"></span>
      {/each}
    </div>
  </div>

  <p class="tune">
    <Icon name="tune" size={18} />
    <span>{t('accord_ligne')} : <b>{i18n.lang === 'en' ? 'F · C · G · D' : 'Fa · Do · Sol · Ré'}</b> ({t('accordeon')})</span>
  </p>
</header>

<style>
  .hd { display: flex; flex-direction: column; gap: var(--s-3); padding-bottom: var(--s-3); margin-bottom: var(--s-4); border-bottom: 1px solid var(--line) }
  .row1 { position: relative; display: flex; align-items: center; justify-content: space-between; gap: var(--s-3) }
  h1 { margin: 0; display: flex; flex-direction: column; min-width: 0 }
  .t1 { font-size: var(--t-lg); font-weight: 700; line-height: var(--lh-tight) }
  .t2 { font-size: 1rem; font-style: italic; font-weight: 500; color: var(--accent) }
  .actions { display: flex; align-items: center; gap: var(--s-2) }
  .prog { display: flex; flex-direction: column; gap: 6px }
  .meta { display: flex; align-items: center; justify-content: space-between; gap: var(--s-3); font-size: var(--t-sm) }
  .streak { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; color: var(--gold-text) }
  .count { font-weight: 700; font-variant-numeric: tabular-nums }
  .weeks { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 3px }
  .seg { height: 8px; border-radius: 2px; background: linear-gradient(90deg, var(--gold-text) var(--p), var(--line) var(--p)) }
  .tune { margin: 0; display: flex; align-items: center; gap: var(--s-2); font-size: var(--t-sm); color: var(--muted) }
  .tune b { color: var(--fg) }
</style>
