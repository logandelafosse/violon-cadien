<script lang="ts">
  import { dayOf } from '../content/days'
  import { OUTLINE } from '../content/curriculum'
  import { songsFor } from '../content/songs'
  import { store, markDay, undoDay, rateDay } from '../state/store.svelte'
  import { go } from '../router.svelte'
  import { i18n, t } from '../i18n.svelte'
  import StepCard from '../ui/StepCard.svelte'
  import Icon from '../ui/Icon.svelte'
  import PupitreLaunch from '../ui/PupitreLaunch.svelte'

  let { dayNum }: { dayNum: number } = $props()

  const day = $derived(dayOf(dayNum))
  const outline = $derived(OUTLINE.find((o) => o.jour === dayNum))
  const outlineTitle = $derived(outline ? (i18n.lang === 'en' ? outline.titreEn : outline.titre) : t('bientot'))
</script>

{#if day}
  <article>
    <p class="kicker">{t('semaine')} {day.semaine} · {t('jour_n')} {day.jour} · {day.type === 'revue' ? t('revue') : day.type === 'apprendre' ? t('apprendre') : t('pratiquer')} · ~{day.minutes} {t('min')}</p>
    <h2>{day.titre}</h2>
    <PupitreLaunch />
    <p class="goal">{day.objectif}</p>
    {#each day.etapes as s, i}<StepCard step={s} index={i} />{/each}
    {#if songsFor(day.jour).songs.length}
      <button class="songlink" onclick={() => go(`/chansons/${day.jour}`)}><Icon name="song" size={20} />{t('lien_chanson')}<Icon name="next" size={18} /></button>
    {/if}
    <section class="card">
      <h3>{t('a_ecouter')}</h3>
      <ul>{#each day.ecoute as e}<li>{e}</li>{/each}</ul>
      <h3>{t('autoeval')}</h3>
      <ul>{#each day.autoeval as e}<li>{e}</li>{/each}</ul>
    </section>
    {#if day.type === 'revue' && store.p.done[day.jour]}
      <section class="card" aria-label={t('note_revue')}>
        <p>{t('note_revue')}</p>
        <div class="stars">
          {#each [1, 2, 3, 4, 5] as r}
            <button class:on={(store.p.done[day.jour].rating ?? 0) >= r} aria-pressed={store.p.done[day.jour].rating === r} aria-label="{t('note_n')} {r}/5" onclick={() => rateDay(day.jour, r)}><Icon name="star" size={24} /></button>
          {/each}
        </div>
        <p class="note">{t('note_effacer')}</p>
      </section>
    {/if}
    {#if store.p.done[day.jour]}
      <button class="big done" onclick={() => undoDay(day.jour)}><Icon name="check" size={20} /> {t('fait_le')} {store.p.done[day.jour].date} — {t('annuler')}</button>
    {:else}
      <button class="big" onclick={() => { markDay(day.jour); go('/') }}>{t('marquer')}</button>
    {/if}
  </article>
{:else if outline}
  <article>
    <p class="kicker">{t('semaine')} {Math.ceil(dayNum / 7)} · {t('jour_n')} {dayNum}</p>
    <h2>{outlineTitle}</h2>
    <p class="note">{t('plan_apercu')}</p>
  </article>
{:else}
  <h2>{t('bravo')}</h2>
  <p>{t('fini')}</p>
{/if}

<style>
  h2 { margin: 4px 0 }
  .kicker { color: var(--accent2); font-weight: 600; font-size: 0.85rem; margin: 16px 0 0 }
  .goal { font-size: 1.05rem }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px; margin: 12px 0 }
  .card h3 { margin: 8px 0 }
  .big { width: 100%; min-height: 56px; border-radius: 12px; border: 0; background: var(--accent); color: var(--on-accent); font-size: 1.1rem; font-weight: 600; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 6px }
  .big.done { background: var(--card); color: inherit; border: 1px solid var(--line) }
  .songlink { width: 100%; min-height: 48px; margin: 4px 0 8px; border-radius: 10px; border: 1px dashed var(--gold); background: transparent; color: inherit; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px }
  .stars { display: flex; gap: 6px }
  .stars button { flex: 1; min-height: 48px; border-radius: 10px; border: 1px solid var(--line); background: var(--card); color: var(--muted); display: flex; align-items: center; justify-content: center }
  .stars button.on { color: var(--gold-text); border-color: var(--gold) }
  .note { color: var(--muted); font-size: 0.9rem }
</style>
