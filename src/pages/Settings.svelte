<script lang="ts">
  import { tick } from 'svelte'
  import { buildBackup, parseBackup, applyImport, type ImportResult } from '../state/backup'
  import { store, loadProblem, storageOk, replaceProgress, resetProgress, doneCount, currentStreak } from '../state/store.svelte'
  import { getLastExport, setLastExport, formatLastExport } from '../state/lastExport'
  import { i18n, setLang, t, tf } from '../i18n.svelte'
  import { THEMES, theme, setTheme, type Theme } from '../theme.svelte'
  import { getA4, setA4, onA4 } from '../audio/a4'
  import { A4_MIN, A4_MAX, A4_DEFAULT } from '../audio/pitch'
  import { playTone } from '../audio/engine'
  import PupitreToggle from '../ui/PupitreToggle.svelte'
  import ThemePicker from '../ui/ThemePicker.svelte'
  import Stepper from '../ui/Stepper.svelte'
  import Icon from '../ui/Icon.svelte'

  // --- Export / import ---
  let lastExport = $state(getLastExport())
  const lastLabel = $derived(formatLastExport(lastExport, i18n.lang) ?? t('export_jamais'))

  function exportData() {
    const a = document.createElement('a')
    const url = URL.createObjectURL(new Blob([JSON.stringify(buildBackup(store.p, { lang: i18n.lang, theme: theme.name }), null, 1)], { type: 'application/json' }))
    a.href = url
    a.download = i18n.lang === 'en' ? 'cadien-fiddle-progress.json' : 'violon-cadien-progres.json'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setLastExport()
    lastExport = getLastExport()
  }

  let fileInput: HTMLInputElement
  let pending = $state<Extract<ImportResult, { ok: true }> | null>(null)
  let importMsg = $state<{ ok: boolean; text: string } | null>(null)
  const errKey = { json: 'err_json', format: 'err_format', future: 'err_future', data: 'err_data' } as const

  async function pickFile(e: Event & { currentTarget: HTMLInputElement }) {
    const f = e.currentTarget.files?.[0]
    e.currentTarget.value = ''
    pending = null
    importMsg = null
    if (!f) return
    let text = ''
    try { text = await f.text() } catch { importMsg = { ok: false, text: t('import_ko') }; return }
    const r = parseBackup(text, THEMES)
    if (r.ok) pending = r
    else importMsg = { ok: false, text: t(errKey[r.error]) + ' ' + t('import_ko') }
  }
  function doImport(mode: 'merge' | 'replace') {
    if (!pending) return
    replaceProgress(applyImport(store.p, pending.progress, mode))
    if (mode === 'replace') {
      if (pending.prefs.lang) setLang(pending.prefs.lang)
      if (pending.prefs.theme) setTheme(pending.prefs.theme as Theme)
    }
    pending = null
    importMsg = { ok: true, text: t('import_ok') }
  }

  // --- La de référence (lié à l'accordeur : même réglage, mêmes abonnés) ---
  let a4 = $state(getA4())
  $effect(() => onA4((v) => { if (v !== a4) a4 = v }))
  $effect(() => {
    if (a4 !== getA4()) { setA4(a4); a4 = getA4() }
  })

  // --- Réinitialisation en deux temps ---
  let resetAsk = $state(false)
  let resetBtn = $state<HTMLButtonElement>()
  let askText = $state<HTMLParagraphElement>()
  const plural = (n: number, one: 'n_jour' | 'n_jour_fait', many: 'n_jours' | 'n_jours_faits') => tf(n === 1 ? one : many, { n })
  const askTitle = $derived(tf('reset_titre_ask', { done: plural(doneCount(), 'n_jour_fait', 'n_jours_faits'), streak: plural(currentStreak(), 'n_jour', 'n_jours') }))
  async function openReset() { resetAsk = true; await tick(); askText?.focus() }
  async function closeReset() { resetAsk = false; await tick(); resetBtn?.focus() }
  function doReset() { resetProgress(); resetAsk = false; importMsg = { ok: true, text: t('reset_done') } }
</script>

<h2>{t('reglages')}</h2>

<section class="card" aria-labelledby="s-theme">
  <h3 id="s-theme">{t('theme')}</h3>
  <ThemePicker />
  <p class="note">{t('set_theme_note')}</p>
</section>

<section class="card"><PupitreToggle /></section>

