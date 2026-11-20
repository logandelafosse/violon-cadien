<script lang="ts">
  import { router, go } from '../router.svelte'
  import { t } from '../i18n.svelte'

  const route = $derived(router.route)
</script>

<nav>
  <button class:on={route === '/' || route.startsWith('/jour/')} onclick={() => go('/')}>{t('nav_jour')}</button>
  <button class:on={route === '/plan'} onclick={() => go('/plan')}>{t('nav_plan')}</button>
  <button class:on={route.startsWith('/chansons')} onclick={() => go('/chansons')}>{t('nav_chansons')}</button>
  <button class:on={route === '/vocabulaire'} onclick={() => go('/vocabulaire')}>{t('nav_vocab')}</button>
  <button class:on={route === '/reglages'} onclick={() => go('/reglages')}>{t('nav_reglages')}</button>
</nav>

<style>
  nav { position: fixed; bottom: 0; left: 0; right: 0; display: flex; background: var(--card); border-top: 3px solid var(--accent2) }
  nav button { flex: 1; min-height: 56px; border: 0; background: transparent; color: inherit; font-size: 0.85rem; padding: 0 2px }
  nav button.on { color: var(--accent); font-weight: 700; box-shadow: inset 0 3px 0 var(--gold) }
</style>
