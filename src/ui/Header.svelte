<script lang="ts">
  import { TOTAL } from '../content/days'
  import { store, currentStreak, doneCount } from '../state/store.svelte'
  import { i18n, setLang, t, type Key } from '../i18n.svelte'
  import { THEMES, theme, setTheme } from '../theme.svelte'
  import Icon from './Icon.svelte'

  const sr = $derived((store.p, currentStreak()))
  const done = $derived((store.p, doneCount()))
</script>

<header>
  <div class="top">
    <label class="themesel">
      <span>{t('theme')}</span>
      <select value={theme.name} onchange={(e) => setTheme(e.currentTarget.value as (typeof THEMES)[number])} aria-label={t('theme')}>
        {#each THEMES as th}<option value={th}>{t(('th_' + th) as Key)}</option>{/each}
      </select>
    </label>
    <div class="lang" role="group" aria-label={t('langue')}>
      <span class:on={i18n.lang === 'fr'}>FR</span>
      <button class="sw" role="switch" aria-checked={i18n.lang === 'en'} aria-label={t('langue')} onclick={() => setLang(i18n.lang === 'fr' ? 'en' : 'fr')}><i></i></button>
      <span class:on={i18n.lang === 'en'}>EN</span>
    </div>
  </div>
  <h1>{t('titre')}</h1>
  <p class="meta"><Icon name="star" size={16} /> {t('serie')}: {sr} {sr > 1 ? t('jours') : t('jour')} · {done}/{TOTAL} {t('faits')}</p>
  <p class="tune">{t('accord_ligne')}: <b>{i18n.lang === 'en' ? 'F – C – G – D' : 'Fa – Do – Sol – Ré'}</b> ({t('accordeon')})</p>
</header>

<style>
  .top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: -4px 0 6px }
  .themesel { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 700 }
  .themesel select { min-height: 36px; border-radius: 8px; border: 1px solid var(--line); background: var(--card); color: inherit; font-size: 0.95rem; padding: 0 8px }
  .lang { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 700 }
  .lang span { color: var(--muted) } .lang span.on { color: var(--accent) }
  .sw { position: relative; width: 48px; height: 26px; min-height: 0; border-radius: 13px; border: 1px solid var(--line); background: var(--card); padding: 0; cursor: pointer }
  .sw i { position: absolute; top: 2px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: var(--accent); transition: transform 0.15s }
  .sw[aria-checked='true'] i { transform: translateX(21px) }
  h1 { font-size: 1.3rem; margin: 0; color: var(--accent) }
  .meta { color: var(--gold-text); font-weight: 600; display: flex; align-items: center; gap: 4px }
  .meta, .tune { margin: 4px 0; font-size: 0.9rem }
</style>
