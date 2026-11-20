<script lang="ts">
  // Bouton « Ouvrir au pupitre » de la page d'un jour : active le mode ; App.svelte affiche alors la vue plein écran.
  import { setPupitre } from '../pupitre.svelte'
  import { t } from '../i18n.svelte'
  import Icon from './Icon.svelte'
</script>

<button type="button" class="launch" onclick={() => setPupitre(true)}><Icon name="pupitre" size={20} />{t('pup_ouvrir')}</button>

<style>
  .launch { display: inline-flex; align-items: center; gap: var(--s-2); min-height: var(--touch); padding: 0 var(--s-4); border: 2px solid var(--accent); border-radius: var(--r); background: transparent; color: var(--accent); font-weight: 700; font-size: var(--t-base); cursor: pointer; margin: var(--s-2) 0 }
</style>
