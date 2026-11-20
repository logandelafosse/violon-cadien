<script lang="ts">
  import { dayOf } from '../content/days'
  import { OUTLINE } from '../content/curriculum'
  import { songsFor, songTitle } from '../content/songs'
  import { store, markDay, rateDay } from '../state/store.svelte'
  import { router } from '../router.svelte'
  import { i18n, t } from '../i18n.svelte'
  import StepCard from '../ui/StepCard.svelte'
  import DoneCard from '../ui/DoneCard.svelte'
  import Icon from '../ui/Icon.svelte'
  import PupitreLaunch from '../ui/PupitreLaunch.svelte'

  let { dayNum }: { dayNum: number } = $props()

  const day = $derived(dayOf(dayNum))
  const outline = $derived(OUTLINE.find((o) => o.jour === dayNum))
  const outlineTitle = $derived(outline ? (i18n.lang === 'en' ? outline.titreEn : outline.titre) : t('bientot'))
  const songs = $derived(day ? [...songsFor(day.jour).songs].sort((a, b) => a.mesure - b.mesure) : [])
  const isDone = $derived(day ? !!store.p.done[day.jour] : false)

  // Autoévaluation : cases cochées pour la séance seulement (rien n'est enregistré).
  let checks = $state<Record<string, boolean>>({})

  // On reste sur le même jour après « Marquer comme fait » pour montrer la carte « c'est fait » ;
  // replaceState garde l'ancre sur ce jour si on recharge la page, sans créer d'entrée d'historique.
  function done(n: number) {
    markDay(n)
    router.route = `/jour/${n}`
    history.replaceState(null, '', `#/jour/${n}`)
  }
</script>

{#if day}
  <article>
    <p class="kicker">
      <span class="when">{t('semaine')} {day.semaine} · {t('jour_n')} {day.jour}</span>
      <span class="type" class:revue={day.type === 'revue'}>
        {#if day.type === 'revue'}<Icon name="revision" size={16} />{/if}{day.type === 'revue' ? t('revue') : day.type === 'apprendre' ? t('apprendre') : t('pratiquer')}
      </span>
      <span class="dur"><Icon name="timer" size={16} />~{day.minutes} {t('min')}</span>
    </p>
    <div class="titlebar">
      <h2>{day.titre}</h2>
      <PupitreLaunch />
    </div>
    <p class="goal"><b>{t('objectif_label')}</b> {day.objectif}</p>

    <section class="steps" aria-label={t('etapes_aria')}>
      {#each day.etapes as s, i}<StepCard step={s} index={i} />{/each}
    </section>

    {#if songs.length}
      <a class="songlink" href="#/chansons/{day.jour}">
        <Icon name="song" size={28} />
        <span class="sl-text">
          <b>{t('lien_chanson')}</b>
          <span>{songs.map((s) => `${songTitle(s)} · ${s.mesure === 2 ? t('danse_two_step') : t('danse_valse')}`).join(' — ')}</span>
        </span>
        <Icon name="next" size={24} />
      </a>
    {/if}

    <section class="block" aria-label={t('ecoute_titre_aria')}>
      <h3>{t('a_ecouter')}</h3>
      <ul class="listen">
        {#each day.ecoute as e}<li><Icon name="listen" size={22} /><span>{e}</span></li>{/each}
      </ul>
    </section>

    <section class="block" aria-label={t('autoeval_aria')}>
      <h3>{t('autoeval')}</h3>
      {#each day.autoeval as e, i}
        <label class="check"><input type="checkbox" bind:checked={checks[`${day.jour}-${i}`]} />{e}</label>
      {/each}
    </section>

    {#if day.type === 'revue' && isDone}
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

    {#if isDone}
      <DoneCard jour={day.jour} semaine={day.semaine} />
    {:else}
      <button class="big" onclick={() => done(day.jour)}><Icon name="check" size={24} />{t('marquer')}</button>
    {/if}
  </article>
{:else if outline}
  <article>
    <p class="kicker"><span class="when">{t('semaine')} {Math.ceil(dayNum / 7)} · {t('jour_n')} {dayNum}</span></p>
    <h2>{outlineTitle}</h2>
    <p class="note">{t('plan_apercu')}</p>
  </article>
{:else}
  <h2>{t('bravo')}</h2>
  <p>{t('fini')}</p>
{/if}

<style>
  article { display: flex; flex-direction: column; gap: var(--s-4) }
  .kicker { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-2); margin: var(--s-3) 0 0; font-size: var(--t-sm); font-weight: 700 }
  .when { letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted) }
  .type { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: var(--r-pill); border: 1.5px solid var(--accent); color: var(--accent) }
  .type.revue { border-style: dashed; border-color: var(--accent2); color: var(--accent2) }
  .dur { display: inline-flex; align-items: center; gap: 4px; color: var(--muted) }
  .titlebar { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--s-3) }
  h2 { margin: 0; font-size: var(--t-xl); line-height: var(--lh-tight) }
  .goal { margin: 0; font-size: 1.125rem; line-height: var(--lh) }
  .steps { display: flex; flex-direction: column; gap: var(--s-4); margin-top: 4px }
  .songlink { display: flex; align-items: center; gap: var(--s-3); min-height: 64px; padding: var(--s-3) var(--s-4); border-radius: var(--r); background: var(--accent2); color: var(--on-accent2); text-decoration: none }
  .sl-text { flex: 1; display: flex; flex-direction: column; font-size: 0.9375rem }
  .sl-text b { font-size: 1.125rem }
  .block { display: flex; flex-direction: column; gap: var(--s-2); margin-top: var(--s-2) }
  .block h3 { margin: 0; font-family: var(--font-title); font-size: 1.375rem }
  .listen { margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--line) }
  .listen li { display: flex; gap: var(--s-3); align-items: center; padding: var(--s-3) 0; border-bottom: 1px solid var(--line); font-size: var(--t-base); line-height: 1.4 }
  .listen li :global(svg) { color: var(--accent) }
  .check { display: flex; gap: var(--s-3); align-items: center; min-height: var(--touch); font-size: var(--t-base) }
  .check input { width: 26px; height: 26px; accent-color: var(--accent); flex: none }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: var(--r); padding: var(--s-4) }
  .big { margin-top: var(--s-2); min-height: 64px; border-radius: 14px; border: 0; background: var(--accent); color: var(--on-accent); font-weight: 700; font-size: var(--t-md); display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer }
  .stars { display: flex; gap: 6px }
  .stars button { flex: 1; min-height: var(--touch); border-radius: 10px; border: 1px solid var(--line); background: var(--card); color: var(--muted); display: flex; align-items: center; justify-content: center }
  .stars button.on { color: var(--gold-text); border-color: var(--gold-text) }
  .note { color: var(--muted); font-size: 0.9rem; margin: 0 }
</style>