<section class="card" aria-labelledby="s-a4">
  <h3 id="s-a4"><span class="ic"><Icon name="tune" size={24} /></span>{t('a4_titre')}</h3>
  <p class="note lead">{t('a4_intro')}</p>
  <div class="a4row">
    <div class="field">
      <span class="lbl">{t('a4_label')}</span>
      <Stepper bind:value={a4} min={A4_MIN} max={A4_MAX} label={t('a4_aria')} decLabel={t('a4_dec')} incLabel={t('a4_inc')} />
    </div>
    <button type="button" class="btn outline grow" onclick={() => playTone(69, 2)}><Icon name="play" size={18} />{t('a4_play')}</button>
  </div>
  {#if a4 !== A4_DEFAULT}<button type="button" class="link" onclick={() => setA4(A4_DEFAULT)}>{t('calib_reset')}</button>{/if}
</section>

<section class="card" aria-labelledby="s-prog">
  <h3 id="s-prog">{t('prog_titre')}</h3>
  <p class="note lead">{t('prog_intro')}</p>
  {#if !storageOk}<p class="warn" role="alert">{t('stockage_indispo')}</p>{/if}
  {#if loadProblem === 'corrupt'}<p class="warn" role="alert">{t('stockage_corrompu')}</p>{/if}
  {#if loadProblem === 'future'}<p class="warn" role="alert">{t('stockage_futur')}</p>{/if}
  <button type="button" class="btn primary" onclick={exportData}><Icon name="export" size={20} />{t('exporter')}</button>
  <button type="button" class="btn outline" onclick={() => fileInput.click()}><Icon name="import" size={20} />{t('importer')}</button>
  <input bind:this={fileInput} class="file" type="file" accept="application/json,.json" onchange={pickFile} tabindex="-1" aria-hidden="true" />
  <p class="note">{t('import_note')}</p>
  <span class="note last">{t('export_dernier')} : {lastLabel}</span>
  {#if pending}
    <div class="pending" role="group" aria-label={t('importer')}>
      <p>{t('import_trouve')} : <b>{Object.keys(pending.progress.done).length}</b></p>
      <button type="button" class="btn primary" onclick={() => doImport('merge')}>{t('import_fusion')}</button>
      <button type="button" class="btn outline" onclick={() => doImport('replace')}>{t('import_remplace')}</button>
      <p class="note">{t('import_prefs_note')}</p>
      <button type="button" class="btn plain" onclick={() => (pending = null)}>{t('import_annule')}</button>
    </div>
  {/if}
  {#if importMsg}<p class={importMsg.ok ? 'okmsg' : 'warn'} role="status">{importMsg.text}</p>{/if}
</section>

<section class="card danger" aria-labelledby="s-reset">
  <h3 id="s-reset"><span class="ic red"><Icon name="reset" size={22} /></span>{t('reset_titre')}</h3>
  {#if !resetAsk}
    <p class="note lead">{t('reset_intro')}</p>
    <button type="button" class="btn red-outline" bind:this={resetBtn} onclick={openReset}>{t('reset_ouvrir')}</button>
  {:else}
    <div role="alertdialog" aria-labelledby="reset-q" aria-describedby="reset-w">
      <p id="reset-q" class="ask" tabindex="-1" bind:this={askText}><b>{askTitle}</b></p>
      <p id="reset-w" class="note lead">{t('reset_avertit')}</p>
      <div class="two">
        <button type="button" class="btn plain" onclick={closeReset}>{t('reset_garder')}</button>
        <button type="button" class="btn red" onclick={doReset}>{t('reset_confirm')}</button>
      </div>
    </div>
  {/if}
</section>

<footer class="foot">
  <span class="lys"><Icon name="lys" size={28} /></span>
  <span>{t('foot_gratuit')}</span>
</footer>

<style>
  h2 { margin: 4px 0 var(--s-4); font-size: var(--t-xl) }
  h3 { margin: 0; font-family: var(--font-text); font-size: var(--t-md); display: flex; align-items: center; gap: 10px }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: var(--r); padding: var(--s-4); margin: 0 0 var(--s-4); display: flex; flex-direction: column; gap: var(--s-3) }
  .card.danger { border: 2px solid var(--accent2) }
  .ic { color: var(--accent); display: inline-flex }
  .ic.red { color: var(--accent2) }
  .note { margin: 0; color: var(--muted); font-size: var(--t-sm) }
  .note.lead { font-size: var(--t-base) }
  .last { font-variant-numeric: tabular-nums }

  .a4row { display: flex; align-items: flex-end; gap: var(--s-3); flex-wrap: wrap }
  .field { display: flex; flex-direction: column; gap: 4px }
  .lbl { font-size: var(--t-sm); font-weight: 700; color: var(--muted) }
  .grow { flex: 1; min-width: 140px }

  .btn { min-height: 52px; border-radius: var(--r); font-size: var(--t-base); font-weight: 700; display: flex; align-items: center; justify-content: center; gap: var(--s-2); cursor: pointer; box-sizing: border-box; padding: 0 var(--s-4); width: 100% }
  .a4row .btn { width: auto }
  .btn.primary { background: var(--accent); color: var(--on-accent); border: 2px solid var(--accent) }
  .btn.outline { background: transparent; color: var(--accent); border: 2px solid var(--accent) }
  .btn.plain { background: transparent; color: var(--fg); border: 2px solid var(--fg) }
  .btn.red { background: var(--accent2); color: var(--on-accent2); border: 2px solid var(--accent2) }
  .btn.red-outline { background: transparent; color: var(--accent2); border: 2px solid var(--accent2) }
  .link { align-self: flex-start; background: transparent; border: 0; padding: 0; color: var(--accent); text-decoration: underline; font-size: var(--t-sm); cursor: pointer }

  .file { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap }
  .pending { display: flex; flex-direction: column; gap: var(--s-2); padding: var(--s-3); border: 1px solid var(--line); border-radius: var(--r); background: var(--bg) }
  .pending p { margin: 0 }
  .warn { margin: 0; background: var(--bg); border: 2px solid var(--accent2); border-radius: 10px; padding: 10px 12px; font-size: var(--t-sm) }
  .okmsg { margin: 0; color: var(--fg); font-weight: 700 }
  .ask { margin: 0 0 var(--s-2); font-size: var(--t-base); line-height: 1.5 }
  .ask:focus { outline-offset: 3px }
  .two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: var(--s-3) }
  .two .btn { width: auto }

  .foot { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: var(--s-4) 0 0; color: var(--muted); font-size: var(--t-sm); text-align: center }
  .lys { color: var(--accent2); display: inline-flex }
</style>
