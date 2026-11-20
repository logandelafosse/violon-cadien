<script lang="ts">
  import { buildBackup, parseBackup, applyImport, type ImportResult } from '../state/backup'
  import { store, loadProblem, storageOk, replaceProgress, resetProgress } from '../state/store.svelte'
  import { i18n, setLang, t, type Key } from '../i18n.svelte'
  import { THEMES, SWATCH, theme, setTheme, type Theme } from '../theme.svelte'
  import PupitreToggle from '../ui/PupitreToggle.svelte'

  function exportData() {
    const a = document.createElement('a')
    const url = URL.createObjectURL(new Blob([JSON.stringify(buildBackup(store.p, { lang: i18n.lang, theme: theme.name }), null, 1)], { type: 'application/json' }))
    a.href = url
    a.download = i18n.lang === 'en' ? 'cadien-fiddle-progress.json' : 'violon-cadien-progres.json'; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

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
    replaceProgress(applyImport(store.p, pending.progress, mode))
    if (mode === 'replace') {
      if (pending.prefs.lang) setLang(pending.prefs.lang)
      if (pending.prefs.theme) setTheme(pending.prefs.theme as Theme)
    }
    pending = null; importMsg = { ok: true, text: t('import_ok') }
  }
  function doReset() { resetProgress(); resetAsk = false; importMsg = { ok: true, text: t('reset_done') } }
</script>

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
<PupitreToggle />
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

<style>
  h2 { margin: 4px 0 }
  .themes { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; margin-bottom: 16px }
  .th { min-height: 56px; border-radius: 10px; border: 2px solid var(--line); background: var(--card); color: inherit; font-size: 1rem; display: flex; align-items: center; gap: 10px; padding: 8px 12px }
  .th.on { border-color: var(--accent) }
  .sw3 { display: inline-flex } .sw3 i { width: 14px; height: 28px; border: 1px solid #8884 } .sw3 i:first-child { border-radius: 6px 0 0 6px } .sw3 i:last-child { border-radius: 0 6px 6px 0 }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px; margin: 12px 0 }
  .big { width: 100%; min-height: 56px; border-radius: 12px; border: 0; background: var(--accent); color: var(--on-accent); font-size: 1.1rem; font-weight: 600; margin-top: 8px }
  .big.done { background: var(--card); color: inherit; border: 1px solid var(--line) }
  .big.danger { background: var(--accent) }
  .filebtn { display: flex; align-items: center; justify-content: center; box-sizing: border-box; cursor: pointer; background: var(--card); color: inherit; border: 1px solid var(--line) }
  .warn { background: var(--card); border: 2px solid var(--accent); border-radius: 10px; padding: 10px 12px; font-size: 0.9rem }
  .okmsg { color: var(--accent2); font-weight: 600 }
  .note { color: var(--muted); font-size: 0.9rem }
</style>
