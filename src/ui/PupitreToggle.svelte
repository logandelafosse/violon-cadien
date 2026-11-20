<script lang="ts">
  // Interrupteur « Mode pupitre » des Réglages (role="switch", libellé et description visibles).
  import { pupitre, setPupitre } from '../pupitre.svelte'
  import { t } from '../i18n.svelte'
  const id = $props.id()
</script>

<section class="row">
  <div class="txt">
    <label for="{id}-sw">{t('pup_titre')}</label>
    <p id="{id}-d">{t('pup_desc')}</p>
  </div>
  <input id="{id}-sw" type="checkbox" role="switch" checked={pupitre.on} aria-describedby="{id}-d" onchange={(e) => setPupitre(e.currentTarget.checked)} />
</section>

<style>
  .row { display: flex; align-items: center; justify-content: space-between; gap: var(--s-4); background: var(--card); border: 1px solid var(--line); border-radius: var(--r); padding: var(--s-4); margin: var(--s-4) 0 }
  .txt { min-width: 0 }
  label { font-family: var(--font-title); font-weight: 700; font-size: var(--t-md) }
  p { margin: var(--s-1) 0 0; color: var(--muted); font-size: var(--t-sm); line-height: var(--lh) }
  input[type='checkbox'] { appearance: none; flex: none; width: 56px; height: 32px; min-height: 0; border-radius: var(--r-pill); border: 2px solid var(--fg); background: transparent; position: relative; cursor: pointer; margin: 0; vertical-align: middle }
  input[type='checkbox']::before { content: ''; position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 50%; background: var(--fg); transition: transform 120ms, background 120ms }
  input[type='checkbox']:checked { background: var(--accent); border-color: var(--accent) }
  input[type='checkbox']:checked::before { transform: translateX(24px); background: var(--on-accent) }
</style>
