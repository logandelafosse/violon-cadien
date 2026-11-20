<script lang="ts">
  import { DAYS, TOTAL, dayOf } from './content/days'
  import { load, save, loadState, clear, nextDay, streak, markDone, undoDone, setRating, emptyProgress, type Progress } from './state/progress'
  import { buildBackup, parseBackup, applyImport, type ImportResult } from './state/backup'
  import { storageAvailable, requestPersist } from './state/storage'
  import StepCard from './ui/StepCard.svelte'
  import Songs from './ui/Songs.svelte'
  import Glossary from './ui/Glossary.svelte'
  import { WEEKS, OUTLINE } from './content/curriculum'
  import { songsFor } from './content/songs'
  import { stopAll } from './audio/engine'
  import { i18n, setLang, t, type Key } from './i18n.svelte'
  import { THEMES, SWATCH, theme, setTheme } from './theme.svelte'
  setLang(i18n.lang)
  setTheme(theme.name)

  let p = $state<Progress>(load())
  let route = $state(location.hash.slice(1) || '/')
  window.addEventListener('hashchange', () => { stopAll(); route = location.hash.slice(1) || '/' })
  const go = (r: string) => { location.hash = r; window.scrollTo(0, 0) }

  const current = $derived(nextDay(p, TOTAL))
  const dayNum = $derived(route.startsWith('/jour/') ? Number(route.slice(6)) : current)
  const day = $derived(dayOf(dayNum))
  const sr = $derived(streak(p))
  const songDay = $derived(Number(route.split('/')[2]) || Math.min(current, 84))

  const outlineOf = (n: number) => OUTLINE.find((o) => o.jour === n)
  const outlineTitle = (n: number) => { const o = outlineOf(n); return o ? (i18n.lang === 'en' ? o.titreEn : o.titre) : t('bientot') }

  const commit = (np: Progress) => { p = np; save(p) }
  const done = (n: number) => commit(markDone(p, n))
  const undo = (n: number) => commit(undoDone(p, n))
  const rate = (n: number, r: number) => commit(setRating(p, n, r))
  function exportData() {
    const a = document.createElement('a')
    const url = URL.createObjectURL(new Blob([JSON.stringify(buildBackup(p, { lang: i18n.lang, theme: theme.name }), null, 1)], { type: 'application/json' }))
    a.href = url
    a.download = i18n.lang === 'en' ? 'cadien-fiddle-progress.json' : 'violon-cadien-progres.json'; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  // Import / réinitialisation / état du stockage (Réglages)
  let storageOk = $state(storageAvailable())
  const loadProblem = loadState()
  requestPersist()
  let pending = $state<Extract<ImportResult, { ok: true }> | null>(null)
  let importMsg = $state<{ ok: boolean; text: string } | null>(null)
  let resetAsk = $state(false)
  const errKey = { json: 'err_json', format: 'err_format', future: 'err_future', data: 'err_data' } as const
  async function pickFile(e: Event & { currentTarget: HTMLInputElement }) {
    const f = e.currentTarget.files?.[0]
    e.currentTarget.value = ''
    pending = null; importMsg = null
    if (!f) return
    let text = ''
    try { text = await f.text() } catch { importMsg = { ok: false, text: t('import_ko') }; return }
    const r = parseBackup(text, THEMES)
    if (r.ok) pending = r
    else importMsg = { ok: false, text: t(errKey[r.error]) + ' ' + t('import_ko') }
  }
  function doImport(mode: 'merge' | 'replace') {
    if (!pending) return
    commit(applyImport(p, pending.progress, mode))
    if (mode === 'replace') {
      if (pending.prefs.lang) setLang(pending.prefs.lang)
      if (pending.prefs.theme) setTheme(pending.prefs.theme as (typeof THEMES)[number])
    }
    pending = null; importMsg = { ok: true, text: t('import_ok') }
  }
  function doReset() { clear(); p = emptyProgress(); save(p); resetAsk = false; importMsg = { ok: true, text: t('reset_done') } }
</script>

<main>
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
    <p class="meta">★ {t('serie')}: {sr} {sr > 1 ? t('jours') : t('jour')} · {Object.keys(p.done).length}/{TOTAL} {t('faits')}</p>
    <p class="tune">{t('accord_ligne')}: <b>{i18n.lang === 'en' ? 'F – C – G – D' : 'Fa – Do – Sol – Ré'}</b> ({t('accordeon')})</p>
  </header>

  {#if route === '/plan'}
    <h2>{t('plan')}</h2>
    {#each WEEKS as w}
      <h3 class="wk">{t('plan_semaine')} {w.semaine} · {i18n.lang === 'en' ? w.titreEn : w.titre}</h3>
      <div class="grid">
        {#each Array(7) as _, k}
          {@const n = (w.semaine - 1) * 7 + k + 1}
          {@const d = dayOf(n)}
          <button class="cell" class:done={p.done[n]} class:soon={!d} onclick={() => go(`/jour/${n}`)} title={d?.titre ?? outlineTitle(n)}>
            {n}{#if d?.type === 'revue'}<small>{t('revision')}{#if p.done[n]?.rating} ★{p.done[n].rating}{/if}</small>{/if}
          </button>
        {/each}
      </div>
    {/each}
    <p class="note">{t('plan_note')}</p>
  {:else if route.startsWith('/chansons')}
    <Songs jour={songDay} onjour={(n) => go(`/chansons/${n}`)} />
  {:else if route === '/vocabulaire'}
    <Glossary />
  {:else if route === '/reglages'}
    <h2>{t('reglages')}</h2>
    <h3>{t('theme')}</h3>
    <div class="themes">
      {#each THEMES as th}
        <button class="th" class:on={theme.name === th} onclick={() => setTheme(th)} aria-pressed={theme.name === th}>
          <span class="sw3">{#each SWATCH[th] as c}<i style="background:{c}"></i>{/each}</span>
          {t(('th_' + th) as Key)}
        </button>
      {/each}
    </div>
    {#if !storageOk}<p class="warn" role="alert">{t('stockage_indispo')}</p>{/if}
    {#if loadProblem === 'corrupt'}<p class="warn" role="alert">{t('stockage_corrompu')}</p>{/if}
    {#if loadProblem === 'future'}<p class="warn" role="alert">{t('stockage_futur')}</p>{/if}
    <button class="big" onclick={exportData}>{t('exporter')}</button>
    <p class="note">{t('export_note')}</p>
    <label class="big filebtn">{t('importer')}<input type="file" accept="application/json,.json" onchange={pickFile} hidden /></label>
    <p class="note">{t('import_note')}</p>
    {#if pending}
      <div class="card" role="group" aria-label={t('importer')}>
        <p>{t('import_trouve')} : <b>{Object.keys(pending.progress.done).length}</b></p>
        <button class="big" onclick={() => doImport('merge')}>{t('import_fusion')}</button>
        <button class="big done" onclick={() => doImport('replace')}>{t('import_remplace')}</button>
        <p class="note">{t('import_prefs_note')}</p>
        <button class="big done" onclick={() => (pending = null)}>{t('import_annule')}</button>
      </div>
    {/if}
    {#if importMsg}<p class={importMsg.ok ? 'okmsg' : 'warn'} role="status">{importMsg.text}</p>{/if}
    {#if resetAsk}
      <div class="card" role="alertdialog" aria-label={t('reset')}>
        <p>{t('reset_ask')}</p>
        <button class="big danger" onclick={doReset}>{t('reset_confirm')}</button>
        <button class="big done" onclick={() => (resetAsk = false)}>{t('import_annule')}</button>
      </div>
    {:else}
      <button class="big done" onclick={() => (resetAsk = true)}>{t('reset')}</button>
    {/if}
  {:else if day}
    <article>
      <p class="kicker">{t('semaine')} {day.semaine} · {t('jour_n')} {day.jour} · {day.type === 'revue' ? t('revue') : day.type === 'apprendre' ? t('apprendre') : t('pratiquer')} · ~{day.minutes} {t('min')}</p>
      <h2>{day.titre}</h2>
      <p class="goal">{day.objectif}</p>
      {#each day.etapes as s, i}<StepCard step={s} index={i} />{/each}
      {#if songsFor(day.jour).songs.length}
        <button class="songlink" onclick={() => go(`/chansons/${day.jour}`)}>{t('lien_chanson')}</button>
      {/if}
      <section class="card">
        <h3>{t('a_ecouter')}</h3>
        <ul>{#each day.ecoute as e}<li>{e}</li>{/each}</ul>
        <h3>{t('autoeval')}</h3>
        <ul>{#each day.autoeval as e}<li>{e}</li>{/each}</ul>
      </section>
      {#if day.type === 'revue' && p.done[day.jour]}
        <section class="card" aria-label={t('note_revue')}>
          <p>{t('note_revue')}</p>
          <div class="stars">
            {#each [1, 2, 3, 4, 5] as r}
              <button class:on={(p.done[day.jour].rating ?? 0) >= r} aria-pressed={p.done[day.jour].rating === r} aria-label="{t('note_n')} {r}/5" onclick={() => rate(day.jour, r)}>★</button>
            {/each}
          </div>
          <p class="note">{t('note_effacer')}</p>
        </section>
      {/if}
      {#if p.done[day.jour]}
        <button class="big done" onclick={() => undo(day.jour)}>{t('fait_le')} {p.done[day.jour].date} — {t('annuler')}</button>
      {:else}
        <button class="big" onclick={() => { done(day.jour); go('/') }}>{t('marquer')}</button>
      {/if}
    </article>
  {:else if outlineOf(dayNum)}
    <article>
      <p class="kicker">{t('semaine')} {Math.ceil(dayNum / 7)} · {t('jour_n')} {dayNum}</p>
      <h2>{outlineTitle(dayNum)}</h2>
      <p class="note">{t('plan_apercu')}</p>
    </article>
  {:else}
    <h2>{t('bravo')}</h2>
    <p>{t('fini')}</p>
  {/if}

  <nav>
    <button class:on={route === '/' || route.startsWith('/jour/')} onclick={() => go('/')}>{t('nav_jour')}</button>
    <button class:on={route === '/plan'} onclick={() => go('/plan')}>{t('nav_plan')}</button>
    <button class:on={route.startsWith('/chansons')} onclick={() => go('/chansons')}>{t('nav_chansons')}</button>
    <button class:on={route === '/vocabulaire'} onclick={() => go('/vocabulaire')}>{t('nav_vocab')}</button>
    <button class:on={route === '/reglages'} onclick={() => go('/reglages')}>{t('nav_reglages')}</button>
  </nav>
</main>

<style>
  main { max-width: 640px; margin: 0 auto; padding: 16px 16px 90px }
  .themes { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; margin-bottom: 16px }
  .th { min-height: 56px; border-radius: 10px; border: 2px solid var(--line); background: var(--card); color: inherit; font-size: 1rem; display: flex; align-items: center; gap: 10px; padding: 8px 12px }
  .th.on { border-color: var(--accent) }
  .sw3 { display: inline-flex } .sw3 i { width: 18px; height: 28px; border: 1px solid #8884 } .sw3 i:first-child { border-radius: 6px 0 0 6px } .sw3 i:last-child { border-radius: 0 6px 6px 0 }
  .top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: -4px 0 6px }
  .themesel { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 700 }
  .themesel select { min-height: 36px; border-radius: 8px; border: 1px solid var(--line); background: var(--card); color: inherit; font-size: 0.95rem; padding: 0 8px }
  .lang { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 700 }
  .lang span { opacity: 0.5 } .lang span.on { opacity: 1; color: var(--accent) }
  .sw { position: relative; width: 48px; height: 26px; min-height: 0; border-radius: 13px; border: 1px solid var(--line); background: var(--board); padding: 0; cursor: pointer }
  .sw i { position: absolute; top: 2px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: var(--accent); transition: transform 0.15s }
  .sw[aria-checked='true'] i { transform: translateX(21px) }
  h1 { font-size: 1.3rem; margin: 0; color: var(--accent) }
  .meta { color: var(--gold-text); font-weight: 600 }
  .meta, .tune { margin: 4px 0; font-size: 0.9rem }
  .kicker { color: var(--accent2); opacity: 1; font-weight: 600; font-size: 0.85rem; margin: 16px 0 0 }
  h2 { margin: 4px 0 }
  .goal { font-size: 1.05rem }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px; margin: 12px 0 }
  .card h3 { margin: 8px 0 }
  .big { width: 100%; min-height: 56px; border-radius: 12px; border: 0; background: var(--accent); color: var(--on-accent); font-size: 1.1rem; font-weight: 600; margin-top: 8px }
  .big.done { background: var(--card); color: inherit; border: 1px solid var(--line) }
  .grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px }
  .cell { aspect-ratio: 1; border-radius: 8px; border: 1px solid var(--line); background: var(--card); color: inherit; font-size: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center }
  .cell small { font-size: 0.55rem }
  .cell.done { background: var(--accent2); color: var(--on-accent2); border-color: var(--accent2) }
  .cell.soon { opacity: 0.45 }
  .wk { margin: 14px 0 6px; font-size: 0.95rem; color: var(--accent2) }
  .songlink { width: 100%; min-height: 48px; margin: 4px 0 8px; border-radius: 10px; border: 1px dashed var(--gold); background: transparent; color: inherit; font-size: 1rem }
  .warn { background: var(--card); border: 2px solid var(--accent); border-radius: 10px; padding: 10px 12px; font-size: 0.9rem }
  .okmsg { color: var(--accent2); font-weight: 600 }
  .filebtn { display: flex; align-items: center; justify-content: center; box-sizing: border-box; cursor: pointer; background: var(--card); color: inherit; border: 1px solid var(--line) }
  .big.danger { background: var(--accent) }
  .stars { display: flex; gap: 6px }
  .stars button { flex: 1; min-height: 48px; font-size: 1.5rem; border-radius: 10px; border: 1px solid var(--line); background: var(--card); color: inherit; opacity: 0.55 }
  .stars button.on { opacity: 1; color: var(--gold-text); border-color: var(--gold) }
  .note { opacity: 0.7; font-size: 0.9rem }
  nav { position: fixed; bottom: 0; left: 0; right: 0; display: flex; background: var(--card); border-top: 1px solid var(--line) }
  nav button { flex: 1; min-height: 56px; border: 0; background: transparent; color: inherit; font-size: 0.85rem; padding: 0 2px }
  nav { border-top: 3px solid var(--accent2) }
  nav button.on { color: var(--accent); font-weight: 700; box-shadow: inset 0 3px 0 var(--gold) }
</style>
